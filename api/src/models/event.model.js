import mongoose, { Schema } from "mongoose";


const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    domain: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Object,   //object: {date, time}
        required: true
    },
    duration: {
        type: Number,
        default: 1    //no. of days
    },
    registrationfees: {
        type: Number,
        default: null
    },
    isteamevent: {
        type: Boolean,
        default: false
    },
    minteamsize: {
        type: Number,
        default: 2
    },
    maxteamsize: {
        type: Number,
        default: 6
    },
    themeimage: {
        type: Object,
        required: true
    },
    registrationform: {
        type: Schema.Types.ObjectId,
        ref: "Form"
    }
}, { timestamps: true })

export const Event = mongoose.model("Event", eventSchema)