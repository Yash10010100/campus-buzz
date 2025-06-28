import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { FORM_FIELD_DATATYPES } from "../constants";
import { Registrationdetail } from "../models/registrationdetail.model";
import { User } from "../models/user.model";
import { Form } from "../models/form.model";
import { Participation } from "../models/participation.model";
import { Event } from "../models/event.model";
import { isValidObjectId, Schema } from "mongoose";

const addRegistrationDetails = asyncHandler(async (req, res) => {
    const { eventId, participationId } = req.params
    const { data } = req.body

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event Id")
    }

    if (!isValidObjectId(participationId)) {
        throw new ApiError(400, "Invalid participation Id")
    }

    const event = await Event.aggregate(
        [
            {
                $match: {
                    _id: Schema.Types.ObjectId(eventId)
                }
            },
            {
                $lookup: {
                    from: "forms",
                    foreignField: "_id",
                    localField: "registrationform",
                    as: "form"
                }
            },
            {
                $addFields: {
                    form: {
                        $arrayElemAt: ["$form", 0]
                    }
                }
            },
            {
                $lookup: {
                    from: "formfields",
                    foreignField: "form",
                    localField: "form._id",
                    as: "form.fields"
                }
            }
        ]
    )

    if (!event?.length) {
        throw new ApiError(400, "Event not found")
    }

    const datakeys = Object.keys(data)
    const details = {}

    datakeys.forEach((key)=>{
    })

    event.form.fields.forEach(async (field) => {
        if (field.datatype === "File") {
            const filePath = req.files?.[field.name]?.[0]?.path
            if (field.required && !filePath) {
                throw new ApiError(400, `${field.name} file is required`)
            }
            let file;
            try {
                file = await uploadOnCloudinary(filePath)

                if (!file) {
                    throw new ApiError()
                }

                data[field.name] = { url: file.url, pid: file.public_id }
            } catch (error) {
                throw new ApiError(500, error.message || `Failed to upload ${field.name} file`)
            }
        }
        if (field.required && !data[field.name]) {
            throw new ApiError(400, `${field.name} is required`)
        }

        if(field.datatype === "String" && typeof data[field.name]!=="string"){
            throw new ApiError(400, `${field.name} must be a string`)
        }
        else if(field.datatype === "Number" && isNaN(Number.parseInt(data[field.name]))){
            throw new ApiError(400, `${field.name} must be a valid number`)
        }
        else if(field.datatype === "Boolean" && data[field.name]!==true && data[field.name]!==false){
            throw new ApiError(400, `Invalid value for ${field.name}`)
        }
        else if(field.datatype === "Enum" && !field.ifenumoptions?.some((option)=>(data[field.name]===option))){
            throw new ApiError(400, `Value of ${field.name} must be from provided options`)
        }

        details[field.name]=data[field.name]
    })

    const registrationdetail = await Registrationdetail.create({
        details
    })

    if(!registrationdetail){
        throw new ApiError(400, "Something went wrong while uploading registration details")
    }

    const participation = await Participation.findById(participationId)

    participation.registrationdetail = registrationdetail

    participation.save({validateBeforeSave: false})

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            registrationdetail,
            "Registration details uploaded successfully"
        )
    )
})

const modifyRegistrationDetails = asyncHandler(async (req, res) => {
    //todo
})

export {
    addRegistrationDetails,
    modifyRegistrationDetails,
}