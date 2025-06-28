import config from "../config/config";
import request from "../util/request";

const eventBaseRoute = `${config.serverUrl}/events`

const uploadEventRoute = `${eventBaseRoute}`

const accessEventRoute = (eventId) => (`${eventBaseRoute}/${eventId}`)

const themeImageRoute = (eventId) => (`${eventBaseRoute}/${eventId}/theme-image`)

const regFormRoute = (eventId) => (`${eventBaseRoute}/${eventId}/form`)

const uploadEvent = async(body) => {
    return await request(
        "POST",
        {},
        uploadEventRoute,
        {
            body: JSON.stringify(body)
        }
    )
}

const getEvent = async(eventId) => {
    return await request(
        "GET",
        {},
        accessEventRoute(eventId),
        {}
    )
}

const updateEventDetails = async(eventId, body) => {
    return await request(
        "PATCH",
        {},
        accessEventRoute(eventId),
        {
            body:JSON.stringify(body)
        }
    )
}

const deleteEvent = async(eventId) => {
    return await request(
        "DELETE",
        {},
        accessEventRoute(eventId),
        {}
    )
}

const changeThemeImage = async(eventId, body) => {
    return await request(
        "PATCH",
        {},
        themeImageRoute(eventId),
        {
            body: JSON.stringify(body)
        }
    )
}

const createForm = async(eventId) => {
    return await request(
        "POST",
        {},
        regFormRoute(eventId),
        {}
    )
}



const formBaseRoute = `${config.serverUrl}/forms`

const addFieldOrGetFormRoute = (eventId, formId) => (`${formBaseRoute}/${eventId}/${formId}`)

const deleteFieldRoute = (eventId, formId, formfieldId) => (`${formBaseRoute}/${eventId}/${formId}/${formfieldId}`)

const addFormField = async(eventId, formId, body) => {
    return await request(
        "POST",
        {},
        addFieldOrGetFormRoute(eventId, formId),
        {
            body: JSON.stringify(body)
        }
    )
}

const getForm = async(eventId, formId) => {
    return await request(
        "GET",
        {},
        addFieldOrGetFormRoute(eventId, formId),
        {}
    )
}

const deleteFormField = async(eventId, formId, formfieldId) => {
    return await request(
        "DELETE",
        {},
        deleteFieldRoute(eventId, formId, formfieldId),
        {}
    )
}



export {
    uploadEvent,
    getEvent,
    updateEventDetails,
    deleteEvent,
    changeThemeImage,
    createForm,

    addFormField,
    getForm,
    deleteFormField,
}

