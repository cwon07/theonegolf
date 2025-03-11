import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import Group from "@/app/lib/database/models/group.model";
import Round from "@/app/lib/database/models/round.model";
import Member from "@/app/lib/database/models/members.model"; // Import Member model to get player details

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { date, time, group_count, players, teeTimeInterval } = body;

    // Validate request data
    if (!date || !time || !group_count || !players) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    await connectToDatabase();

    const convertToAMPM = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const newHours = hours % 12 || 12;
      const newMinutes = minutes.toString().padStart(2, '0');
      return `${newHours}:${newMinutes} ${period}`;
    };

    // Fetch member details (id, name, sex)
    const playerDetails = await Member.find({ id: { $in: players } }).select("id sex");

    // Separate males and females
    let femalePlayers = playerDetails.filter(player => player.sex === "Female").map(player => player.id);
    let malePlayers = playerDetails.filter(player => player.sex === "Male").map(player => player.id);

    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    }

    // **Shuffle females first before grouping them**
    shuffleArray(femalePlayers);
    shuffleArray(malePlayers);

    // Create a new Event
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

    let playerQueue = [...femalePlayers]; // Start with females first

    while (playerQueue.length > 0 || malePlayers.length > 0) {
      const groupTime = new Date(baseTime.getTime() + groups.length * teeTimeInterval * 60000);

      // 1. Create Group
      const group = new Group({
        event_id: newEvent._id,
        date,
        time: groupTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      await group.save();
      console.log(`Group ${groups.length + 1} created with time: ${groupTime}`);

      // Get 4 players for this group (prioritize female players first)
      let groupPlayers: number[] = [];
      while (groupPlayers.length < 4 && playerQueue.length > 0) {
        groupPlayers.push(playerQueue.shift()!);
      }

      // If there aren't enough females to complete a group, add males
      while (groupPlayers.length < 4 && malePlayers.length > 0) {
        groupPlayers.push(malePlayers.shift()!);
      }

      // **Shuffle groupPlayers before assigning rounds**
      shuffleArray(groupPlayers);

      // 2. Create rounds for this group
      const rounds: any[] = [];
      for (let player of groupPlayers) {
        const round = new Round({ members: player });
        await round.save();
        rounds.push(round._id);
      }

      // 3. Assign rounds to the group
      group.rounds = rounds;
      await group.save();
      groups.push(group);
    }

    return NextResponse.json({ message: "Event created with groups and rounds successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}