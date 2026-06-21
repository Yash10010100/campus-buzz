import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createParticipation, 
    completeParticipation
} from "../controllers/participation.controller.js";
import { addRegistrationDetails, uploadFile } from "../controllers/registrationdetail.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/:eventId").post(createParticipation)

router.route("/:participationId").post(completeParticipation)

router.route("/:eventId/:participationId/fill-details").post(addRegistrationDetails)

router.route("/:eventId/:participationId/file-upload").post(
    upload.single("file"),
    uploadFile
)

export default router