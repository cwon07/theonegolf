import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; // Adjust the path as needed
import Event from "@/app/lib/database/models/event.model"; // Your Event model
import Group from "@/app/lib/database/models/group.model"; // Your Group model
import Round from "@/app/lib/database/models/round.model"; // Your Round model
import Member from "@/app/lib/database/models/members.model"; // Your Member model

export async function POST(req: Request) {
    try {
      // Parse the request body to get memberIds and event data
      const { memberIds, event } = await req.json();
  
      console.log("Received event:", event); // Log the entire event to see its structure
      console.log("Received memberIds:", memberIds); // Log the memberIds
  
      // Validate that memberIds is an array of numbers with length 2
      if (!Array.isArray(memberIds) || memberIds.length !== 2 || typeof memberIds[0] !== 'number' || typeof memberIds[1] !== 'number') {
        return NextResponse.json({ error: "Invalid input data. Member IDs should be an array of two numbers." }, { status: 400 });
      }
  
      // Rest of your logic here...
  
      return NextResponse.json({ message: "Request processed successfully" });
    } catch (error) {
      console.error("Error processing the request:", error);
      return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
    }
  }