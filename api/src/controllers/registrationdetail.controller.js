import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { FORM_FIELD_DATATYPES } from "../constants.js";
import { Registrationdetail } from "../models/registrationdetail.model.js";
import { User } from "../models/user.model.js";
import { Form } from "../models/form.model.js";
import { Participation } from "../models/participation.model.js";
import { Event } from "../models/event.model.js";
import { isValidObjectId, Mongoose, Schema, Types } from "mongoose";

const addRegistrationDetails = asyncHandler(async (req, res) => {
    const { eventId, participationId } = req.params
    const { data } = req.body

    if(!data){
        throw new ApiError(400, "Data is required")
    }

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
                    _id: new Types.ObjectId(eventId)
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
        throw new ApiError(404, "Event not found")
    }

    const details = {}

    event[0]?.form.fields.forEach((field) => {
        if (field.required && !data[field.name] && field.datatype !== "File") {
            throw new ApiError(400, `${field.name} is required`)
        }

        if (field.datatype === "String" && typeof data[field.name] !== "string") {
            throw new ApiError(400, `${field.name} must be a string`)
        }
        else if (field.datatype === "Number" && isNaN(Number.parseInt(data[field.name]))) {
            throw new ApiError(400, `${field.name} must be a valid number`)
        }
        else if (field.datatype === "Boolean" && data[field.name] !== true && data[field.name] !== false) {
            throw new ApiError(400, `${field.name} must be a boolean`)
        }
        else if (field.datatype === "Enum" && !field.ifenumoptions?.some((option) => (data[field.name] === option))) {
            throw new ApiError(400, `Value of ${field.name} must be from provided options`)
        }

        details[field.name] = data[field.name]
    })

    const participation = await Participation.findById(participationId)

    if (!participation) {
        throw new ApiError(404, "Participation not found")
    }

    if(participation.registrationdetail) {
        const registrationdetail = await Registrationdetail.findById(participation.registrationdetail)

        if (!registrationdetail) {
            throw new ApiError(404, "Registration details not found")
        }

        let updatedDetails = {...details, ...registrationdetail.details}

        registrationdetail.details = updatedDetails
        registrationdetail.submitted = true

        registrationdetail.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    registrationdetail,
                    "Registration details updated successfully"
                )
            )
    }
    else{
        const registrationdetail = await Registrationdetail.create({
            details,
            submitted: true
        })

        if (!registrationdetail) {
            throw new ApiError(500, "Something went wrong while uploading registration details")
        }

        participation.registrationdetail = registrationdetail?._id

        participation.save({ validateBeforeSave: false })

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    registrationdetail,
                    "Registration details uploaded successfully"
                )
            )
    }
})

const uploadFile = asyncHandler(async (req, res) => {
    const { eventId, participationId } = req.params
    const { name } = req.body
    const file = req.file

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event Id")
    }

    if (!isValidObjectId(participationId)) {
        throw new ApiError(400, "Invalid participation Id")
    }

    if (!file) {
        throw new ApiError(400, "File is required")
    }

    if (!name) {
        throw new ApiError(400, "Name is required")
    }

    const event = await Event.aggregate(
        [
            {
                $match: {
                    _id: new Types.ObjectId(eventId)
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
        throw new ApiError(404, "Event not found")
    }

    if (!event[0]?.form.fields.some((field) => (field.name === name && field.datatype === "File"))) {
        throw new ApiError(400, "Invalid field name")
    }

    const participation = await Participation.findById(participationId)

    if (!participation) {
        throw new ApiError(404, "Participation not found")
    }

    let uploadedFile;
    try {
        const filePath = file.path
        uploadedFile = await uploadOnCloudinary(filePath)

        if (!uploadedFile) {
            throw new ApiError(500, `Failed to upload file, please try again`)
        }

        if (!participation.registrationdetail) {
            const registrationdetail = await Registrationdetail.create({
                details: {
                    [name]: {
                        url: uploadedFile.url,
                        pid: uploadedFile.public_id
                    }
                }
            })

            participation.registrationdetail = registrationdetail?._id

            participation.save({ validateBeforeSave: false })

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        registrationdetail,
                        `${name} uploaded successfully`
                    )
                )
        }
        else {
            const registrationdetail = await Registrationdetail.findById(participation.registrationdetail)

            if (!registrationdetail) {
                throw new ApiError(404, "Registration detail not found")
            }

            let currentFile;

            if (registrationdetail.details[name]) {
                currentFile = registrationdetail.details[name]
            }

            registrationdetail.details[name] = {
                url: uploadedFile.url,
                pid: uploadedFile.public_id
            }

            registrationdetail.save({ validateBeforeSave: false })

            await deleteFromCloudinary(currentFile.pid)

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        registrationdetail,
                        `${name} uploaded successfully`
                    )
                )
        }
    } catch (error) {
        if (uploadFile) {
            await deleteFromCloudinary(uploadFile.public_id)
        }
        throw new ApiError(500, `Failed to upload ${name} file, please try again`)
    }
})

const modifyRegistrationDetails = asyncHandler(async (req, res) => {
    //todo
})

export {
    addRegistrationDetails,
    uploadFile,
    modifyRegistrationDetails
}