import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import Group from "@/app/lib/database/models/group.model";
import Round from "@/app/lib/database/models/round.model";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Ensure JSON is properly parsed
    console.log("Received body:", body);

    const { date, time, group_count, players } = body; // Including players

    // Validate request data
    if (!date || !time || !group_count || !players) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    await connectToDatabase();

    const convertToAMPM = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
    
      // Determine AM or PM
      const period = hours >= 12 ? 'PM' : 'AM';
    
      // Convert to 12-hour format
      const newHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      const newMinutes = minutes.toString().padStart(2, '0'); // Ensure minutes are always 2 digits
    
      return `${newHours}:${newMinutes} ${period}`;
    };

    // Create a new Event (No `time` or `players` field here anymore)
    const newEvent = new Event({
      date,
      time: convertToAMPM(time),
      group_count,
      players,
    });

    await newEvent.save();
    console.log("Event saved successfully:", newEvent);

    // Generate Groups based on `group_count`
    const groups: any[] = [];
    const baseTime = new Date(`${date}T${time}:00`);

    let playerIndex = 0; // Player index tracker to assign players to groups

    // Create groups based on the group_count
    for (let i = 0; i < group_count; i++) {
      const groupTime = new Date(baseTime.getTime() + i * 15 * 60000); // Add 15 minutes for each subsequent group

      // 1. Create Group with time
      const group = new Group({
        event_id: newEvent._id,
        date: date, // Event date
        time: groupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time
      });

      await group.save();
      console.log(`Group ${i + 1} created with time: ${groupTime}`);
      
      // Distribute players into rounds for this group
      const groupPlayers = players.slice(playerIndex, playerIndex + 4); // Each group gets 4 players
      playerIndex += 4; // Move the player index forward by 4

      // 2. Create rounds for this group
      const rounds: any[] = [];
      for (let j = 0; j < groupPlayers.length; j++) {
        const round = new Round({
          members: groupPlayers[j], // 1 player per round
        });
        await round.save();
        rounds.push(round._id);
      }

      // 3. Assign rounds to the group
      group.rounds = rounds;
      await group.save();
    }

    return NextResponse.json({ message: "Event created with groups and rounds successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}