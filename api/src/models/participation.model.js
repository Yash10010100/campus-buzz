import mongoose, { Schema } from "mongoose";

const participationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "events"
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "teams"
    },
    participant: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    registrationdetail: {
        type: Schema.Types.ObjectId,
        ref: "registrationdetails"
    },
    success: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

export const Participation = mongoose.model("Participation", participationSchema)