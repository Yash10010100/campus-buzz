import React, { useEffect, useState } from 'react'
import { getEvent } from '../features/organizer'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentLoader, EventForm } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { setEvent } from '../redux/eventSlice'

function UpdateEventComp() {

    const { eventId } = useParams()

    const dispatch = useDispatch()

    const user = useSelector(state => state.auth.user)
    const event = useSelector(state => state.event.data)
    // const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const f = () => {
        navigate(`/events/${eventId}`)
    }

    useEffect(() => {
        if (!event || event._id !== eventId) {
            getEvent(eventId)
                .then((res) => {
                    console.log(res);
                    dispatch(setEvent({event: res.data}))
                    // setEvent(res.data)
                    if (res.data.owner !== user._id) {
                        navigate(`/events/${eventId}`)
                        return
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message)
                    setLoading(false)
                })
        } else if (event.owner !== user._id) {
            navigate(`/event/${eventId}`)
        }
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div>
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
                        {event._id}/update-details
                    </div>
                </div>
                <hr />
            </div>
            <div className='px-4 pb-2'>
                <EventForm fn={f} event={event} />
            </div>
        </div>
    )
}

export default UpdateEventComp
