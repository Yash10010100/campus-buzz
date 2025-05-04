import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    addTeamMember,
    removeTeamMember,
    getTeamDetail
} from "../controllers/team.controller";

const router = Router()

router.use(verifyJWT)

router.route("/:teamId")
.post(addTeamMember)
.get(getTeamDetail)

router.route("/:teammembershipId").delete(removeTeamMember)

export default router