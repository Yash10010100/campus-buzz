import mongoose, { Schema } from "mongoose";

const formSchema = new Schema({
    name: {
        type: String
    }
}, { timestamps: true })

export const Form = mongoose.model("Form", formSchema)