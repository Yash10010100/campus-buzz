import config from "../config/config";
import request from "../util/request";

const eventBaseRoute = `${config.serverUrl}/events`

const uploadEventRoute = `${eventBaseRoute}`

// const accessEventRoute = (eventId) => (`${eventBaseRoute}/${eventId}`)

// const themeImageRoute = (eventId) => (`${eventBaseRoute}/${eventId}/theme-image`)

// const regFormRoute = (eventId) => (`${eventBaseRoute}/${eventId}/form`)

const futureEventsRoute = `${eventBaseRoute}/fetch`
const orgFutureEventsRoute = `${eventBaseRoute}/fetch/org`
const orgHistoryRoute = `${eventBaseRoute}/fetch/org-history`

const eventFormBody = (event) => {
    return {
        "name": event?.name || "",
        "description": event?.description || "",
        "organizer": event?.organizer || "",
        "domain": event?.domain || "",
        "location": event?.location || "",
        "city": event?.city || "",
        "date": event ? `${new Date(event.date).toISOString().slice(0, 16)}` : "",
        "duration": event?.duration || null,
        "registrationfees": event?.registrationfees || "",
        "lastregistrationdate": event ? `${new Date(event.lastregistrationdate).toISOString().slice(0, 16)}` : "",
        "isteamevent": event?.isteamevent ? true : false || false,
        "minteamsize": event?.minteamsize || null,
        "maxteamsize": event?.maxteamsize || null,
        "themeimage": event?.themeimage || "",
    }
}


const uploadEvent = async (body) => {
    return await request(
        "POST",
        {},
        uploadEventRoute,
        {
            body: body
        }
    )
}

const getEvent = async (eventId) => {
    return await request(
        "GET",
        null,
        `${eventBaseRoute}/access/${eventId}`,
        {}
    )
}

const updateEventDetails = async (eventId, body) => {
    return await request(
        "PATCH",
        null,
        `${eventBaseRoute}/update/${eventId}/details`,
        {
            body: JSON.stringify(body)
        }
    )
}

const deleteEvent = async (eventId) => {
    return await request(
        "DELETE",
        null,
        `${eventBaseRoute}/access/${eventId}`,
        {}
    )
}

const changeThemeImage = async (eventId, body) => {
    return await request(
        "PATCH",
        {},
        `${eventBaseRoute}/update/${eventId}/theme-image`,
        {
            body: JSON.stringify(body)
        }
    )
}

const createForm = async (eventId) => {
    return await request(
        "POST",
        null,
        `${eventBaseRoute}/update/${eventId}/form`,
        {}
    )
}

const fetchAllFutureEvents = async () => {
    return await request(
        "GET",
        null,
        futureEventsRoute,
        {}
    )
}

const fetchEventsWithQuery = async (query, sortOrder, filters) => {
    return await request(
        "POST",
        null,
        futureEventsRoute,
        {
            body: JSON.stringify({ query, sortOrder, filters })
        }
    )
}

const fetchOrgFutureEvents = async () => {
    return await request(
        "GET",
        null,
        orgFutureEventsRoute,
        {}
    )
}

const fetchOrgHistory = async () => {
    return await request(
        "GET",
        null,
        orgHistoryRoute,
        {}
    )
}



const formBaseRoute = `${config.serverUrl}/forms`


const addFieldOrGetFormRoute = (eventId, formId) => (`${formBaseRoute}/${eventId}/${formId}`)

const deleteFieldRoute = (eventId, formId, formfieldId) => (`${formBaseRoute}/${eventId}/${formId}/${formfieldId}`)

const getTypes = async () => {
    return await request(
        "GET",
        null,
        `${formBaseRoute}/data-types`,
        {}
    )
}

const addFormField = async (eventId, formId, body) => {
    return await request(
        "POST",
        null,
        addFieldOrGetFormRoute(eventId, formId),
        {
            body: JSON.stringify(body)
        }
    )
}

const getForm = async (eventId, formId) => {
    return await request(
        "GET",
        null,
        addFieldOrGetFormRoute(eventId, formId),
        {}
    )
}

const deleteFormField = async (eventId, formId, formfieldId) => {
    return await request(
        "DELETE",
        null,
        deleteFieldRoute(eventId, formId, formfieldId),
        {}
    )
}



export {
    eventFormBody,
    uploadEvent,
    getEvent,
    updateEventDetails,
    deleteEvent,
    changeThemeImage,
    createForm,
    fetchAllFutureEvents,
    fetchEventsWithQuery,
    fetchOrgFutureEvents,
    fetchOrgHistory,

    getTypes,
    addFormField,
    getForm,
    deleteFormField,
}

