import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Event } from "../models/event.model.js"
import { Participation } from "../models/participation.model.js";
import { Team } from "../models/team.model.js";
import { Teammembership } from "../models/teammember.model.js";

const createParticipation = asyncHandler(async (req, res) => {
    const { eventId } = req.params

    const user = req.user

    if (!isValidObjectId(eventId)) {
        throw new ApiError(400, "Invalid event Id")
    }

    try {
        const event = await Event.findById(eventId)

        let team = null
        if (event.isteamevent) {
            team = await Team.create({
                name: `${user?.username}'s team`,
                leader: user._id
            })

            if (!team) {
                throw new ApiError(500, "Failed to create team")
            }
        }

        const participation = await Participation.create({
            event: eventId,
            participant: user._id,
            team: team?._id || null,
            success: false
        })

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    participation,
                    "Participation created"
                )
            )

    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while creating participation")
    }
})

const completeParticipation = asyncHandler(async (req, res) => {
    const { participationId } = req.params

    if (!isValidObjectId(participationId)) {
        throw new ApiError(400, "Invalid participation Id")
    }

    const participation = await Participation.findById(participationId)

    if (!participation) {
        throw new ApiError(404, "Participation not found")
    }

    const event = await Event.findById(participation.event)

    if (participation.team) {
        if (!event?.isteamevent) {
            throw new ApiError(400, "Not a team event")
        }

        const teamMembers = await Teammembership.find({ team: { $eq: participation.team } })

        if (teamMembers?.length > event?.maxteamsize - 1) {
            throw new ApiError(400, `Team size could be ${event?.maxteamsize} at max`)
        }

        if (teamMembers?.length < event?.minteamsize - 1) {
            throw new ApiError(400, `Team size should be at least ${event?.minteamsize}`)
        }
    }

    if (event?.registrationform && !participation.registrationdetail) {
        throw new ApiError(400, "Registration details missing")
    }

    participation.success = true

    participation.save({ validateBeforeSave: true })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "",
                "Participation successful"
            )
        )
})

export {
    createParticipation,
    completeParticipation,
}