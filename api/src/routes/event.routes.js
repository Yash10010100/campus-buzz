import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    uploadEvent,
    createRegistrationForm,
    updateEventDetails,
    changeThemeImage,
    getEvent,
    deleteEvent,
    searchEvents    
} from "../controllers/event.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(uploadEvent)

router.route("/:eventId")
.get(getEvent)
.patch(updateEventDetails)
.delete(deleteEvent)

router.route("/:eventId/theme-image").patch(changeThemeImage)

router.route("/:eventId/form").post(createRegistrationForm)

export default router