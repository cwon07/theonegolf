import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IRound extends Document {
  member: Types.ObjectId;// Array of member IDs
  front_9: number; // Score for the front 9 holes
  back_9: number; // Score for the back 9 holes
}

const roundSchema = new Schema<IRound>({
  member: { type: Schema.Types.ObjectId, ref: "Member", required: true }, // Use Schema.Types.ObjectId
  front_9: Number,
  back_9: Number,
});

const Round = mongoose.models.Round || mongoose.model("Round", roundSchema);

export default Round;