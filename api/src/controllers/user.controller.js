import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        return res
            .status(404)
            .json(
                new ApiError(404, `User not found`)
            )
    }

    try {
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, error.message || "Something went wrong while generating access and refresh tokens")
            )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { usertype, fullname, email, username, password } = req.body

    if (
        [usertype, fullname, email, username, password].some((field) => (field?.trim() === ""))
    ) {
        return res
            .status(400)
            .json(
                new ApiError(400, "All fields are required")
            )
    }

    if (usertype !== "student" && usertype !== "organizer") {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid user type")
            )
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        if (email === existedUser.email)
            return res
                .status(409)
                .json(
                    new ApiError(409, "User with same email already exists")
                )
        else
            return res
                .status(409)
                .json(
                    new ApiError(409, "User with same username already exists")
                )
    }

    console.warn(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path

    let avatar;

    if (avatarLocalPath) {
        try {
            avatar = await uploadOnCloudinary(avatarLocalPath)
        } catch (error) {
            console.log("Error uploading avatar", error);
            return res
                .status(500)
                .json(
                    new ApiError(500, "Failed to upload avatar")
                )
        }
    }

    try {
        const user = await User.create({
            usertype,
            fullname,
            avatar: {
                url: avatar?.url,
                pid: avatar?.public_id
            },
            email,
            password,
            username
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!user) {
            return res
                .status(500)
                .json(
                    new ApiError(500, "Something went wrong while registering a user")
                )
        }

        user.avatar = user.avatar?.url

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        return res
            .status(201)
            .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24 * 1, ...options })
            .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 10, ...options })
            .json(new ApiResponse(200, createdUser, "User registered and logged in successfully"))
    } catch (error) {
        console.log("User creation failed", error);

        if (avatar) {
            await deleteFromCloudinary(avatar.public_id)
        }
        return res
            .status(500)
            .json(
                new ApiError(500, "Something went wrong while registering a user and images were deleted")
            )
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { usertype, usernameoremail, password } = req.body

    if (!usertype?.trim()) {
        return res
            .status(400)
            .json(
                new ApiError(400, "User type is required")
            )
    }

    if (!usernameoremail?.trim()) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Username or email is required")
            )
    }

    if (!password?.trim()) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Password is required")
            )
    }

    const user = await User.findOne({
        $or: [{ username: usernameoremail }, { email: usernameoremail }]
    })

    if (!user) {
        return res
            .status(409)
            .json(
                new ApiError(409, "User doesn't exist")
            )
    }

    if (user.usertype !== usertype) {
        return res
            .status(400)
            .json(
                new ApiError(400, "User type mismatch")
            )
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        return res
            .status(401)
            .json(
                new ApiError(401, "Invalid password")
            )
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        return res
            .status(500)
            .json(
                new ApiError(500, "Something went wrong")
            )
    }

    loggedInUser.avatar = loggedInUser?.avatar?.url

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24 * 1, ...options })
        .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 10, ...options })
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        return res
            .status(401)
            .json(
                new ApiError(401, "Refresh token is required")
            )
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res
                .status(401)
                .json(
                    new ApiError(401, "Invalid refresh token")
                )
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res
                .status(401)
                .json(
                    new ApiError(401, "Invalid refresh token")
                )
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        user.password = ""
        user.refreshToken = ""
        user.avatar = user.avatar?.url

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24 * 1, ...options })
            .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 10, ...options })
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            )
    } catch (error) {
        return res
                .status(500)
                .json(
                    new ApiError(500, "Something went wrong while refreshing access token")
                )
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)

    const isPasswodValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswodValid) {
        return res
            .status(401)
            .json(
                new ApiError(401, "Old password is incorrect")
            )
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = req.user
    user.avatar = user.avatar?.url
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user details"
            )
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, username } = req.body

    if (!fullname?.trim() && !username?.trim()) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Fullname or a username is required!")
            )
    }

    const newFullname = fullname
    const newUsername = username

    try {
        const user = await User.findById(
            req.user?._id
        ).select("-password -refreshToken")


        if (!user) {
            return res
                .status(400)
                .json(
                    new ApiError(400, "User not found")
                )
        }

        if (newFullname) {
            user.fullname = newFullname.trim()
        }

        if (newUsername) {
            user.username = newUsername.trim()
        }

        user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "Account details updated successfully"
                )
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, error.message || "Something went wrong while updating account details")
            )
    }
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        return res
            .status(400)
            .json(
                new ApiError(400, "File is required")
            )
    }

    try {
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if (!avatar?.url) {
            return res
                .status(500)
                .json(
                    new ApiError(500, "Something went wrong while uploading the avatar file")
                )
        }


        const user = await User.findById(req.user?._id).select("-password -refreshToken")

        if (!user) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "User not found")
                )
        }

        const oldAvatar = user.avatar

        user.avatar = { url: avatar.url, pid: avatar.public_id }

        await deleteFromCloudinary(oldAvatar?.pid)

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedUser, "Avatar updated successfully")
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, error.message || "Something went wrong while updating the avatar file")
            )
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
}