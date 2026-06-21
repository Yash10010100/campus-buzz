import React from 'react'
import EventCard from './EventCard'

function GridView({
    events=[],
    relativePath=""
}) {
    return (
        <div>
            <ul className={` p-2 py-3 grid xl:grid-cols-3 lg:grid-cols-2 max-[850px]:grid-cols-1 grid-cols-2 gap-3 grow-2`}>
                {events && events.map((e)=>(
                    <li key={e._id}>
                        <EventCard event={e} relativePath={relativePath}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GridView