import mongoose, { Schema, Document, model } from "mongoose";

export interface IRound extends Document {
  members: number; // Array of member IDs
  front_9: number; // Score for the front 9 holes
  back_9: number; // Score for the back 9 holes
}

const roundSchema = new Schema<IRound>({
  members: {
    type: Number, // Array of member IDs (using number type)
    required: true,
  },
  front_9: {
    type: Number,
  },
  back_9: {
    type: Number,
  },
});

const Round = mongoose.models.Round || mongoose.model("Round", roundSchema);

export default Round;