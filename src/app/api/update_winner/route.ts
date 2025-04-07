import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import Member from "@/app/lib/database/models/members.model";

// Define interfaces matching your frontend
interface Member {
    _id: string;
    id: number;
    handicap: number[];
    name: string;
    sex: string;
  }

interface EventResponse {
  _id: string;
  date: string;
  is_tourn: boolean;
  m_total_stroke: Member;
  w_total_stroke: Member;
  m_net_stroke_1: Member;
  m_net_stroke_2: Member;
  m_net_stroke_3: Member;
  m_net_stroke_4: Member;
  m_net_stroke_5: Member;
  w_net_stroke_1: Member;
  w_net_stroke_2: Member;
  m_long_drive: Member;
  w_long_drive: Member;
  close_to_center: Member;
  m_close_pin_2: Member;
  m_close_pin_7: Member;
  m_close_pin_12: Member;
  m_close_pin_16: Member;
  w_close_pin_7: Member;
  w_close_pin_12: Member;
  m_bb: Member;
  w_bb: Member;
  birdies: Member[];
  eagles: Member[];
  albatrosses: Member[];
}

// GET: Fetch event details
export async function GET(req: NextRequest) {
    await connectToDatabase();
  
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
  
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }
  
    try {
      const winnerFields = [
        "m_total_stroke", "w_total_stroke",
        "m_net_stroke_1", "m_net_stroke_2", "m_net_stroke_3", "m_net_stroke_4", "m_net_stroke_5",
        "w_net_stroke_1", "w_net_stroke_2",
        "m_long_drive", "w_long_drive", "close_to_center",
        "m_close_pin_2", "m_close_pin_7", "m_close_pin_12", "m_close_pin_16",
        "w_close_pin_7", "w_close_pin_12",
        "m_bb", "w_bb",
        "birdies", "eagles", "albatrosses"
      ];
  
      // Build populate chain dynamically
      let query = Event.findById(eventId);
      winnerFields.forEach(field => {
        query = query.populate(field, "id name");
      });
  
      const event = await query.exec();
  
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
  
      // Helper to map single winner
      const mapWinner = (winner: any): Member => {
        return winner ? {
          _id: winner._id,
          id: winner.id,
          name: winner.name,
          handicap: winner.handicap ?? [],
          sex: winner.sex ?? ""
        } : { _id: "", id: 0, name: "", handicap: [], sex: "" };
      };
  
      // Helper to map arrays (like birdies/eagles/etc.)
      const mapWinnersArray = (arr: any[] = []): Member[] =>
        arr.map(winner => mapWinner(winner));
  
      const response: EventResponse = {
        _id: event._id.toString(),
        date: event.date,
        is_tourn: event.is_tourn,
        m_total_stroke: mapWinner(event.m_total_stroke),
        w_total_stroke: mapWinner(event.w_total_stroke),
        m_net_stroke_1: mapWinner(event.m_net_stroke_1),
        m_net_stroke_2: mapWinner(event.m_net_stroke_2),
        m_net_stroke_3: mapWinner(event.m_net_stroke_3),
        m_net_stroke_4: mapWinner(event.m_net_stroke_4),
        m_net_stroke_5: mapWinner(event.m_net_stroke_5),
        w_net_stroke_1: mapWinner(event.w_net_stroke_1),
        w_net_stroke_2: mapWinner(event.w_net_stroke_2),
        m_long_drive: mapWinner(event.m_long_drive),
        w_long_drive: mapWinner(event.w_long_drive),
        close_to_center: mapWinner(event.close_to_center),
        m_close_pin_2: mapWinner(event.m_close_pin_2),
        m_close_pin_7: mapWinner(event.m_close_pin_7),
        m_close_pin_12: mapWinner(event.m_close_pin_12),
        m_close_pin_16: mapWinner(event.m_close_pin_16),
        w_close_pin_7: mapWinner(event.w_close_pin_7),
        w_close_pin_12: mapWinner(event.w_close_pin_12),
        m_bb: mapWinner(event.m_bb),
        w_bb: mapWinner(event.w_bb),
        birdies: mapWinnersArray(event.birdies),
        eagles: mapWinnersArray(event.eagles),
        albatrosses: mapWinnersArray(event.albatrosses),
      };
  
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }