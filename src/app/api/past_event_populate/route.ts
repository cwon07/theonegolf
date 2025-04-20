import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database"; 
import mongoose from "mongoose"
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 
import Member from "@/app/lib/database/models/members.model"; 

export async function GET(req: NextRequest) {
    try {
      await connectToDatabase();
  
      const { searchParams } = new URL(req.url);
      const dateParam = searchParams.get("date");

      console.log("dateParam");
  
      let eventQuery;
  
      if (dateParam) {
        eventQuery = { date: dateParam };
      } else {
        let todayPST = new Date();
        todayPST.setHours(todayPST.getHours() - 7); // Adjust for UTC-7 (PST)
        eventQuery = { date: { $gte: todayPST.toISOString().split("T")[0] } };
      }
  
      const events = await Event.find(eventQuery)
        .populate([
          { path: "m_total_stroke", select: "id name handicap" },
          { path: "w_total_stroke", select: "id name handicap" },
          { path: "m_net_stroke_1", select: "id name handicap" },
          { path: "m_net_stroke_2", select: "id name handicap" },
          { path: "m_net_stroke_3", select: "id name handicap" },
          { path: "m_net_stroke_4", select: "id name handicap" },
          { path: "m_net_stroke_5", select: "id name handicap" },
          { path: "w_net_stroke_1", select: "id name handicap" },
          { path: "w_net_stroke_2", select: "id name handicap" },
          { path: "m_long_drive", select: "id name" },
          { path: "w_long_drive", select: "id name" },
          { path: "close_to_center", select: "id name" },
          { path: "m_close_pin_2", select: "id name" },
          { path: "m_close_pin_7", select: "id name" },
          { path: "m_close_pin_12", select: "id name" },
          { path: "m_close_pin_16", select: "id name" },
          { path: "w_close_pin_7", select: "id name" },
          { path: "w_close_pin_12", select: "id name" },
          { path: "m_bb", select: "id name" },
          { path: "w_bb", select: "id name" },
          { path: "birdies", select: "id name" },
          { path: "eagles", select: "id name" },
          { path: "albatrosses", select: "id name" },
        ])
        .lean();
  
      if (!events.length) {
        return NextResponse.json({ error: "No events found" }, { status: 404 });
      }
  
      // Sort if querying multiple (only in no-date mode)
      const event = dateParam ? events[0] : events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
      const groupIds = event.groups.filter(Boolean);
      const groups = await Group.find({ _id: { $in: groupIds } }).lean();
  
      const roundIds = groups.flatMap(group => group.rounds).filter(Boolean);
      const rounds = await Round.find({ _id: { $in: roundIds } }).lean();
  
      const memberIds = rounds.flatMap(round => round.member ? [round.member._id] : []).filter(Boolean);
      const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex handicap is_new").lean();
  
      const roundsWithMembers = rounds.map(round => {
        const member = members.find(m => String(m._id) === String(round.member));
        return member ? { ...round, member } : round;
      });
  
      const groupsWithRounds = groups.map(group => {
        const roundsForGroup = group.rounds.map((roundId: mongoose.Types.ObjectId) =>
          roundsWithMembers.find(r => String(r._id) === String(roundId)) || roundId
        );
        return { ...group, rounds: roundsForGroup };
      });
  
      const eventDetails = {
        event_id: event._id,
        date: event.date,
        is_tourn: event.is_tourn,
        groups: groupsWithRounds,
        m_total_stroke: event.m_total_stroke || null,
        w_total_stroke: event.w_total_stroke || null,
        m_net_stroke_1: event.m_net_stroke_1 || null,
        m_net_stroke_2: event.m_net_stroke_2 || null,
        m_net_stroke_3: event.m_net_stroke_3 || null,
        m_net_stroke_4: event.m_net_stroke_4 || null,
        m_net_stroke_5: event.m_net_stroke_5 || null,
        w_net_stroke_1: event.w_net_stroke_1 || null,
        w_net_stroke_2: event.w_net_stroke_2 || null,
        m_long_drive: event.m_long_drive || null,
        w_long_drive: event.w_long_drive || null,
        close_to_center: event.close_to_center || null,
        m_close_pin_2: event.m_close_pin_2 || null,
        m_close_pin_7: event.m_close_pin_7 || null,
        m_close_pin_12: event.m_close_pin_12 || null,
        m_close_pin_16: event.m_close_pin_16 || null,
        w_close_pin_7: event.w_close_pin_7 || null,
        w_close_pin_12: event.w_close_pin_12 || null,
        m_bb: event.m_bb || null,
        w_bb: event.w_bb || null,
        birdies: event.birdies || [],
        eagles: event.eagles || [],
        albatrosses: event.albatrosses || [],
      };
  
      return NextResponse.json(eventDetails);
    } catch (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
  }
  