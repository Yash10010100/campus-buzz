import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    types: null
}

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        setEvent: (state, action) => {
            state.data = action.payload.event
        },
        clearEvent: (state) => {
            state.data = null
        },
        updateEvent: (state, action) => {
            state.data = action.payload.event
        },
        updateEventForm: (state, action) => {
            state.data.registrationform = action.payload.registrationform
        },
        updateEventParticipation: (state, action) => {
            state.data.participation = action.payload.participation
        },
        updateEventRegistration: (state, action) => {
            state.data.participation.registrationdetail = action.payload.registrationdetail
        },
        updateEventTeam: (state, action) => {
            state.data.participation.team = action.payload.team
        },
        setTypes: (state, action) => { 
            state.types = action.payload.types
        }
    }
})

export const {
    setEvent,
    clearEvent,
    updateEvent,
    updateEventForm,
    updateEventParticipation,
    updateEventRegistration,
    updateEventTeam,
    setTypes
} = eventSlice.actions

export default eventSlice.reducer