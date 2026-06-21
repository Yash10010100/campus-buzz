import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId, Schema, Types } from "mongoose";
import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";
import { Teammembership } from "../models/teammember.model.js";
import { Event } from "../models/event.model.js";

const commonTeamAggregationPipeline = (teamId) => [
    {
        $match: {
            _id: new Types.ObjectId(teamId)
        }
    },
    {
        $lookup: {
            from: "teammemberships",
            localField: "_id",
            foreignField: "team",
            as: "members",
            pipeline: [
                {
                    $project: {
                        member: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: "$members"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "members.member",
            foreignField: "_id",
            as: "members.member",
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        email: 1,
                        avatar: 1
                    }
                }
            ]
        }
    },
    {
        $addFields: {
            "members": {
                $arrayElemAt: ["$members.member", 0]
            }
        }
    },
    {
        $addFields: {
            "members.avatar": "$members.avatar.url"
        }
    },
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            leader: { $first: "$leader" },
            members: {
                $push: "$members"
            }
        }
    },
    {
        $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "leader",
            as: "leader",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        email: 1,
                        fullname: 1,
                        usertype: 1,
                        avatar: 1
                    }
                },
            ]
        }
    },
    {
        $addFields: {
            "leader" : {
                $arrayElemAt: ["$leader", 0]
            }
        }
    },
    {
        $addFields: {
            "leader.avatar": "$leader.avatar.url"
        }
    }
]

const addTeamMember = asyncHandler(async (req, res) => {
    const { eventId, teamId } = req.params
    const { userId } = req.body

    if (!isValidObjectId(teamId)) {
        throw new ApiError(400, "Invalid team id")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(404, 'Event not found')
    }

    const team = await Team.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(teamId)
            }
        },
        {
            $lookup: {
                from: "teammemberships",
                localField: "_id",
                foreignField: "team",
                as: "members"
            }
        }
    ])

    if (!team?.length) {
        throw new ApiError(404, "Team not found")
    }

    if (team[0].members.some((member) => (member.member.toString() === userId.toString()))) {
        throw new ApiError(400, "User already in team")
    }

    if (team[0].members?.length === event.maxteamsize - 1) {
        throw new ApiError(400, "Maximum team size reached, can't add more members")
    }

    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.usertype !== "student") {
        throw new ApiError(400, "User type mismatch, can't add this type of user to a team")
    }

    const member = await Teammembership.create({
        team: teamId,
        member: userId
    })

    const updatedTeam = await Team.aggregate(
        commonTeamAggregationPipeline(teamId)
    )

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTeam[0],
                "Team member added"
            )
        )
})

const removeTeamMember = asyncHandler(async (req, res) => {
    const { teamId, userId } = req.params

    if (!isValidObjectId(teamId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid team id")
            )
    }

    const membership = await Teammembership.find({
        team: new Types.ObjectId(teamId),
        member: new Types.ObjectId(userId)
    })

    if (!membership || !membership.length) {
        throw new ApiError(404, "Member not found")
    }

    try {
        await Teammembership.deleteOne(membership[0]._id)
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong")
    }

    const updatedTeam = await Team.aggregate(
        commonTeamAggregationPipeline(teamId)
    )

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTeam[0],
                "Team member removed"
            )
        )
})

const getTeamDetail = asyncHandler(async (req, res) => {
    const { teamId } = req.params

    if (!isValidObjectId(teamId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid team id")
            )
    }

    const team = await Team.aggregate(
        commonTeamAggregationPipeline(teamId)
    )

    if (!team?.length) {
        throw new ApiError(404, "Team not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                team[0],
                "Team details"
            )
        )

})

export {
    commonTeamAggregationPipeline,
    addTeamMember,
    removeTeamMember,
    getTeamDetail,
}