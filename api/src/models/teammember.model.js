import mongoose, { Schema } from "mongoose";

const teammembershipSchema = new Schema({
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Teammembership = mongoose.model("Teammembership", teammembershipSchema)