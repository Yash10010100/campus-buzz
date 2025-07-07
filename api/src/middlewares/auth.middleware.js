import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "")


    if (!token) {
        return res
            .status(401)
            .json(
                new ApiError(401, "Unauthorized")
            )
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res
                .status(401)
                .json(
                    new ApiError(401, "Unauthorized")
                )
        }

        if (decodedToken.usertype !== user.usertype) {
            return res
                .status(401)
                .json(
                    new ApiError(401, "Unauthorized")
                )
        }

        req.user = user

        next()
    } catch (error) {
        return res
                .status(401)
                .json(
                    new ApiError(401, "Invalid access token")
                )
    }
})