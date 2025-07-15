import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    uploadEvent,
    createRegistrationForm,
    updateEventDetails,
    changeThemeImage,
    getEvent,
    deleteEvent,
    fetchFutureEvents,
    searchEventsWithQuery,
    futureEventsByOrg,
    pastEventsByOrg,
    currentStudentParticipationEvents,
    pastParticipationEvents
} from "../controllers/event.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(upload.single("themeimage"),uploadEvent)

router.route("/access/:eventId")
.get(getEvent)
.delete(deleteEvent)

router.route("/update/:eventId/details").patch(changeThemeImage)
.patch(updateEventDetails)

router.route("/update/:eventId/theme-image").patch(changeThemeImage)

router.route("/update/:eventId/form").post(createRegistrationForm)

router.route("/fetch")
.get(fetchFutureEvents)
.post(searchEventsWithQuery)

router.route("/fetch/org").get(futureEventsByOrg)

router.route("/fetch/org-history").get(pastEventsByOrg)

router.route("/fetch/std").get(currentStudentParticipationEvents)

router.route("/fetch/std-history").get(pastParticipationEvents)

export default router