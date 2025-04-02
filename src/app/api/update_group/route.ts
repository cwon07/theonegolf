// app/api/update_group/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from 'mongoose';
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

// Connect to database (assuming connectToDatabase handles mongoose connection)
async function ensureDbConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

// GET handler to fetch group data using query parameter
export async function GET(req: NextRequest) {
  await ensureDbConnection();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  console.log(groupId);

  // Optional: Validate if groupId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return NextResponse.json({ error: "Invalid groupId format" }, { status: 400 });
  }

  try {
    console.log("Fetching group with ID:", groupId);
    const group = await Group.findById(groupId).populate({
      path: "rounds",
      populate: {
        path: "member",
        model: Member, // Use the imported model directly
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Convert ObjectIds to strings and format the response
    const groupData = {
      _id: group._id.toString(),
      date: group.date,
      time: group.time,
      rounds: group.rounds.map((round: any) => ({
        _id: round._id.toString(),
        front_9: round.front_9,
        back_9: round.back_9,
        member: {
          _id: round.member._id.toString(),
          id: round.member.id,
          handicap: round.member.handicap,
          name: round.member.name,
          sex: round.member.sex,
        },
      })),
    };

    return NextResponse.json(groupData, { status: 200 });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await ensureDbConnection();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return NextResponse.json({ error: "Invalid groupId format" }, { status: 400 });
  }

  // Verify token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  // Parse the request body
  let updatedGroupData;
  try {
    updatedGroupData = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  if (!updatedGroupData.date || !updatedGroupData.time) {
    return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
  }

  try {
    // Update the Group document
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Update top-level fields
    group.date = updatedGroupData.date;
    group.time = updatedGroupData.time;

    // Update rounds (assuming rounds are stored as references or subdocuments)
    if (updatedGroupData.rounds && Array.isArray(updatedGroupData.rounds)) {
      for (const updatedRound of updatedGroupData.rounds) {
        const round = await Round.findById(updatedRound._id);
        if (round) {
          round.front_9 = updatedRound.front_9 || round.front_9;
          round.back_9 = updatedRound.back_9 || round.back_9;
          await round.save();
        }
      }
    }
    // Save the updated group
    await group.save();

    return NextResponse.json({ message: "Group updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}
