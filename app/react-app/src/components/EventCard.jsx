import React from 'react'
import { getDateAndTimeFromMS } from '../util/time';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function EventCard({
    event,
    relativePath = ""
}) {

    const user = useSelector(state=>state.auth.user)

    return (
        <Link to={`/events/${event._id}${relativePath}`}>
            <div className=' text-white max-[850px]:min-w-90 max-w-120 min-h-90 h-full flex flex-col place-items-center place-content-between p-2 border-3 bg-[var(--event-card-color)] hover:scale-101 hover:bg-[var(--event-card-color)]/95 border-white/30 active:border-black/20 rounded-[14px] overflow-clip shadow-[2px_5px_15px_-5px_rgba(0,_4,_1,_1)]'>
                <div className=' w-full p-2 space-y-1'>
                    <img className='rounded-md border-2 border-black/5' src={event.themeimage} alt="image loading" loading='lazy'/>
                    <h1 className=' text-2xl font-semibold'>
                        {event.name}
                    </h1>
                    <div className=' text-lg flex flex-col gap-1'>
                        <p className=' wrap-anywhere'>
                            by <span>{event.owner===user._id?`${event.organizer}(you)`:`${event.organizer}`}</span>
                        </p>
                        <p className=' text-sm'>
                            On date : {getDateAndTimeFromMS(event.date).date}
                        </p>
                        <p className=' overflow-hidden wrap-anywhere text-sm'>
                            {event.description.substring(0, 125)} ...more
                            {/* {event.description.toString().substring(0, 40)}{event.description.toString().length > 40 ? (<span className=' text-stone-300'>....</span>) : (null)} */}
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
