import React, { useEffect, useState } from 'react'
import { fetchOrgFutureEvents } from '../features/organizer.js'
import { Button, ContentLoader, EventForm, GridView } from '../components'
import { Link, useNavigate } from 'react-router-dom'

function OrgDashboard() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [show, setShow] = useState(false)
    const [events, setEvents] = useState(null)
    const [reload, setReload] = useState(true)

    const f = () => {
        setReload(true)
    }

    useEffect(() => {

        if (reload) {
            setLoading(true)
            setReload(false)
            setShow(false)
            fetchOrgFutureEvents()
                .then((res) => {
                    console.log(res);

                    setEvents(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message)
                    setReload(true)
                })
        }
    }, [reload])

    return loading ?
        (
            <ContentLoader />
        )
        :
        (
            <div className=' min-w-125 p-2'>

                <div className=' flex'>
                    <div className={` w-full py-2 flex place-items-center gap-4 ${show ? 'place-content-between' : 'place-content-start'}`}>
                        <p className=' font-medium text-2xl'>upload your new upcomming event here</p>
                        <Button
                            onClick={() => {
                                setShow(state => !state)
                            }}
                            type="button"
                            // border=" border-3"
                            // borderColor=" border-white/20"
                            // bgColor="bg-[var(--accent-color)]/90"
                            // hoverClasses=" hover:bg-[var(--accent-color)]/95"
                            // activeClasses=" active:bg-[var(--accent-color)]/95 active:border-black/20"
                            className={`p-2 px-3 flex gap-2 place-items-center duration-200 font-semibold`}
                        >
                            {show ? 'Cancel' : 'Open form'}
                            {show ? (<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e2e2e2"><path d="m254-159-94-95 225-226-225-226 94-96 226 226 226-226 94 96-225 226 225 226-94 95-226-226-226 226Z" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e2e2e2"><path d="M421-110v-311H110v-118h311v-311h118v311h311v118H539v311H421Z" /></svg>)}
                        </Button>
                        {/* <Button
                            onClick={() => {
                                setShow(state => !state)
                            }}
                            type="button"
                            border=" border-2"
                            borderColor=" border-white/10"
                            bgColor="bg-[var(--main-border-color)]"
                            hoverClasses=" hover:bg-[var(--main-border-color)]/95"
                            activeClasses=" active:bg-[var(--main-border-color)] active:border-black/30"
                            className={`p-1 px-2 flex gap-2 place-items-center duration-200`}
                        >
                            {show ? 'Cancel' : 'New'}
                            {show ? (<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e2e2e2"><path d="m254-159-94-95 225-226-225-226 94-96 226 226 226-226 94 96-225 226 225 226-94 95-226-226-226 226Z" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e2e2e2"><path d="M421-110v-311H110v-118h311v-311h118v311h311v118H539v311H421Z" /></svg>)}
                        </Button> */}
                    </div>
                </div>

                {show && <EventForm fn={f} />}

                <hr className='mt-2' />

                <div className=' px-2'>

                    <p className=' pt-6 text-2xl'>{events?.length ? "Your upcomming events" : "You don't have any upcomming events currently"}</p>

                    <GridView events={events}/>
                </div>


                {events && events.length && events.some((event) => (!event.registrationform)) ? (
                    <div className=' pl-2 pt-6'>
                        <hr className=' mt-3' />
                        <p className=' text-xl'>Pending actions</p>
                        <div className=' py-2'>
                            <ul className=' border border-b-0'>
                                {events && events.length && events.map((e) => {
                                    return !e.registrationform ? (
                                        <li key={e._id}>
                                            <div className=' flex border-b'>
                                                <div className=' p-2 w-1/4 text-center border-r'>In <span className=' font-semibold'>{e.name}</span></div>
                                                <Link to={`/events/${e._id}/registration-form`}>
                                                    <div className=' p-2 h-full flex place-items-center gap-1.5'>
                                                        Registration form creation is pending
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#343434"><path d="M647-435H139v-91h508L415-758l66-64 341 341-342 342-65-63 232-233Z" /></svg>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>
                                    ) : null
                                })}
                            </ul>
                        </div>
                    </div>) : null}

            </div>
        )

}

export default OrgDashboard