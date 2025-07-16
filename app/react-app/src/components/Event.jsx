import React, { useEffect, useState, version } from 'react'
import { useParams } from 'react-router-dom'
import { getEvent } from '../features/organizer.js'
import { ContentLoader, EventForm } from '../components'
import { useSelector } from 'react-redux'
import { getDateAndTimeFromMS } from '../util/time.js'

function Event() {

    const { eventId } = useParams()

    const now = Date.now()

    const user = useSelector(state => state.auth.user)

    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isPastEvent, setIsPastEvent] = useState(false)
    const [canRegister, setCanRegister] = useState(false)
    const [error, setError] = useState("")
    const [show, setShow] = useState([false, true, false, false, false, false, false, false])

    const createData = (event) => {
        return [
            {
                title: 'Organizer',
                value: event.organizer || 'N/A'
            },
            {
                title: 'Domain',
                value: event.domain || 'N/A'
            },
            {
                title: 'Description',
                value: event.description || 'N/A'
            },
            {
                title: 'Duration',
                value: event.duration === 1 ? '1 day' : `${event.duration} days` || 'N/A'
            },
            {
                title: 'Date and Time',
                value: `${getDateAndTimeFromMS(event.date).day}, ${getDateAndTimeFromMS(event.date).date},  ${getDateAndTimeFromMS(event.date).time}` || 'N/A'
            },
            {
                title: 'Location and city',
                value: `${event.location}, ${event.city}` || 'N/A'
            },
            {
                title: 'Last date of registration',
                value: `${getDateAndTimeFromMS(event.lastregistrationdate).date},  ${getDateAndTimeFromMS(event.lastregistrationdate).time}` || 'N/A'
            },
            {
                title: 'Registration fees',
                value: `Rs. ${event.registrationfees}`
            },
        ]
    }

    useEffect(() => {
        getEvent(eventId)
            .then((res) => {
                console.log(res);
                setEvent(res.data)
                setIsPastEvent(now > res.data.date)
                setCanRegister(now < res.data.lastregistrationdate)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div className=' w-full'>
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
                        {event._id}
                    </div>
                </div>
                <hr />
            </div>

            <div className=' p-2'>
                <div className=' flex flex-col'>
                    <div className='w-full flex place-content-center'>
                        <div style={{ backgroundImage: `url(${event.themeimage})` }} className=' w-9/10'>
                            <div className='  p-2 text-center backdrop-blur-[10px]'>
                                <img src={event.themeimage} alt="" className=' rounded-xl border-3 border-white/20' />
                            </div>
                        </div>
                    </div>
                    <p className=' p-3 text-2xl text-center font-semibold'>{event.name}</p>
                    {canRegister && <p className=' p-2 text-center'>Registrations open - register now</p>}
                    <div className=' py-3 px-5'>
                        Options <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#343434"><path d="M88-222v-106h784v106H88Zm0-206v-106h784v106H88Zm0-206v-106h784v106H88Z" /></svg>
                    </div>
                    <ul className=' p-4 w-full'>
                        <div className=' w-full border-t border-black/20'>
                            {event && createData(event).map((e, i) => (
                                <li title='expand' key={e.title} className='border-b border-black/20'>
                                    <div
                                        onClick={() => {
                                            setShow(state => state.map((f, j) => j === i ? !f : f))
                                        }}
                                        className='p-3 hover:bg-[var(--accent-color)]/10'>
                                        <p className=' w-full text-xl flex place-content-between place-items-center'>
                                            {e.title}
                                            <svg className={`${show[i] ? ' rotate-90' : ''} duration-200`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#343434"><path d="M466-480 281-665l95-95 280 280-280 279-95-95 185-184Z" /></svg>
                                        </p>
                                        {
                                            show[i] && (
                                                <p>
                                                    {e.value}
                                                </p>
                                            )
                                        }
                                    </div>
                                </li>
                            ))}
                        </div>
                    </ul>

                </div>
            </div>


        </div>
    )
}

export default Event
