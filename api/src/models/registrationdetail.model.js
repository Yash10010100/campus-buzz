import mongoose, { Schema } from "mongoose";
import { type } from "os";

const registrationdetailSchema = new Schema({
    details: {
        type: Object,
        required: true
    },
    submitted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Registrationdetail = mongoose.model("Registrationdetail", registrationdetailSchema)