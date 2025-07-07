import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { FORM_FIELD_DATATYPES } from "../constants.js";
import { isValidObjectId, Schema } from "mongoose";
import { Event } from "../models/event.model.js";
import { Form } from "../models/form.model.js";
import { Formfield } from "../models/formfield.model.js"

const addFormField = asyncHandler(async (req, res) => {
    const { eventId, formId } = req.params
    const { name, datatype, tooltip, required, ifenumoptions } = req.body

    if(!isValidObjectId(eventId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event Id")
            )
    }
    
    if(!isValidObjectId(formId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form Id")
            )
    }

    const event = await Event.findById(eventId)

    if(!event){
        return res
            .status(404)
            .json(
                new ApiError(404, "Event not found")
            )
    }

    const form = await Form.findById(formId)

    if(!form){
        return res
            .status(404)
            .json(
                new ApiError(404, "Form not found")
            )
    }

    if(event.registrationform !== form._id){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form id for this event")
            )
    }

    if([name, datatype, tooltip].some((value)=>(value?.trim()===""))){
        return res
            .status(400)
            .json(
                new ApiError(400, "Required field is missing")
            )
    }

    if(!FORM_FIELD_DATATYPES.some((type)=>(type.name === datatype))){
        return res
            .status(400)
            .json(
                new ApiError(400, "Datatype must be one of the form-field-datatypes")
            )
    }

    const currentType = FORM_FIELD_DATATYPES.filter((type)=>(type.name===datatype?type:null))[0]

    if(currentType.isEnum && (typeof ifenumoptions !== Array)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Enum options must be provided in an array")
            )
    }

    if(currentType.isEnum && (!ifenumoptions || !ifenumoptions.length)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Enum options are required for enumerated datatypes")
            )
    }

    const formfield = await Formfield.create({
        name,
        required,
        tooltip,
        datatype,
        ifenumoptions,
        form: formId
    })

    if(!formfield){
        return res
            .status(500)
            .json(
                new Api(500, "Falied to add the field")
            )
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            formfield,
            "Form field added"
        )
    )
})

const deleteAField = asyncHandler(async (req, res) => {
    const { eventId, formId, formfieldId } = req.params

    if(!isValidObjectId(eventId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event Id")
            )
    }
    
    if(!isValidObjectId(formId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form Id")
            )
    }

    if(!isValidObjectId(formfieldId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form-field Id")
            )
    }

    const event = await Event.findById(eventId)

    if(!event){
        return res
            .status(404)
            .json(
                new ApiError(404, "Event not found")
            )
    }

    const form = await Form.findById(formId)

    if(!form){
        return res
            .status(404)
            .json(
                new ApiError(404, "Form not found")
            )
    }

    if(event.registrationform !== form._id){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form id for this event")
            )
    }

    const formfield = await Formfield.findById(formfieldId)

    if(!formfield){
        return res
            .status(404)
            .json(
                new ApiError(404, "Form-field not found")
            )
    }

    if(formfield.form !== form._id){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form Id for form-field")
            )
    }

    await Formfield.deleteOne(formfield._id)

    res
    .status(200)
    .JSON(
        new ApiResponse(
            204,
            "",
            "Form-field deleted"
        )
    )
})

const getForm = asyncHandler(async (req, res) => {
    const { eventId, formId } = req.params

    if(!isValidObjectId(eventId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid event Id")
            )
    }
    
    if(!isValidObjectId(formId)){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form Id")
            )
    }

    const event = await Event.findById(eventId)

    if(!event){
        return res
            .status(404)
            .json(
                new ApiError(404, "Event not found")
            )
    }

    const form = await Form.findById(formId)

    if(!form){
        return res
            .status(404)
            .json(
                new ApiError(404, "Form not found")
            )
    }

    if(event.registrationform !== form._id){
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid form id for this event")
            )
    }

    const formdata = await Form.aggregate(
        [
            {
                $match: {
                    _id: Schema.Types.ObjectId(formId)
                }
            },
            {
                $lookup: {
                    from: "formfields",
                    foreignField: "form",
                    localField: "_id",
                    as: "formfields"
                }
            }
        ]
    )

    if(!formdata?.length){
        return res
            .status(400)
            .json(
                new ApiError(400, "Something went wrong while getting form data")
            )
    }

    res
    .status(400)
    .json(
        new ApiResponse(
            200,
            formdata[0],
            "Form data found"
        )
    )
})

export {
    addFormField,
    deleteAField,
    getForm,
}