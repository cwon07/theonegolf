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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 

    // Fetch all past events
    const events = await Event.find({ date: { $lte: yesterday.toISOString().split("T")[0] } }).lean();

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
    const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex").lean();

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

    console.log(eventsWithGroups)

    return NextResponse.json(eventsWithGroups);

  } catch (error) {
    console.error("Error fetching past events:", error);
    return NextResponse.json({ error: "Failed to fetch past events" }, { status: 500 });
  }
}

