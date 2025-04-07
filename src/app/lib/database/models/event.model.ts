import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IEvent extends Document {
  date: string; // "YYYY-MM-DD"
  is_tourn: boolean;
  groups: mongoose.Schema.Types.Array; // Array of Round schemas
  m_total_stroke: Types.ObjectId;
  w_total_stroke: Types.ObjectId;
  m_net_stroke_1: Types.ObjectId;
  m_net_stroke_2: Types.ObjectId;
  m_net_stroke_3: Types.ObjectId;
  m_net_stroke_4: Types.ObjectId;
  m_net_stroke_5: Types.ObjectId;
  w_net_stroke_1: Types.ObjectId;
  w_net_stroke_2: Types.ObjectId;
  m_long_drive: Types.ObjectId;
  w_long_drive: Types.ObjectId;
  close_to_center: Types.ObjectId;
  m_close_pin_2: Types.ObjectId;
  m_close_pin_7: Types.ObjectId;
  m_close_pin_12: Types.ObjectId;
  m_close_pin_16: Types.ObjectId;
  w_close_pin_7: Types.ObjectId;
  w_close_pin_12: Types.ObjectId;
  m_bb: Types.ObjectId;
  w_bb: Types.ObjectId;
  birdies: [Types.ObjectId];
  eagles: [Types.ObjectId];
  albatrosses: [Types.ObjectId];
}

const eventSchema = new Schema<IEvent>({
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/, // Validates "YYYY-MM-DD"
  },
  is_tourn: {
    type: Boolean, 
    required: true,
  },
  groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group", // Reference to Round schema
      },
    ],
    m_total_stroke: { type: Schema.Types.ObjectId, ref: "Member"},
    w_total_stroke: { type: Schema.Types.ObjectId, ref: "Member"},
    m_net_stroke_1: { type: Schema.Types.ObjectId, ref: "Member"},
    m_net_stroke_2: { type: Schema.Types.ObjectId, ref: "Member"},
    m_net_stroke_3: { type: Schema.Types.ObjectId, ref: "Member"},
    m_net_stroke_4: { type: Schema.Types.ObjectId, ref: "Member"},
    m_net_stroke_5: { type: Schema.Types.ObjectId, ref: "Member"},
    w_net_stroke_1: { type: Schema.Types.ObjectId, ref: "Member"},
    w_net_stroke_2: { type: Schema.Types.ObjectId, ref: "Member"},
    m_long_drive: { type: Schema.Types.ObjectId, ref: "Member"},
    w_long_drive: { type: Schema.Types.ObjectId, ref: "Member"},
    close_to_center: { type: Schema.Types.ObjectId, ref: "Member"},
    m_close_pin_2: { type: Schema.Types.ObjectId, ref: "Member"},
    m_close_pin_7: { type: Schema.Types.ObjectId, ref: "Member"},
    m_close_pin_12: { type: Schema.Types.ObjectId, ref: "Member"},
    m_close_pin_16: { type: Schema.Types.ObjectId, ref: "Member"},
    w_close_pin_7: { type: Schema.Types.ObjectId, ref: "Member"},
    w_close_pin_12: { type: Schema.Types.ObjectId, ref: "Member"},
    m_bb: { type: Schema.Types.ObjectId, ref: "Member"},
    w_bb: { type: Schema.Types.ObjectId, ref: "Member"},
    birdies:[{ type: Schema.Types.ObjectId, ref: "Member"}],
    eagles:[{ type: Schema.Types.ObjectId, ref: "Member"}],
    albatrosses:[{ type: Schema.Types.ObjectId, ref: "Member"}],
});

const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;