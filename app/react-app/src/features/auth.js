import config from "../config/config"
import request from "../util/request"

const userBaseRoute = `${config.serverUrl}/users`
const registerRoute = "/register"
const loginRoute = "/login"
const logoutRoute = "/logout"
const refreshTokensRoute = "/refresh-token"
const currentUserRoute = "/current-user"
const changePasswordRoute = "/change-password"
const updateAccountRoute = "/update-account"
const updateAvatarRoute = "/update-avatar"

const register = async(body)=>{
    return await request(
        "POST",
        null,
        `${userBaseRoute}${registerRoute}`,
        {
            body:JSON.stringify(body)
        }
    )
}

const login = async(body)=>{
    return await request(
        "POST",
        null,
        `${userBaseRoute}${loginRoute}`,
        {
            body:JSON.stringify(body)
        }
    )
}

const logout = async()=>{
    return await request(
        "POST",
        null,
        `${userBaseRoute}${logoutRoute}`,
    )
}

const refreshAccessTokens = async()=>{
    return await request(
        "POST",
        null,
        `${userBaseRoute}${refreshTokensRoute}`,
    )
}

const getCurrentUser = async()=>{
    return await request(
        "GET",
        null,
        `${userBaseRoute}${currentUserRoute}`,
    )
}

const changePassword = async(body)=>{
    return await request(
        "POST",
        null,
        `${userBaseRoute}${changePasswordRoute}`,
        {
            body:JSON.stringify(body)
        }
    )
}

const updateAccount = async(body)=>{
    return await request(
        "PATCH",
        null,
        `${userBaseRoute}${updateAccountRoute}`,
        {
            body:JSON.stringify(body)
        }
    )
}

const updateAvatar = async(body)=>{
    return await request(
        "PATCH",
        {},
        `${userBaseRoute}${updateAvatarRoute}`,
        {
            body:JSON.stringify(body)
        }
    )
}

export {
    register,
    login,
    logout,
    refreshAccessTokens,
    getCurrentUser,
    changePassword,
    updateAccount,
    updateAvatar
}