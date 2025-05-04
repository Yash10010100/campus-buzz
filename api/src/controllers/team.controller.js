import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId, Schema } from "mongoose";
import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";
import { Teammembership } from "../models/teammember.model.js";

const commonTeamAggregationPipeline = (teamId) => [
    {
        $match: {
            _id: Schema.Types.ObjectId(teamId)
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
            "members.member": {
                $arrayElemAt: ["$members.member", 0]
            }
        }
    },
    {
        $addFields: {
            "members.member.avatar": "$members.member.avatar.url"
        }
    },
    {
        $group: {
            _id: "_id",
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
            "leader.avatar": "$leader.avatar.url"
        }
    }
]

const addTeamMember = asyncHandler(async (req, res) => {
    const { teamId } = req.params
    const { userId } = req.body

    if (!isValidObjectId(teamId)) {
        throw new ApiError(400, "Invalid team id")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const team = await Team.aggregate([
        {
            $match: {
                _id: Schema.Types.ObjectId(teamId)
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

    if (team[0].members.some((member) => (member.member === userId))) {
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
    const { teammembershipId } = req.params

    if (!isValidObjectId(teammembershipId)) {
        throw new ApiError(400, "Invalid team-membership id")
    }

    const membership = await Teammembership.findById(teammembershipId)

    const teamId = membership?.team

    try {
        await Teammembership.deleteOne(teammembershipId)
    } catch (error) {
        throw new ApiError(400,)
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
        throw new ApiError(400, "Invalid team id")
    }

    const team = await Team.aggregate(
        commonTeamAggregationPipeline(teamId)
    )

    if(!team?.length){
        throw new ApiError(400, "Team not found")
    }

    res
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