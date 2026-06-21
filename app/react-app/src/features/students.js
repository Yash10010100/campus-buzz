import config from "../config/config"
import request from "../util/request"

const eventBaseRoute = `${config.serverUrl}/events`

const stdFutureEventsRoute = `${eventBaseRoute}/fetch/std`
const stdHistoryRoute = `${eventBaseRoute}/fetch/std-history`

const participationBaseRoute = `${config.serverUrl}/participation`

const registrationDetailsRoute = `${config.serverUrl}/`

const teamBaseRoute = `${config.serverUrl}/teams`

const createParticipation = async (eventId) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${eventId}`,
        {}
    )
}

const addTeamMember = async (eventId, teamId, body) => {
    return await request(
        "POST",
        null,
        `${teamBaseRoute}/${eventId}/${teamId}`,
        {
            body: JSON.stringify(body)
        }
    )
}

const removeTeamMember = async (eventId, teamId, userId) => {
    return await request(
        "DELETE",
        null,
        `${teamBaseRoute}/${eventId}/${teamId}/${userId}`
    )
}

const addRegDetails = async (eventId, participationId, body) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${eventId}/${participationId}/fill-details`,
        {
            body: body
        }
    )
}

const uploadFile = async (eventId, participationId, body) => {
    return await request(
        "POST",
        {},
        `${participationBaseRoute}/${eventId}/${participationId}/file-upload`,
        {
            body:body
        }
    )
}

const completeParticipation = async (participationId) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${participationId}`,
        {}
    )
}

const fetchStdFutureEvents = async () => {
    return await request(
        "GET",
        null,
        stdFutureEventsRoute,
        {}
    )
}

const fetchStdHistory = async () => {
    return await request(
        "GET",
        null,
        stdHistoryRoute,
        {}
    )
}

export {
    fetchStdFutureEvents,
    fetchStdHistory,
    createParticipation,
    addTeamMember,
    removeTeamMember,
    addRegDetails,
    uploadFile,
    completeParticipation
}