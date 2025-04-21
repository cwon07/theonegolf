// app/lib/database/models/cronLock.model.ts
import mongoose, { Schema, Document } from 'mongoose';

const CronLockSchema: Schema = new Schema({
  jobName: { type: String, required: true },
  isRunning: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

const CronLock = mongoose.models.CronLock || mongoose.model('CronLock', CronLockSchema);

export default CronLock;
