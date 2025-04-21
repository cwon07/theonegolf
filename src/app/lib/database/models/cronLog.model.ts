import mongoose, { Schema, models, model } from 'mongoose';

const CronLogSchema = new Schema(
  {
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default models.CronLog || model('CronLog', CronLogSchema);
