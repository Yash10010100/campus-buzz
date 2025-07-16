import React from 'react'
import { getDateAndTimeFromMS } from '../util/time';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function EventCard({
    event
}) {

    const user = useSelector(state=>state.auth.user)

    return (
        <Link to={`/events/${event._id}`}>
            <div className=' flex flex-col place-items-center p-2 border-3 bg-[var(--accent-color)]/90 hover:bg-[var(--accent-color)]/95 border-white/30 active:border-black/20 rounded-[14px] overflow-clip'>
                <img className='rounded-md border-2 border-black/5' src={event.themeimage} alt="" />
                <div className=' w-full p-2'>
                    <span className=' text-2xl font-semibold'>
                        {event.name}
                    </span>
                    <div className=' text-lg flex flex-col gap-1'>
                        <p className=' wrap-anywhere'>
                            by <span>{event.owner===user._id?"me":`${event.organizer}`}</span>
                        </p>
                        <p className=' text-sm'>
                            On date : {getDateAndTimeFromMS(event.date).date}
                        </p>
                        <p className=' overflow-ellipsis wrap-anywhere text-sm'>
                            {event.description.toString().substring(0, 40)}{event.description.toString().length > 40 ? (<span className=' text-stone-300'>....</span>) : (null)}
                        </p>
                    </div>
                </div>
                <p title='open' className=' w-full flex place-content-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fdfdfd"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" /></svg>
                </p>
            </div>
        </Link>
    )
}

export default EventCard
