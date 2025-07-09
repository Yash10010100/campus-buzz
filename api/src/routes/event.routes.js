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

const router = Router()

router.use(verifyJWT)

router.route("/").post(uploadEvent)

router.route("/:eventId")
.get(getEvent)
.patch(updateEventDetails)
.delete(deleteEvent)

router.route("/:eventId/theme-image").patch(changeThemeImage)

router.route("/:eventId/form").post(createRegistrationForm)

router.route("/fetch")
.get(fetchFutureEvents)
.post(searchEventsWithQuery)

router.route("/fetch/org").get(futureEventsByOrg)

router.route("/fetch/org-history").get(pastEventsByOrg)

router.route("/fetch/std").get(currentStudentParticipationEvents)

router.route("/fetch/std-history").get(pastParticipationEvents)

export default router