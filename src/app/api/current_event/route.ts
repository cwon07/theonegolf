import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from "mongoose"
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Fetch events occurring today or in the future
    let events = await Event.find({ date: { $gte: yesterday.toISOString().split("T")[0] } }).lean();

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
    const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex handicap").lean();

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
    const eventDetails = events.map((event) => ({
      event_id: event._id,
      date: event.date,
      is_tourn: event.is_tourn,
      groups: groupsWithRounds,
    }));

    //console.log(eventDetails);  // Pretty-print the structure

    return NextResponse.json(eventDetails);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
