import React, { useEffect, useState } from 'react'
import { fetchAllFutureEvents } from '../features/organizer.js'
import { ContentLoader, GridView } from '../components'

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
            <hr className=''/>

            <GridView events={events}/>
        </div>
    )
}

export default AllEvents
