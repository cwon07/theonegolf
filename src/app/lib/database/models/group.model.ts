import mongoose, { Schema, Document, model } from "mongoose";
import Event from "@/app/lib/database/models/event.model"; // Adjust path if needed

export interface IGroup extends Document {
  event_id: mongoose.Schema.Types.ObjectId; // Reference to the Event
  date: string; // Date of the group (defaults to event date)
  time: string; // Time of the group
  rounds: mongoose.Schema.Types.Array; // Array of Round schemas
}

const groupSchema = new Schema<IGroup>({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  rounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round", // Reference to Round schema
    },
  ],
});

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;