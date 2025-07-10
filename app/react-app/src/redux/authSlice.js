import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
            state.user = action.payload.user
        },
        logout: (state, action) => {
            state.status = false
            state.user = null
        }
    }
})

export const { login, logout } = slice.actions

export default slice.reducer