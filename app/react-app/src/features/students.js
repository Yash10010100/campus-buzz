import config from "../config/config"
import request from "../util/request"

const eventBaseRoute = `${config.serverUrl}/events`

const stdFutureEventsRoute = `${eventBaseRoute}/fetch/std`
const stdHistoryRoute = `${eventBaseRoute}/fetch/std-history`

const participationBaseRoute = `${config.serverUrl}/participation`

const registrationDetailsRoute = `${config.serverUrl}/`

const createParticipation = async (eventId) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${eventId}`,
        {}
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
}