import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import Group from "@/app/lib/database/models/group.model";
import Round from "@/app/lib/database/models/round.model";
import Member from "@/app/lib/database/models/members.model";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, group_count, players, teeTimeInterval, is_tourn } = body;

    // Validate request data
    if (!date || !time || !group_count || !players || !teeTimeInterval || is_tourn === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if an event already exists on the given date
    const existingEvent = await Event.findOne({ date });
    if (existingEvent) {
      return NextResponse.json(
        { error: "An event already exists on this date, you can delete the current event before creating a new one" },
        { status: 400 }
      );
    }

    // Fetch member details (id, name, sex)
    const playerDetails = await Member.find({ id: { $in: players } }).select("id sex");

    // Separate males and females
    let femalePlayers = playerDetails.filter(player => player.sex === "Female").map(player => player.id);
    let malePlayers = playerDetails.filter(player => player.sex === "Male").map(player => player.id);

    // Shuffle and merge players
    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    }

    function insertFemalesAtValidIndex(males: number[], females: number[]) {
      const maleQueueLength = males.length;
      const validInsertionIndices = [];
      for (let i = 4; i <= maleQueueLength + females.length; i += 4) {
        validInsertionIndices.push(i);
      }
      const randomIndex = validInsertionIndices[Math.floor(Math.random() * validInsertionIndices.length)];
      const playerqueue = [...males];
      playerqueue.splice(randomIndex, 0, ...females);
      return playerqueue;
    }

    shuffleArray(malePlayers);
    shuffleArray(femalePlayers);

    const playerQueue = insertFemalesAtValidIndex(malePlayers, femalePlayers);

    // Create a new Event
    const newEvent = new Event({
      date,
      is_tourn: is_tourn,
    });

    await newEvent.save();

    // Generate Groups based on `group_count`
    const groups: any[] = [];
    const baseTime = new Date(`${date}T${time}:00`);

    // Create groups based on the player queue
    while (playerQueue.length > 0) {
      const groupTime = new Date(baseTime.getTime() + groups.length * teeTimeInterval * 60000);

      const group = new Group({
        date,
        time: groupTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      await group.save();

      const groupPlayersIds = playerQueue.splice(0, 4);
      const groupPlayers = await Member.find({ id: { $in: groupPlayersIds } }).select('_id');
      const rounds: any[] = [];

      for (let player of groupPlayers) {
        const round = new Round({ member: player });
        await round.save();
        rounds.push(round._id);
      }

      group.rounds = rounds;
      await group.save();
      groups.push(group);
    }

    // If the number of groups is less than the group_count, create empty groups
    for (let i = groups.length; i < group_count; i++) {
      const groupTime = new Date(baseTime.getTime() + i * teeTimeInterval * 60000);
      const group = new Group({
        date,
        time: groupTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        rounds: [], // No rounds in the empty group
      });

      await group.save();
      groups.push(group);
    }

    newEvent.groups = groups.map(group => group._id);
    await newEvent.save();

    return NextResponse.json({ message: "Event created with groups and rounds successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
