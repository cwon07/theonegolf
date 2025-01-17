import { Schema, model, models } from "mongoose";

export interface IEvent extends Document {
    _id: string;
    title: string;
    description?: string;
    dateTime: Date;
}

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    dateTime: { type: Date, default: Date.now },

})

const Event = models.Event || model('Event', EventSchema);

export default Event;