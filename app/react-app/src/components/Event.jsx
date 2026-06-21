import React, { createContext, useContext, useEffect, useState, version } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getEvent, deleteEvent } from '../features/organizer.js'
import { ContentLoader, ErrorMSG, EventForm } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { getDateAndTimeFromMS } from '../util/time.js'
import { createParticipation } from '../features/students.js'
import { setEvent, updateEventParticipation } from '../redux/eventSlice.js'

function Event() {

    const event = useSelector(state=>state.event.data)

    const dispatch = useDispatch()

    const { eventId } = useParams()

    const navigate = useNavigate()

    const now = Date.now()

    const user = useSelector(state => state.auth.user)

    // const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isPastEvent, setIsPastEvent] = useState(false)
    const [canRegister, setCanRegister] = useState(false)
    const [error, setError] = useState("")
    const [showOptions, setShowOptions] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [show, setShow] = useState([false, false, false, false, false, false, false, false])

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
                value: `${getDateAndTimeFromMS(event.lastregistrationdate).date}, ${getDateAndTimeFromMS(event.lastregistrationdate).time}` || 'N/A'
            },
            {
                title: 'Registration fees',
                value: `Rs. ${event.registrationfees}`
            },
        ]
    }

    useEffect(() => {
        if(!event || event._id !== eventId){
            getEvent(eventId)
                .then((res) => {
                    console.log(res);
                    dispatch(setEvent({event:res.data}))
                    setIsPastEvent(now > res.data.date)
                    setCanRegister((user.usertype === "student"))
                    setLoading(false)
                })
                .catch((err) => {
                    // setError(err.message)
                    navigate("/user")
                    setLoading(false)
                })
        }else{
            setLoading(false)
        }        
    }, [])

    const reqDeleteEvent = async () => {
        try {
            const res = await deleteEvent(event._id)

            if (res) {
                navigate("/user")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    const reqCreateParticipation = async () => {
        try {
            setLoading(true)

            const res = await createParticipation(event._id)

            if (res) {
                console.log(res);
                dispatch(updateEventParticipation({participation:res.data}))
                navigate('register')
            }
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

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

            <div className=''>
                <div className=' flex flex-col relative z-0'>
                    <div className='w-full flex place-content-center'>
                        <div style={{ backgroundImage: `url(${event.themeimage})`, backgroundSize: 'cover' }} className='w-full'>
                            <div className=' w-full flex place-content-center p-2 text-center backdrop-blur-[25px]'>
                                <img src={event.themeimage} alt="" width={'70%'} className=' rounded-xl border-2 border-black/20' />
                            </div>
                        </div>
                    </div>
                    <p className=' p-3 text-2xl text-center font-semibold'>{event.name}</p>

                    {
                        (canRegister ?
                            (event.participation?._id ?
                                (event.participation.success ?
                                    (now < event.date ?
                                        (<p className=' p-2 text-center text-lg text-green-400'>
                                            Registered Successfully - Show details
                                        </p>)
                                        :
                                        (<p className=' p-2 text-center text-lg text-green-400'>
                                            Participated ({ })
                                        </p>)
                                    )
                                    :
                                    (now < event.lastregistrationdate ?
                                        (<p className=' p-2 text-center text-lg text-red-500'>
                                            <Link to={'register'}>Registration pending - click here to complete now</Link>
                                        </p>)
                                        :
                                        (<p className=' p-2 text-center text-lg text-red-500'>
                                            Registrations closed
                                        </p>)
                                    )
                                )
                                :
                                (now < event.lastregistrationdate ?
                                    (event.registrationform._id && event.registrationform.fields?.length ? <p className=' p-2 text-center'>
                                        Registrations open - <button onClick={reqCreateParticipation} className=' p-3 rounded-lg border-3 border-transparent bg-green-400 hover:border-white/30 active:bg-green-400/90'>register now</button>
                                    </p> : <p className=' p-2 text-center'>
                                        Registrations not started yet
                                    </p>)
                                    :
                                    (<p className=' p-2 text-center text-red-500'>
                                        Registrations closed
                                    </p>)
                                )
                            )
                            :
                            (null)
                        )
                    }



                    {/* {
                        (canRegister && now < event.lastregistrationdate) ? (
                            <p className=' p-2 text-center'>
                                Registrations open - <button onClick={reqCreateParticipation} className=' p-3 rounded-lg border-3 border-transparent bg-green-400 hover:border-white/30 active:bg-green-400/90'>register now</button>
                            </p>
                        ) : (
                            (canRegister) ? (<p className=' p-2 text-center text-red-600'>Registrations closed</p>) : (null)
                        )} */}


                    {!isPastEvent && user._id === event.owner && <div className=' w-full bg-[var(--sec-color)] text-white text-center'>
                        <nav className='w-full'>
                            <ul className=' w-full flex place-items-center relative'>
                                <li className=' w-1/3'>
                                    <Link to={`update`}>
                                        <div className=' py-3 hover:bg-[var(--accent-color)] border-2 border-[var(--sec-color)] hover:border-[var(--accent-color)] active:border-[var(--main-hover-border-color)] flex place-content-center place-items-center gap-1'>
                                            <span>Edit event details</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M466-480 281-665l95-95 280 280-280 279-95-95 185-184Z" /></svg>
                                        </div>
                                    </Link>
                                </li>
                                <li className=' w-1/3'>
                                    <Link className='' to={`registration-form`}>
                                        <div className=' py-3 hover:bg-[var(--accent-color)] border-2 border-[var(--sec-color)] hover:border-[var(--accent-color)] active:border-[var(--main-hover-border-color)] flex place-content-center place-items-center gap-1'>
                                            <span>{event.registrationform?._id ? "Edit registration form" : "Create registration form"}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M466-480 281-665l95-95 280 280-280 279-95-95 185-184Z" /></svg>
                                        </div>
                                    </Link>
                                </li>
                                <li className=' w-1/3'>
                                    <button className='w-full' onClick={() => { setDeleteConfirm(true) }}><div className=' py-3 hover:bg-red-700 border-2 border-[var(--sec-color)] hover:border-red-700 active:border-red-600 flex place-content-center place-items-center gap-1'>
                                        <span>Delete event</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m379-278 101-102 102 102 80-80-102-102 102-102-80-80-102 102-101-102-80 80 101 102-101 102 80 80ZM267-74q-56 0-96-39.5T131-210v-501H68v-136h268v-66h287v66h269v136h-63v501q0 57-39.5 96.5T693-74H267Z" /></svg>
                                    </div>
                                    </button>
                                </li>
                                {deleteConfirm && (
                                    <div className="absolute left-1/5 top-[110%] w-3/5 bg-[var(--sec-color)] rounded-lg border-3 border-white/30 p-2 pb-4">
                                        <div className="flex flex-col gap-2">
                                            <div className='w-full flex place-content-end'>
                                                <button title='cancel' onClick={() => { setDeleteConfirm(false) }} className='p-1 rounded-full hover:bg-red-600/30'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="M252-203.69 205.69-252l227-228-227-230L252-758.31l229 230 227-230L754.31-710l-227 230 227 228L708-203.69l-227-230-229 230Z" /></svg>
                                                </button>
                                            </div>
                                            <h1 className="text-xl flex place-content-center place-items-start gap-1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M57.23-118 480-846l422.77 728H57.23ZM172-184h616L480-714 172-184Zm309-44.38q15.46 0 26.54-11.08 11.08-11.08 11.08-26.54 0-15.46-11.08-26.54-11.08-11.08-26.54-11.08-15.46 0-26.54 11.08-11.08 11.08-11.08 26.54 0 15.46 11.08 26.54 11.08 11.08 26.54 11.08Zm-33-112.24h66v-204h-66v204ZM480-449Z" /></svg>Are you sure you want to delete this event?</h1>
                                            <div className='flex place-content-center gap-4'>
                                                <button onClick={reqDeleteEvent} className='bg-red-600 border border-white/20 hover:border-white/50 hover:scale-102 active:scale-95 text-white p-2 rounded-md'>Yes, Delete</button>
                                                <button onClick={() => { setDeleteConfirm(false) }} className=' bg-white/20 border border-white/20 hover:border-white/50 hover:scale-102 active:scale-95 text-white p-2 rounded-md'>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ul>
                        </nav>
                    </div>}

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
                                                <p className=' p-1'>
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
