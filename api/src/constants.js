export const DB_NAME = "campusbuzz"

export const FORM_FIELD_DATATYPES = [
    {
        name: "String",
        inputtype: "text",
        inputoptions: {}
    },
    {
        name: "Number",
        inputtype: "number",
        inputoptions: {
            inputMode: "numeric"
        }
    },
    {
        name: "Email",
        inputtype: "email",
        inputoptions: {}
    },
    {
        name: "Contact-number",
        inputtype: "text",
        inputoptions: {
            inputMode: "numeric",
            maxLength: 10
        }
    },
    {
        name: "Datetime",
        inputtype: "datetime-local",
        inputoptions: {}
    },
    {
        name: "File",
        inputtype: "file",
        inputoptions: {}
    },
    {
        name: "Boolean",
        inputtype: "radio",
        inputoptions: {},
        isEnum: true
    },
    {
        name: "Enum",
        inputtype: "",
        inputoptions: {},
        isEnum: true
    }
]