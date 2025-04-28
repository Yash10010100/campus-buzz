import mongoose, { Schema } from "mongoose";
import { Registrationdetail } from "./registrationdetail.model";

const participationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
    participant: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Registrationdetail: {
        type: Schema.Types.ObjectId,
        ref: "Registrationdetail"
    },
    success: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

export const Participation = mongoose.model("Participation", participationSchema)