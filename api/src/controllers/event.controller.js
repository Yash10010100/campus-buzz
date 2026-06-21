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
import { log } from "console";
import { User } from "../models/user.model.js";

const commonEventAggregationPipeline = (eventId, user) => [
    {
        $match: {
            _id: new mongoose.Types.ObjectId(eventId)
        }
    },
    {
        $addFields: {
            "themeimage": "$themeimage.url"
        }
    },
    {
        $lookup: {
            from: 'forms',
            localField: 'registrationform',
            foreignField: '_id',
            as: 'registrationform'
        }
    },
    {
        $addFields: {
            'registrationform': {
                $arrayElemAt: ['$registrationform', 0]
            }
        }
    },
    {
        $lookup: {
            from: "formfields",
            localField: "registrationform._id",
            foreignField: "form",
            as: "registrationform.fields"
        }
    },
    {
        $addFields: {
            user: user
        }
    },
    {
        $lookup: {
            from: "participations",
            let: {
                localField1: "$_id",
                localField2: "$user._id"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$event", "$$localField1"] },
                                { $eq: ["$participant", "$$localField2"] }
                            ]
                        }
                    }
                }
            ],
            as: "participation"
        }
    },
    {
        $addFields: {
            "participation": {
                $arrayElemAt: ["$participation", 0]
            }
        }
    },
    {
        $lookup: {
            from: "teams",
            foreignField: "_id",
            localField: "participation.team",
            as: "participation.team"
        }
    },
    {
        $addFields: {
            "participation.team": {
                $arrayElemAt: ["$participation.team", 0]
            }
        }
    },
    {
        $lookup: {
            from: "registrationdetails",
            localField: "participation.registrationdetail",
            foreignField: "_id",
            as: "participation.registrationdetail"
        }
    },
    {
        $addFields: {
            "participation.registrationdetail": {
                $arrayElemAt: ["$participation.registrationdetail", 0]
            }
        }
    }
    // {
    //     $lookup: {
    //         from: "teammemberships",
    //         foreignField: "team",
    //         localField: "participation.team._id",
    //         as: "teammembers"
    //     }
    // },
    // {
    //     $unwind: "$teammembers",
    //     preserveNullAndEmptyArrays: true
    // },
    // {
    //     $lookup: {
    //         from: "users",
    //         foreignField: "_id",
    //         localField: "teammembers.member",
    //         as: "teammembers",
    //         pipeline: [
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     usertype: 1,
    //                     username: 1,
    //                     email: 1,
    //                     fullname: 1,
    //                     avatar: 1,
    //                 }
    //             },
    //         ]
    //     }
    // },
    // {
    //     $addFields: {
    //         "teammembers": {
    //             $arrayElemAt: ["$teammembers", 0]
    //         }
    //     }
    // },
    // {
    //     $addFields: {
    //         "teammembers.avatar": "$teammembers.avatar.url"
    //     }
    // },
    // {
    //     $group: {
    //         _id: "$_id",
    //         doc: { $first: "$$ROOT" },
    //         teammembers: {
    //             $push: "$teammembers"
    //         }
    //     }
    // },
    // {
    //     $addFields: {
    //         "doc.participation.team.members": "$teammembers"
    //     }
    // },
    // {
    //     $replaceRoot: {
    //         newRoot: "$doc"
    //     }
    // },
    // {
    //     $project: {
    //         teammembers: 0,
    //         user: 0
    //     }
    // }
]

const uploadEvent = asyncHandler(async (req, res) => {
    const { name, description, organizer, domain, location, city, date, duration, registrationfees, lastregistrationdate, isteamevent, minteamsize, maxteamsize } = req.body

    if (req.user?.usertype !== "organizer") {
        throw new ApiError(401, "Unauthorized to upload event")
    }

    if ([name, description, organizer, domain, location, city, date, lastregistrationdate].some((field) => (!field || field?.toString().trim() === ""))) {
        throw new ApiError(400, "Required fields are missing")
    }

    if (date <= Date.now() || lastregistrationdate <= Date.now()) {
        throw new ApiError(400, "Dates must be greater than current date")
    }

    if (new Date(lastregistrationdate) > new Date(date)) {
        throw new ApiError(400, "Last registration date cannot be after event date")
    }

    if (registrationfees < 0) {
        throw new ApiError(400, "Registration fees cannot be negative")
    }

    if (isteamevent && (!minteamsize || !maxteamsize)) {
        throw new ApiError(400, "Team size is required for team events")
    }

    const imageLocalPath = req.file?.path

    if (!req.file) {
        throw new ApiError(400, "Theme image is required")
    }

    let themeimage;
    try {
        themeimage = await uploadOnCloudinary(req.file.path)
    } catch (error) {
        throw new ApiError(500, "Failed to upload theme image")
    }

    if (!themeimage?.url) {
        throw new ApiError(500, "Error uploading theme image")
    }

    try {
        const event = await Event.create({
            name,
            owner: req.user._id,
            description,
            organizer,
            domain,
            location,
            city,
            date,
            duration,
            registrationfees,
            lastregistrationdate,
            isteamevent,
            minteamsize: isteamevent ? minteamsize : undefined,
            maxteamsize: isteamevent ? maxteamsize : undefined,
            themeimage: {
                url: themeimage.url,
                public_id: themeimage.public_id
            },
            createdBy: req.user._id
        })

        if (!event) {
            await deleteFromCloudinary(themeimage.public_id)
            throw new ApiError(500, "Something went wrong while creating the event")
        }

        event.themeimage = event?.themeimage?.url

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
        throw new ApiError(401, "Unauthorized to add registration form")
    }

    if (!isValidObjectId(eventId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event id")
            )
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(400, "Event not found")
    }

    if (event.registrationform) {
        throw new ApiError(400, "Event already has a registration form")
    }

    if (event.owner.toString() !== userId.toString()) {
        throw new ApiError(400, "Unauthorized to update the event")
    }

    const form = await Form.create({ name: `${event.name}'s registration form` })

    if (!form) {
        throw new ApiError(500, "Failed to create the form")
    }

    event.registrationform = form._id

    event.save({ validateBeforeSave: false })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                form,
                "Created registration form successfully"
            )
        )
})

const updateEventDetails = asyncHandler(async (req, res) => {
    const { eventId } = req.params
    const { name, description, domain, location, city, date, duration, registrationfees, lastregistrationdate, isteamevent, minteamsize, maxteamsize } = req.body

    if (!isValidObjectId(eventId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event id")
            )
    }

    if (date && date <= Date.now() || lastregistrationdate && lastregistrationdate <= Date.now()) {
        throw new ApiError(400, "Dates must be greater than current date")
    }

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Event not found")
                )
        }

        if (event.owner.toString() !== req.user?._id.toString()) {
            log(event)
            log(req.user)
            throw new ApiError(400, "Unauthorized to update the event")
        }

        event.name = name.trim() || event.name
        event.description = description.trim() || event.description
        event.domain = domain.trim() || event.domain
        event.location = location.trim() || event.location
        event.city = city.trim() || event.city
        event.date = date || event.date
        event.duration = duration || event.duration
        event.registrationfees = registrationfees || event.registrationfees
        event.isteamevent = isteamevent || event.isteamevent
        event.minteamsize = minteamsize || event.minteamsize
        event.maxteamsize = maxteamsize || event.maxteamsize

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
        throw new ApiError(500, error.message || "Something went wrong while updating event details")
    }
})

const changeThemeImage = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    const themeimagepath = req.file?.path

    if (!themeimagepath) {
        throw new ApiError(400, "Theme image is required")
    }

    if (!isValidObjectId(eventId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event id")
            )
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

    event.save({ validateBeforeSave: false })

    event.themeimage = event.themeimage?.url

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
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event id")
            )
    }

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Event not found")
                )
        }

        if (event.owner !== req.user._id) {
            throw new ApiError(401, "Unauthorized to delete the event")
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
        throw new ApiError(500, error.message || "Failed to delete the event")
    }
})

const getEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    if (!isValidObjectId(eventId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event id")
            )
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    const result = await Event.aggregate(
        commonEventAggregationPipeline(event._id, req.user)
    )

    if (result && result.length && result[0].participation?.team) {
        const teammembers = await Teammembership.aggregate([
            {
                $match: {
                    team: result[0].participation?.team?._id
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "member",
                    as: "member",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                usertype: 1,
                                username: 1,
                                email: 1,
                                fullname: 1,
                                avatar: 1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "member": {
                        $arrayElemAt: ["$member", 0]
                    }
                }
            },
            {
                $addFields: {
                    "member.avatar": "$member.avatar.url"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$member"
                }
            }
        ])

        const leader = await User.findById(result[0].participation?.team?.leader).select("-password -refreshToken -__v -updatedAt -createdAt")
        leader.avatar=leader?.avatar?.url

        result[0].participation.team.members = teammembers
        result[0].participation.team.leader = leader
    }

    if (!result || !result.length) {
        throw new ApiError(500, "Something went wrong")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result[0],
                "Event found"
            )
        )
})

const fetchFutureEvents = asyncHandler(async (req, res) => {
    try {
        const now = Date.now()

        const events = await Event.find({ date: { $gt: now } }).sort({ ["date"]: 1 })

        if (!events) {
            throw new ApiError(400, "Failed to fetch future events")
        }

        events.forEach((e) => {
            e.themeimage = e.themeimage?.url
        })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    events,
                    "Future event fetched"
                )
            )

    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while fetching events")
    }
})

const searchEventsWithQuery = asyncHandler(async (req, res) => {
    const { query, sortOrder, filters } = req.body

    const now = Date.now()
    const regex = new RegExp(query, "i");
    const sort = { ["date"]: sortOrder === "asc" ? 1 : -1 };

    const baseQuery = (field) => ({
        [field]: { $regex: regex },
        date: { $gt: now },
        ...filters
    });

    try {
        const [nameMatches, descriptionMatches, organizerMatches, domainMatches] = await Promise.all([
            Event.find(baseQuery("name")).sort(sort),
            Event.find(baseQuery("description")).sort(sort),
            Event.find(baseQuery("organizer")).sort(sort),
            Event.find(baseQuery("domain")).sort(sort),
        ]);

        nameMatches.forEach((e) => { e.themeimage = e.themeimage?.url })
        descriptionMatches.forEach((e) => { e.themeimage = e.themeimage?.url })
        organizerMatches.forEach((e) => { e.themeimage = e.themeimage?.url })
        domainMatches.forEach((e) => { e.themeimage = e.themeimage?.url })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    [nameMatches, descriptionMatches, organizerMatches, domainMatches],
                    "Fetch by search query successful"
                )
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Fetch by query failed")
    }
})

const futureEventsByOrg = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const now = Date.now()

    const events = await Event.find({ owner: userId, date: { $gt: now } }).sort({ ["date"]: 1 })

    if (!events) {
        throw new ApiError(400, "Failed to fetch organizer's future events")
    }

    events.forEach((e) => {
        e.themeimage = e.themeimage?.url
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                events,
                "Organizer's future events"
            )
        )
})

const pastEventsByOrg = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const now = Date.now()

    const events = await Event.find({ owner: userId, date: { $lt: now } }).sort({ ["date"]: -1 })

    if (!events) {
        throw new ApiError(400, "Failed to fetch organizer's past events history")
    }

    events.forEach((e) => {
        e.themeimage = e.themeimage?.url
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                events,
                "Organizer's future events"
            )
        )
})

const currentStudentParticipationEvents = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const now = Date.now();

    const pipeline = (successFlag) => ([
        {
            $match: {
                participant: new mongoose.Types.ObjectId(userId),
                success: successFlag
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "_id",
                as: "eventData"
            }
        },
        { $unwind: "$eventData" },
        {
            $match: {
                "eventData.date": { $gt: now }
            }
        },
        {
            $addFields: {
                "eventData.themeimage": "$eventData.themeimage.url"
            }
        },
        {
            $replaceRoot: {
                newRoot: "$eventData"
            }
        }
    ]);

    const [registeredEvents, pendingRegistrationEvents] = await Promise.all([
        Participation.aggregate(pipeline(true)),
        Participation.aggregate(pipeline(false))
    ]);

    if (!registeredEvents) {
        throw new ApiError(400, "Failed to fetch registered events")
    }

    if (!pendingRegistrationEvents) {
        throw new ApiError(400, "Failed to fetch events with pending registration")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    registeredEvents,
                    pendingRegistrationEvents
                },
                "Events registered by student and events with pending registration"
            )
        )
})

const pastParticipationEvents = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const now = Date.now();

    const events = await Participation.aggregate([
        {
            $match: {
                participant: new mongoose.Types.ObjectId(userId),
                success: true
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "_id",
                as: "eventData"
            }
        },
        { $unwind: "$eventData" },
        {
            $match: {
                "eventData.date": { $lt: now }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$eventData"
            }
        }
    ]);

    if (!events) {
        throw new ApiError(400, "Failed to fetch participated events history")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                events,
                "Participation history"
            )
        )
})

export {
    uploadEvent,
    createRegistrationForm,
    updateEventDetails,
    changeThemeImage,
    deleteEvent,
    getEvent,
    fetchFutureEvents,
    searchEventsWithQuery,
    futureEventsByOrg,
    pastEventsByOrg,
    currentStudentParticipationEvents,
    pastParticipationEvents,
}