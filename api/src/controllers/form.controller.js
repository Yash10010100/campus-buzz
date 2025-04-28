import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Form } from "../models/form.model.js";
import { Formfield } from "../models/formfield.model.js"

const addFormField = asyncHandler(async (req, res) => {
    const { formId } = req.params
    const { name, datatype, tooltip, required, ifenumoptions } = req.body

    //todo
})

const deleteAField = asyncHandler(async (req, res) => {
    const { eventId, formId } = req.params

    //todo
})

const getForm = asyncHandler(async (req, res) => {
    const { formId } = req.params

    //todo
})

export {
    addFormField,
    deleteAField,
    getForm,
}