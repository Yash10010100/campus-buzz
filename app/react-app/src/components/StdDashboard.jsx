import React, { useEffect, useState } from 'react'
import { ContentLoader, EventCard, GridView } from './'
import { fetchStdFutureEvents } from '../features/students'
import { Link, useNavigate } from 'react-router-dom'

function StdDashboard() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [registered, setRegistered] = useState([])
    const [pending, setPending] = useState([])

    useEffect(() => {
        fetchStdFutureEvents()
            .then((res) => {
                console.log(res);
                
                setRegistered(res.data.registeredEvents)
                setPending(res.data.pendingRegistrationEvents)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            })
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div className=' px-2 py-4'>
            <div className=' pb-3'>
                <Link to='/events'>Discover more events&gt;&gt;</Link>
            </div>
            <div>
                <h1 className=' text-xl'>
                    {registered?.length ? 'Registered events for upcomming dates' : 'No events registered for upcomming dates'}
                </h1>
                {registered?.length ? (
                    <div className=''>
                        {/* <hr className='my-2.5' /> */}
                        <ul>
                            <div className={` p-2 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3`}>
                                {registered?.map((e) => (
                                    <li key={`${e._id}`}>
                                        <EventCard event={e} />
                                    </li>
                                ))}
                            </div>
                        </ul>
                    </div>
                ) : (null)}
            </div>
            <hr className='my-2.5' />
            <div>
                <h1 className=' text-xl'>
                    {pending?.length ? 'Events with pending registration' : 'No pending registrations'}
                </h1>
                {pending?.length ? (
                    <div className=''>
                        {/* <hr className='my-2.5' /> */}
                        <GridView events={pending} relativePath='/register'/>
                    </div>
                ) : (null)}
                <hr className="my-2.5" />

            </div>
        </div>
    )
}

export default StdDashboard
