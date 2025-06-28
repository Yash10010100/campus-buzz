import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createParticipation, 
    completeParticipation
} from "../controllers/participation.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:eventId").post(createParticipation)

router.route("/:participationId").post(completeParticipation)

export default router