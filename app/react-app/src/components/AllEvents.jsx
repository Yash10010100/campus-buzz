import React, { useEffect, useState } from 'react'
import { fetchAllFutureEvents } from '../features/organizer.js'
import { ContentLoader, EventCard } from '../components'

function AllEvents() {

    const [events, setEvents] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchAllFutureEvents()
            .then((res) => {
                setEvents(res.data)
                setLoading(false)
            })
            .catch((err) => {

            })
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div className='p-2'>
            <p className=' p-2 pb-3 text-2xl'>{events && events.length ? `${events.length===1?'1 event' : events.length+' events'}  found in upcomming dates` : 'No events available in upcomming dates'}</p>
            <hr className='mb-5'/>

            <ul>
                <div className=' px-2 grid grid-cols-3 gap-3'>
                    {events && events.map((e)=>(
                        <li key={e._id}>
                            <EventCard event={e}/>
                        </li>
                    ))}
                </div>
            </ul>
        </div>
    )
}

export default AllEvents
