// app/api/members/list/route.ts
import { connectToDatabase } from "@/app/lib/database"; // Adjust the path as needed
import Member from "@/app/lib/database/models/members.model"; // Adjust the path as needed
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase(); // Connect to the database
    // Fetch all members from the database
    const members = await Member.find();

    // Return the list of members as a JSON response
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
