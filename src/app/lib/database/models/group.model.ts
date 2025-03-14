import mongoose, { Schema, Document, model } from "mongoose";

export interface IGroup extends Document {
  date: string; // Date of the group (defaults to event date)
  time: string; // Time of the group
  rounds: mongoose.Schema.Types.Array; // Array of Round schemas
}

const groupSchema = new Schema<IGroup>({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
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