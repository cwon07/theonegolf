import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from "mongoose"
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Fetch events occurring today or in the future
    let events = await Event.find({ date: { $gte: yesterday.toISOString().split("T")[0] } })
    .populate([
      { path: "m_total_stroke", select: "id name" },
      { path: "w_total_stroke", select: "id name" },
      { path: "m_net_stroke_1", select: "id name" },
      { path: "m_net_stroke_2", select: "id name" },
      { path: "m_net_stroke_3", select: "id name" },
      { path: "m_net_stroke_4", select: "id name" },
      { path: "m_net_stroke_5", select: "id name" },
      { path: "w_net_stroke_1", select: "id name" },
      { path: "w_net_stroke_2", select: "id name" },
      { path: "m_long_drive", select: "id name" },
      { path: "w_long_drive", select: "id name" },
      { path: "close_to_center", select: "id name" },
      { path: "m_close_pin_2", select: "id name" },
      { path: "m_close_pin_7", select: "id name" },
      { path: "m_close_pin_12", select: "id name" },
      { path: "m_close_pin_16", select: "id name" },
      { path: "w_close_pin_7", select: "id name" },
      { path: "w_close_pin_12", select: "id name" },
      { path: "m_bb", select: "id name" },
      { path: "w_bb", select: "id name" },
      { path: "birdies", select: "id name" },
      { path: "eagles", select: "id name" },
      { path: "albatrosses", select: "id name" },
    ])
    .lean();
    if (events.length === 0) {
      return NextResponse.json({ error: "No upcoming events found" }, { status: 404 });
    }

    // Sort events by date, closest to today first
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Select the closest event
    const closestEvent = events[0];

    // Get all group IDs for bulk querying
    const groupIds = closestEvent.groups.filter(Boolean)
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();

    // Fetch rounds in bulk
    const roundIds = groups.flatMap((group) => group.rounds).filter(Boolean);
    const rounds = await Round.find({ _id: { $in: roundIds } }).lean(); 

    // Get all member IDs for bulk querying
    const memberIds = rounds.flatMap((round) => round.member ? [round.member._id] : []).filter(Boolean);
    const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex handicap is_new").lean();

    const roundsWithMembers = rounds.map((round) => {
      const member = members.find((member) => String(member._id) === round.member.toString());
            if (member) {
        return { ...round, member }; 
      }
      return round;
    });

    const groupsWithRounds = groups.map((group) => {
      const roundsForGroup = group.rounds.map((roundId: mongoose.Types.ObjectId) => {
        const round = roundsWithMembers.find((round) => String(round._id) === String(roundId)); // Use roundsWithMembers here
        if (round) {
          return { ...round };  // return the round with the attached member
        }
        return round;  // Return the round if no member found
      });
      return { ...group, rounds: roundsForGroup };  // Attach rounds to group
    });

    // Construct final event details
    const eventDetails = {
      event_id: closestEvent._id,
      date: closestEvent.date,
      is_tourn: closestEvent.is_tourn,
      groups: groupsWithRounds,
      m_total_stroke: closestEvent.m_total_stroke || null,
      w_total_stroke: closestEvent.w_total_stroke || null,
      m_net_stroke_1: closestEvent.m_net_stroke_1 || null,
      m_net_stroke_2: closestEvent.m_net_stroke_2 || null,
      m_net_stroke_3: closestEvent.m_net_stroke_3 || null,
      m_net_stroke_4: closestEvent.m_net_stroke_4 || null,
      m_net_stroke_5: closestEvent.m_net_stroke_5 || null,
      w_net_stroke_1: closestEvent.w_net_stroke_1 || null,
      w_net_stroke_2: closestEvent.w_net_stroke_2 || null,
      m_long_drive: closestEvent.m_long_drive || null,
      w_long_drive: closestEvent.w_long_drive || null,
      close_to_center: closestEvent.close_to_center || null,
      m_close_pin_2: closestEvent.m_close_pin_2 || null,
      m_close_pin_7: closestEvent.m_close_pin_7 || null,
      m_close_pin_12: closestEvent.m_close_pin_12 || null,
      m_close_pin_16: closestEvent.m_close_pin_16 || null,
      w_close_pin_7: closestEvent.w_close_pin_7 || null,
      w_close_pin_12: closestEvent.w_close_pin_12 || null,
      m_bb: closestEvent.m_bb || null,
      w_bb: closestEvent.w_bb || null,
      birdies: closestEvent.birdies || [],
      eagles: closestEvent.eagles || [],
      albatrosses: closestEvent.albatrosses || [],
    };

    return NextResponse.json(eventDetails);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// ADD: Add a new round to a group
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { groupId, memberId } = await req.json();

    if (!groupId || !memberId) {
      return NextResponse.json({ error: "Missing groupId or memberId" }, { status: 400 });
    }

    // Verify the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Verify the member exists
    const member = await Member.findOne({ id: Number(memberId) });
    console.log("Found member:", member); // Debug log
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Create a new round
    console.log("using member._id:",  member._id ); // Debug log
    const newRound = new Round({member});
    await newRound.save();

    // Add the round to the group
    await Group.updateOne(
      { _id: groupId },
      { $push: { rounds: newRound._id } }
    );

    return NextResponse.json({ message: "Round added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding round:", error);
    return NextResponse.json({ error: "Failed to add round" }, { status: 500 });
  }
}

// MOVE: Move a round from one group to another
export async function PUT(req: Request) {
  try {
    await connectToDatabase();

    const { roundId, currentGroupId, newGroupId } = await req.json();
    console.log("PUT request received with:", { roundId, currentGroupId, newGroupId }); // Debug log

    if (!roundId || !currentGroupId || !newGroupId) {
      return NextResponse.json(
        { error: "Missing roundId, currentGroupId, or newGroupId" },
        { status: 400 }
      );
    }

    const currentGroup = await Group.findById(currentGroupId);
    const newGroup = await Group.findById(newGroupId);
    if (!currentGroup || !newGroup) {
      return NextResponse.json({ error: "One or both groups not found" }, { status: 404 });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (!currentGroup.rounds.some((r: mongoose.Types.ObjectId) => r.toString() === roundId)) {
      return NextResponse.json({ error: "Round not found in current group" }, { status: 404 });
    }

    await Group.updateOne(
      { _id: currentGroupId },
      { $pull: { rounds: round._id } }
    );

    await Group.updateOne(
      { _id: newGroupId },
      { $push: { rounds: round._id } }
    );

    return NextResponse.json({ message: "Round moved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error moving round:", error);
    return NextResponse.json({ error: "Failed to move round" }, { status: 500 });
  }
}

// DELETE: Remove a round from a group
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    const { groupId, roundId } = await req.json();

    if (!groupId || !roundId) {
      return NextResponse.json({ error: "Missing groupId or roundId" }, { status: 400 });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const round = await Round.findById(roundId);
    if (!round || !group.rounds.some((r: mongoose.Types.ObjectId) => r.toString() === roundId)) {
      return NextResponse.json({ error: "Round not found in group" }, { status: 404 });
    }

    await Group.updateOne(
      { _id: groupId },
      { $pull: { rounds: round._id } }
    );

    await Round.deleteOne({ _id: round._id });

    return NextResponse.json({ message: "Round deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting round:", error);
    return NextResponse.json({ error: "Failed to delete round" }, { status: 500 });
  }
}
