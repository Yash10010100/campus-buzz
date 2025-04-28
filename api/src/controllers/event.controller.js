import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Event } from "../models/event.model.js"
import { Form } from "../models/form.model.js"
import { isValidObjectId } from "mongoose";

const uploadEvent = asyncHandler(async (req, res) => {
    const { name, description, organizer, domain, location, city, date, time, duration, registrationfees, isteamevent, minteamsize, maxteamsize } = req.body

    if (req.user?.usertype !== "organizer") {
        throw new ApiError(401, "Unautherized to upload event")
    }

    if ([name, description, organizer, domain, location, city, date, time].some((field) => (field?.trim() === ""))) {
        throw new ApiError(400, "Required fields are missing")
    }

    const imageLocalPath = req.file?.path

    if (!imageLocalPath) {
        throw new ApiError(400, "Theme image is required")
    }

    let themeimage;
    try {
        themeimage = await uploadOnCloudinary(imageLocalPath)
    } catch (error) {
        throw new ApiError(500, "Failed to upload theme image")
    }

    try {
        const event = await Event.create({
            name,
            description,
            organizer,
            domain,
            location,
            city,
            date: { date, time },
            duration,
            registrationfees,
            isteamevent,
            minteamsize,
            maxteamsize,
            themeimage: {
                url: themeimage.url,
                pid: themeimage.public_id
            }
        })

        if (!event) {
            throw new ApiError(500, "")
        }

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    event,
                    "Event created"
                )
            )

    } catch (error) {
        if (themeimage) {
            await deleteFromCloudinary(themeimage.public_id)
        }
        throw new ApiError(500, error.message || "Something went wrong while creating new event")
    }
})

const createRegistrationForm = asyncHandler(async (req, res) => {
    const { eventId } = req.params
    const userId = req.user?._id

    if (req.user?.usertype !== "organizer") {
        throw new ApiError(401, "Unautherized to add registration form")
    }

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event id")
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(400, "Event not found")
    }

    if (event.registrationform) {
        throw new ApiError(400, "Event alreaduy have a registration form")
    }

    if(event.owner!==userId){
        throw new ApiError(400, "Unautherized to update the event")
    }

    const form = await Form.create({ name: `${event.name}'s registration form` })

    if (!form) {
        throw new ApiError(500, "Failed to create the form")
    }

    event.registrationform = form._id

    event.save({ validateBeforeSave: false })

    res
        .status(200),
        json(
            new ApiResponse(
                200,
                event,
                "Created registration form successfully"
            )
        )
})

const updateEventDetails = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    //todo
})

const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    //todo
})

export {
    uploadEvent,
    createRegistrationForm,
    updateEventDetails,
    deleteEvent
}