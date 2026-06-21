import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addTeamMember,
    removeTeamMember,
    getTeamDetail
} from "../controllers/team.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:eventId/:teamId")
.post(addTeamMember)
.get(getTeamDetail)

router.route("/:eventId/:teamId/:userId").delete(removeTeamMember)

export default router