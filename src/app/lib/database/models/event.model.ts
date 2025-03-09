import mongoose, { Schema, Document, model } from "mongoose";
import Member from "@/app/lib/database/models/members.model";

export interface IEvent extends Document {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM AM/PM"
  group_count: number;
  players: Number[]
}

const eventSchema = new Schema<IEvent>({
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/, // Validates "YYYY-MM-DD"
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        // Check if time includes AM or PM; if not, append "AM"
        if (!/AM|PM/.test(v)) {
          this.time = `${v} AM`;  // Default to AM if not provided
        }
        return /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/.test(this.time); // Ensure format is "12:36 AM"
      },
      message: "Invalid time format. Should be in 'hh:mm AM/PM' format.",
    },
  },
  group_count: {  type: Number, required: true}
});

const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
