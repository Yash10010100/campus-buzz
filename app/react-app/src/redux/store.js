import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import eventSlice from "./eventSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        event: eventSlice
    }
})

export default store