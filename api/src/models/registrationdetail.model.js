import mongoose, { Schema } from "mongoose";

const registrationdetailSchema = new Schema({
    details: {
        type: Object,
        required: true
    }
}, { timestamps: true })

export const Registrationdetail = mongoose.model("Registrationdetail", registrationdetailSchema)