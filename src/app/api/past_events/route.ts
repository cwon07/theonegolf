import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from "mongoose";
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    let todayPST = new Date();
    todayPST.setHours(todayPST.getHours() - 7); // Adjust for UTC-7 (PST)

    // Fetch all past events
    let events = await Event.find({ date: { $gte: todayPST.toISOString().split("T")[0] } })
    .populate([
      { path: "m_total_stroke", select: "id name handicap" },
      { path: "w_total_stroke", select: "id name handicap" },
      { path: "m_net_stroke_1", select: "id name handicap" },
      { path: "m_net_stroke_2", select: "id name handicap" },
      { path: "m_net_stroke_3", select: "id name handicap" },
      { path: "m_net_stroke_4", select: "id name handicap" },
      { path: "m_net_stroke_5", select: "id name handicap" },
      { path: "w_net_stroke_1", select: "id name handicap" },
      { path: "w_net_stroke_2", select: "id name handicap" },
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
      return NextResponse.json({ error: "No past events found" }, { status: 404 });
    }

    // Get all group IDs from events
    const groupIds = events.flatMap(event => event.groups).filter(Boolean);
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();

    // Get all round IDs from groups
    const roundIds = groups.flatMap(group => group.rounds).filter(Boolean);
    const rounds = await Round.find({ _id: { $in: roundIds } }).lean(); 

    // Get all member IDs from rounds
    const memberIds = rounds.flatMap(round => (round.member ? [round.member] : [])).filter(Boolean);
    const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex handicap").lean();

    // Map members to their respective rounds
    const roundsWithMembers = rounds.map(round => ({
      ...round,
      member: members.find(member => String(member._id) === String(round.member)) || null
    }));

    // Map rounds back to their groups
    const groupsWithRounds = groups.map(group => ({
      ...group,
      rounds: group.rounds
        .map((roundId: mongoose.Types.ObjectId) => roundsWithMembers.find(round => String(round._id) === String(roundId)))
        .filter(Boolean) // Remove any unmatched rounds
    }));

    // Map groups back to their events
    const eventsWithGroups = events.map(event => ({
      ...event,
      groups: event.groups
        .map((groupId: mongoose.Types.ObjectId) => groupsWithRounds.find(group => String(group._id) === String(groupId)))
        .filter(Boolean) // Remove any unmatched groups
    }));

    return NextResponse.json(eventsWithGroups);

  } catch (error) {
    console.error("Error fetching past events:", error);
    return NextResponse.json({ error: "Failed to fetch past events" }, { status: 500 });
  }
}

