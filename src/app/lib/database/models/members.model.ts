import { Schema, model, models } from "mongoose";

// Define the admin schema
const MemberSchema = new Schema({
  id: { type: Number, required: true},
  name: { type: String, required: true },
  sex: { type: String,  required: true, enum: ["Male", "Female", "Other"]},
  eng_name: { type: String },
  handicap: {
    type: [{ type: Number, min: -18, max: 45}], // Array of 16-bit signed integers
    required: true,
  },
  is_new: {type: Boolean, required: true}  
});

// Create and export the Admin model
const Member = models.Member || model('Member', MemberSchema);

export default Member;


