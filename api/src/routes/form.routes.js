import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addFormField,
    deleteAField,
    getForm
} from "../controllers/form.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:eventId/:formId")
.post(addFormField)
.get(getForm)

router.route("/:eventId/:formId/:formfieldId").delete(deleteAField)

export default router