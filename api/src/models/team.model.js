import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema({
    name: {
        type: String
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Team = mongoose.model("Team", teamSchema)