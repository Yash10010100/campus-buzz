import React, { useEffect, useState, version } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getEvent, deleteEvent } from '../features/organizer.js'
import { AddTeam, ContentLoader, CustomForm, ErrorMSG, EventForm } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { getDateAndTimeFromMS } from '../util/time.js'
import { setEvent, updateEventRegistration } from '../redux/eventSlice.js'

function RegisterEvent() {

    const { eventId } = useParams()

    const dispatch = useDispatch()
    const event = useSelector(state => state.event.data)
    const team = event?.participation?.team

    const navigate = useNavigate()

    const now = Date.now()

    const user = useSelector(state => state.auth.user)

    // const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.usertype !== 'student') {
            navigate("/user")
            return
        } else if (!event || event._id !== eventId) {
            getEvent(eventId)
                .then((res) => {
                    console.log(res);
                    dispatch(setEvent({ event: res.data }))
                    // setEvent(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    navigate("/user")
                    setLoading(false)
                })
        }
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div className=''>
            <div className=' sticky top-0 z-2 bg-[var(--main-color)]'>
                <div className=' p-3 flex place-items-center'>
                    <div className=' pr-3'>
                        <button
                            title='back'
                            className={` p-1 rounded-full hover:bg-black/30 ${!navigation.canGoBack ? 'cursor-not-allowed' : ''}`}
                            disabled={!navigation.canGoBack}
                            onClick={(e) => {
                                if (navigation.canGoBack) navigation.back()
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={navigation.canGoBack ? "#343434" : "#818181"}><path d="m376-412 201 202-97 96-366-366 366-366 98 96-202 202h470v136H376Z" /></svg>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#343434"><path d="M646-39 203-480l443-442 109 110-332 332 332 332L646-39Z"/></svg> */}
                        </button>
                    </div>
                    <div className=' text-xl font-semibold text-[#343434] h-full border-l-2 pl-3'>
                        {event._id}/register
                    </div>
                </div>
                <hr />
            </div>
            <div className=' p-3 gap-3 flex flex-col place-items-center'>
                <p className=' text-center text-xl font-bold'>{event.name} : Registration page</p>
                <p className=' text-md text-center'>Event by {event.organizer}</p>
                <div className='p-2 bg-white rounded-xl border-2 w-full max-w-240'>
                    <h1 className='text-lg flex gap-2 items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M438-274h86v-246h-86v246Zm41.82-330.46q17.91 0 30.2-12.11 12.29-12.12 12.29-30.02 0-17.91-12.12-30.2-12.11-12.28-30.01-12.28-17.91 0-30.2 12.11t-12.29 30.02q0 17.9 12.12 30.19 12.11 12.29 30.01 12.29ZM480.07-68q-85.48 0-160.69-32.44t-130.84-88.05q-55.63-55.61-88.09-130.79Q68-394.46 68-479.93q0-85.74 32.5-161.17 32.5-75.43 88.21-131.23 55.71-55.8 130.79-87.74Q394.57-892 479.93-892q85.73 0 161.15 31.92 75.43 31.92 131.24 87.71 55.81 55.79 87.75 131.21Q892-565.74 892-479.98q0 85.75-31.92 160.62t-87.7 130.6q-55.78 55.73-131.18 88.25Q565.8-68 480.07-68Zm-.07-86q136.51 0 231.26-94.74Q806-343.49 806-480t-94.74-231.26Q616.51-806 480-806t-231.26 94.74Q154-616.51 154-480t94.74 231.26Q343.49-154 480-154Zm0-326Z" /></svg>
                        <span>Instructions for registration :</span>
                    </h1>
                    <div className='px-1 py-2 space-y-0.5'>
                        <p className='flex gap-1'>
                            <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#111"><path d="M646.15-450H200v-58h446.15L437.46-716.69 479-760l281 281-279 279-41.54-43.31L646.15-450Z" /></svg>
                            {event.isteamevent ? "This is a team event, only team registrations are allowed." : "This is an individual participation event. Team registrations are not allowed."}
                        </p>
                        {event.isteamevent && <p className='flex gap-1'>
                            <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#111"><path d="M646.15-450H200v-58h446.15L437.46-716.69 479-760l281 281-279 279-41.54-43.31L646.15-450Z" /></svg>
                            You must add team members as per the team size limit provided by event organizer.
                        </p>}
                        <p className='flex gap-1'>
                            <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#111"><path d="M646.15-450H200v-58h446.15L437.46-716.69 479-760l281 281-279 279-41.54-43.31L646.15-450Z" /></svg>
                            You have to fill the registration form below in order to complete the registration process.
                        </p>
                        <p className='flex gap-1'>
                            <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#111"><path d="M646.15-450H200v-58h446.15L437.46-716.69 479-760l281 281-279 279-41.54-43.31L646.15-450Z" /></svg>
                            This form is created by the event organizer to collect participant details.
                        </p>
                        <p className='flex gap-1'>
                            <svg className='pt-1' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#111"><path d="M646.15-450H200v-58h446.15L437.46-716.69 479-760l281 281-279 279-41.54-43.31L646.15-450Z" /></svg>
                            Final step : Click on the "Request registration" button at the bottom of the page.
                        </p>
                    </div>
                </div>
                <div className='flex place-content-center w-full'>
                    {
                        !event.participation.registrationdetail || !event.participation.registrationdetail.submitted ?
                            <CustomForm eventId={event._id} participationId={event.participation._id} form={event.registrationform} registrationdetail={event.participation.registrationdetail?.details} />
                            :
                            <div className=' bg-white/90 rounded-xl p-4 w-full border-2 max-w-240'>
                                <p className='pb-1.5'>Your registration details</p>
                                <ul>
                                    {
                                        Object.keys(event.participation.registrationdetail.details).map(key => (
                                            <li key={key}>
                                                <div className=' flex border-t-2 border-black/20 text-center'>
                                                    <p className=' py-1.5 w-1/2 bg-[var(--accent-color)]/50 font-bold'>{key}</p>
                                                    <p className=' py-1.5 w-1/2 bg-[var(--accent-color)]/40'>
                                                        {typeof event.participation.registrationdetail.details[key] === "object" ?
                                                            // <img src={event.participation.registrationdetail.details[key].url} alt="file" />
                                                            <a href={event.participation.registrationdetail.details[key].url} target="_blank" className=' text-blue-800 underline'>Open the file in new tab</a>
                                                            :
                                                            event.participation.registrationdetail.details[key]}
                                                    </p>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                    }
                </div>
                {event.participation.team && <div className=' bg-white/90 rounded-xl p-6 w-full border-2 max-w-240'>
                    <AddTeam
                        eventId={event._id}
                        // team={event.participation.team}
                        team={team}
                        min={event.minteamsize}
                        max={event.maxteamsize}
                    />
                </div>}
            </div>
        </div>
    )
}

export default RegisterEvent
