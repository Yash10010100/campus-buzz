import mongoose, { Schema } from "mongoose";

const formfieldSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tooltip: {
        type: String,
        required: true,
        trim: true
    },
    required: {
        type: Boolean,
        required: true
    },
    datatype: {
        type: Object,
        required: true
    },
    ifenumoptions: [
        {
            type: Schema.Types.String
        }
    ],
    form: {
        type: Schema.Types.ObjectId,
        ref: "Form"
    }
}, { timestamps: true })

export const Formfield = mongoose.model("Formfield", formfieldSchema)