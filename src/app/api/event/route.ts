import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model"; 

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Ensure JSON is properly parsed
    console.log("Received body:", body);

    const { date, time, malePlayers, femalePlayers } = body;

    // Ensure time is formatted correctly (if time is "12:36", add "AM" or "PM")
    let formattedTime = time;
    if (!formattedTime.includes("AM") && !formattedTime.includes("PM")) {
      const isPM = parseInt(time.split(":")[0], 10) >= 12;
      formattedTime += isPM ? " PM" : " AM"; // Add AM or PM based on the hour
    }

    // Validate request data
    if (!date || !time || !malePlayers || !femalePlayers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Split the malePlayers and femalePlayers strings into arrays of player names
    const malePlayersArray = malePlayers.map((player: string) => player.trim());
    const femalePlayersArray = femalePlayers.map((player: string) => player.trim());

    // Create new event using the array values
    const newEvent = new Event({
      date,
      time,
      malePlayers: malePlayersArray,
      femalePlayers: femalePlayersArray,
    });

    await newEvent.save();
        console.log("Event saved successfully:", newEvent);

    return NextResponse.json({ message: "Golf tournament event created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

