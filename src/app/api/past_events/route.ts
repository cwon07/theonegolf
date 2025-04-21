import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from "mongoose";
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const today = new Date();
    const pstOffset = -7;
    today.setHours(today.getHours() + pstOffset); 
    const todayStr = today.toISOString().split('T')[0]; // Get date string in "YYYY-MM-DD" format

    const events = await Event.find(
      { date: { $lt: todayStr } },
      'date is_tourn'
    ).sort({ date: 1 });
    

    return NextResponse.json(events, { status: 200 });
  } catch (err) {
    console.error('Error fetching dates:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


