import { NextResponse } from "next/server";
import Event from "@/app/lib/database/models/event.model"; // Your Event model
import Group from "@/app/lib/database/models/group.model"; // Your Group model
import Round from "@/app/lib/database/models/round.model"; // Your Round model
import Member from "@/app/lib/database/models/members.model"; // Your Member model

export async function GET(req: Request) {
  try {
    // Fetch all events
    const events = await Event.find();

    if (events.length === 0) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    const eventDetails = await Promise.all(
      events.map(async (event) => {
        // Fetch groups that correspond to the current event
        const groups = await Group.find({ event_id: event._id });

        // For each group, fetch rounds and populate members
        const groupsWithRoundsAndMembers = await Promise.all(
          groups.map(async (group) => {
            // Get rounds using the group rounds _ids
            const rounds = await Round.find({ _id: { $in: group.rounds } });

            console.log(`Rounds found for group ${group._id}:`, rounds);

            // For each round, fetch member details (round.members is a single memberId)
            const roundsWithMembers = await Promise.all(
              rounds.map(async (round) => {
                const member = await Member.findOne({ id: round.members }); // Find member by memberId

                return {
                  ...round,
                  members: member ? [member] : [], // Wrap the member in an array
                };
              })
            );

            return {
              ...group,
              rounds: roundsWithMembers, // Add populated rounds with member names to the group
              date: group.date,           // Add the group date
              time: group.time, 
            };
          })
        );

        // Return the event details including the associated groups and rounds with member names
        return {
          event_id: event._id,        // Get event ID
          date: event.date,           // Get event date
          time: event.time,           // Get event time
          group_count: event.group_count,  // Get group count
          players: event.players,     // Get players array (IDs)
          groups: groupsWithRoundsAndMembers,  // Get groups with rounds and member names
        };
      })
    );

    console.log("Fetched event details with groups and rounds:", eventDetails);  // Log event details with groups and rounds

    return NextResponse.json(eventDetails);  // Return the event details in the response
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}