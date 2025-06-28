import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    // upload.single("avatar"),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/refresh-token").post(refreshAccessToken)

// secured routes ---->

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router