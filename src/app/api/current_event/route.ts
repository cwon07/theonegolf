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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 

    // Fetch events with a single query and lean optimization
    const events = await Event.find({ date: { $gte: yesterday.toISOString().split("T")[0] } }).lean();

    if (events.length === 0) {
      return NextResponse.json({ error: "No upcoming events found" }, { status: 404 });
    }

    // Get all event IDs for bulk querying
    const eventIds = events.map((event) => event._id);

    // Fetch groups related to the events in bulk
    const groups = await Group.find({
      event_id: { $in: eventIds.map(id => new mongoose.Types.ObjectId(String(id))) } // Convert event IDs to ObjectId
    }).lean();


    // Fetch rounds in bulk
    const roundIds = groups.flatMap((group) => group.rounds).filter(Boolean); // Extract round IDs
    const rounds = await Round.find({ _id: { $in: roundIds } }).lean(); // Fetch rounds

    // Get all member IDs for bulk querying
    const memberIds = rounds.map((round) => round.members).filter(Boolean); // Remove undefined/null

    // Fetch members in bulk
    const members = await Member.find({ id: { $in: memberIds } }).select("id name sex").lean();

    // Convert members array to a map for quick lookup
    const memberMap = new Map(members.map((member) => [member.id, member]));

    // Map rounds to include member details
    const roundsWithMembers = rounds.map((round) => ({
      ...round,
      members: memberMap.get(round.members) ? [{ ...memberMap.get(round.members) }] : [],
    }));

    // Convert rounds array to a map for quick lookup
    const roundsMap = new Map(roundsWithMembers.map((round) => [String(round._id), round]));

    // Map groups to include rounds
    const groupsWithRounds = groups.map((group) => ({
      ...group,
      rounds: group.rounds.map((roundId: String) => roundsMap.get(roundId.toString()) || {}),
    }));

    // Construct final event details
    const eventDetails = events.map((event) => ({
      event_id: event._id,
      date: event.date,
      time: event.time,
      group_count: event.group_count,
      players: event.players,
      groups: groupsWithRounds
    }));

    return NextResponse.json(eventDetails);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
