import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Event } from "../models/event.model.js"
import { Form } from "../models/form.model.js"
import { Formfield } from "../models/formfield.model.js";
import { Participation } from "../models/participation.model.js";
import { Team } from "../models/team.model.js";
import { Teammembership } from "../models/teammember.model.js";
import { Registrationdetail } from "../models/registrationdetail.model.js";

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

    if (event.owner !== userId) {
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
    const { newname, newdescription, newdomain, newlocation, newcity, newdate, newtime, newduration, newregistrationfees, newisteamevent, newminteamsize, newmaxteamsize } = req.body

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event id")
    }

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        if (event.owner !== req.user._id) {
            throw new ApiError(400, "Unautherized to update the event")
        }

        event.name = newname || event.name
        event.description = newdescription || event.description
        event.domain = newdomain || event.domain
        event.location = newlocation || event.location
        event.city = newcity || event.city
        event.date = (newdate && newtime) ? { date: newdate, time: newtime } : event.date
        event.duration = newduration || event.duration
        event.registrationfees = newregistrationfees || event.registrationfees
        event.isteamevent = newisteamevent || event.isteamevent
        event.minteamsize = newminteamsize || event.minteamsize
        event.maxteamsize = newmaxteamsize || event.maxteamsize

        event.save({ validateBeforeSave: false })

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    event,
                    "Event details updated successfully"
                )
            )

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong while updating event details")
    }
})

const changeThemeImage = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    const themeimagepath = req.file?.path

    if (!themeimagepath) {
        throw new ApiError(400, "Theme image is required")
    }


    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event id")
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    let themeimage;
    try {
        themeimage = await uploadOnCloudinary(themeimagepath)
    } catch (error) {
        throw new ApiError(500, "Failed to upload")
    }

    if (!themeimage) {
        throw new ApiError(500, "Failed to upload")
    }

    const oldimage = event.themeimage

    event.themeimage = {
        url: themeimage.url,
        pid: themeimage.public_id
    }

    event.save({validateBeforeSave:false})

    await deleteFromCloudinary(oldimage.pid)

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            event,
            "Theme image changed"
        )
    )
})

const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event id")
    }

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        if (event.owner !== req.user._id) {
            throw new ApiError(400, "Unautherized to delete the event")
        }

        await Formfield.deleteMany({ form: { $eq: eventId } })
        await Form.deleteOne(event.registrationform)
        const participations = await Participation.aggregate(
            [
                {
                    $match: {
                        event: new Schema.Types.ObjectId(eventId)
                    }
                }
            ]
        )

        if (participations.length) {
            participations.forEach(async (participation) => {
                await Teammembership.deleteMany({ team: { $eq: participation.team } })
                await Team.deleteOne(participation.team)
                await Registrationdetail.deleteOne(participation.registrationdetail)
            })

            await Participation.deleteMany({ event: { $eq: eventId } })
        }

        await Event.deleteOne(eventId)

        res
            .status(200)
            .json(
                new ApiResponse(
                    204,
                    "",
                    "Event deleted"
                )
            )


    } catch (error) {
        throw new ApiError(500, "Failed to delete the event")
    }
})

const getEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    if (!isValidObjectId) {
        throw new ApiError(400, "Invalid event id")
    }

    const event = await event.findById(eventId)

    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                event,
                "Event found"
            )
        )
})

const searchEvents = asyncHandler(async(req, res)=>{
    const {query} = req.body

    //todo
})

export {
    uploadEvent,
    createRegistrationForm,
    updateEventDetails,
    changeThemeImage,
    deleteEvent,
    getEvent,
    searchEvents,
}