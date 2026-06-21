import React, { useEffect, useState } from 'react'
import { findUser } from '../features/auth'
import { addTeamMember, removeTeamMember } from '../features/students'
import { LoadingRing } from './'
import { useDispatch } from 'react-redux'
import { updateEventTeam } from '../redux/eventSlice'

function AddTeam({
    eventId,
    team,
    min,
    max
}) {

    const dispatch = useDispatch()

    const [key, setKey] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)

    const [reqloading, setReqLoading] = useState(false)
    const [reqErr, setReqErr] = useState("")

    const colors = ['bg-[var(--accent-color)]/10', 'bg-[var(--accent-color)]/20', 'bg-[var(--accent-color)]/30', 'bg-[var(--accent-color)]/40', 'bg-[var(--accent-color)]/50', 'bg-[var(--accent-color)]/60', 'bg-[var(--accent-color)]/70']
    // const colors = ['bg-blue-300', 'bg-violet-300', 'bg-emerald-300', 'bg-cyan-300', 'bg-indigo-300']

    const add = async () => {
        setReqLoading(true)
        addTeamMember(eventId, team._id, { userId: searchResult._id })
            .then(res => {
                console.log(res);
                // updateState(res.data)
                dispatch(updateEventTeam({team:res.data}))
                setKey("")
                setReqLoading(false)
            })
            .catch(error => {
                setReqErr(error.message)
                setKey("")
                setReqLoading(false)
            })
    }

    const remove = async (userId) => {
        setReqLoading(true)
        removeTeamMember(eventId, team._id, userId)
        .then(res=>{
            console.log(res);
            // updateState(res.data)
            dispatch(updateEventTeam({team:res.data}))
            setReqLoading(false)
        })
        .catch(error=>{
            setReqErr(error.message)
            setReqLoading(false)
        })
    }

    useEffect(() => {
        if (!key) {
            setSearchResult(null)
            setErr("")
            return
        }

        setLoading(true)
        setErr("")
        setSearchResult(null)

        findUser(key)
            .then(res => {
                setErr("")
                setSearchResult(res.data)
                setLoading(false)
            })
            .catch(err => {
                setSearchResult(null)
                setErr(err.message)
                setLoading(false)
            })
    }, [key])

    return (
        <div className=' w-full flex flex-col gap-4'>
            <div>
                <h1 className='text-xl font-bold'>Create your team here</h1>
                <p>Note : Team size could consist of {min} to {max} members including team leader</p>
            </div>
            <div className='flex'>
                <form className='bg-stone-200 w-1/2 min-w-100 rounded-xl text-xl flex overflow-hidden shadow-[0px_4px_5px_-1px_rgba(2,_1,_2,_0.5)]'>
                    <div className=' w-5/6 p-2 rounded-l-xl border-5 border-r-0 border-[var(--accent-color)]/5 hover:border-[var(--accent-color)]/15'>
                        <input
                            value={key}
                            key={"search-user"}
                            type="text"
                            placeholder='Search username or email'
                            className=' bg-transparent border-none outline-none w-full'
                            onChange={(e) => {
                                setKey(e.target.value.trim())
                            }}
                        />
                    </div>
                    <div className=' w-1/6 bg-red-700 rounded-r-xl border-5 border-l-0 border-black/10 hover:border-black/30'>
                        <button type='button' onClick={() => { setKey("") }} title='clear all' className=' active:scale-95 h-full w-full flex place-content-center place-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#DCEAD5"><path d="m488-326 75-74 74 74 80-80-75-74 75-74-80-80-74 74-75-74-79 80 74 74-74 74 79 80ZM372-114q-31.81 0-61.35-14.61Q281.11-143.22 262-169L34-480l228-311q19.11-25.78 48.65-40.39T372-846h418q57 0 96.5 39.5T926-710v460q0 57-39.5 96.5T790-114H372ZM202-480l167.55 232H792v-464H370L202-480Zm380 0Z" /></svg>
                        </button>
                    </div>
                </form>
                {loading && <LoadingRing />}
            </div>
            {reqErr && (
                <div className='p-2 text-red-600 text-lg flex gap-2 place-items-center'>
                    <p>{reqErr}</p>
                    <button onClick={() => { setReqErr("") }} className='hover:bg-gray-400/20 active:scale-99 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#242424"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" /></svg></button>
                </div>
            )}
            {searchResult && (
                <div>
                    <p className='p-2'>User found</p>
                    <div className='flex gap-4 place-items-center'>
                        <div className={` ${colors[Math.floor(Math.random() * 10) % colors.length]} p-0.5 w-1/2 rounded-xl border-2 border-black/20 hover:border-black/10 flex place-items-center gap-1 shadow-[0px_4px_5px_-1px_rgba(2,_1,_2,_0.5)]`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#18333C"><path d="M218.87-260.67q63.04-40.29 125.99-60.43 62.95-20.14 135.19-20.14 72.23 0 135.49 20.38 63.26 20.38 127.59 60.19 42.52-55.53 59.64-107.92 17.12-52.39 17.12-111.41 0-144.62-97.62-242.26-97.62-97.63-242.23-97.63-144.61 0-242.27 97.63-97.66 97.64-97.66 242.26 0 59.24 17.51 111.45 17.5 52.22 61.25 107.88Zm260.98-179.24q-61.93 0-104.31-42.55-42.39-42.55-42.39-104.33t42.53-104.3q42.53-42.52 104.47-42.52 61.93 0 104.31 42.67 42.39 42.67 42.39 104.44 0 61.78-42.53 104.18-42.53 42.41-104.47 42.41Zm-.42 377.11q-85.22 0-161.66-32.93-76.44-32.92-133.22-90.25-56.79-57.33-89.27-132.75T62.8-480.47q0-86.09 33.21-161.79 33.22-75.71 90.21-132.56 56.99-56.85 132.46-89.73 75.48-32.88 161.82-32.88 86.1 0 161.67 33.35 75.56 33.36 132.08 89.94 56.53 56.58 89.86 132.3 33.32 75.71 33.32 161.57 0 86.26-32.88 161.66-32.88 75.4-89.8 132.39-56.92 56.99-132.9 90.21Q565.86-62.8 479.43-62.8Z" /></svg>
                            {searchResult.username} ({searchResult.fullname})
                        </div>
                        <div>
                            <button
                                disabled={reqloading}
                                onClick={add}
                                className={`${reqloading ? 'cursor-wait' : ''} text-white p-3 bg-[var(--accent-color)] border-5 border-white/10 rounded-xl hover:border-white/20 active:border-black/20 shadow-[0px_4px_5px_-1px_rgba(2,_1,_2,_0.5)]`}
                            >
                                Add to team
                            </button>
                        </div>
                        {reqloading && <LoadingRing />}
                    </div>
                </div>
            )}
            {err && (
                <div className='text-red-600 p-2'>
                    {/* No user found */}
                    {err}
                </div>
            )}
            <div>
                <div>
                    <ul className=' flex flex-col gap-4 text-lg'>
                        <li key={team.leader._id}>
                            <div className={` ${colors[team.leader.email.length % colors.length]} w-1/2 min-w-100 p-1 rounded-full border-2 border-black/20 hover:border-black/10 flex place-items-center gap-1 shadow-[0px_4px_5px_-1px_rgba(2,_1,_2,_0.5)]`}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#18333C"><path d="M218.87-260.67q63.04-40.29 125.99-60.43 62.95-20.14 135.19-20.14 72.23 0 135.49 20.38 63.26 20.38 127.59 60.19 42.52-55.53 59.64-107.92 17.12-52.39 17.12-111.41 0-144.62-97.62-242.26-97.62-97.63-242.23-97.63-144.61 0-242.27 97.63-97.66 97.64-97.66 242.26 0 59.24 17.51 111.45 17.5 52.22 61.25 107.88Zm260.98-179.24q-61.93 0-104.31-42.55-42.39-42.55-42.39-104.33t42.53-104.3q42.53-42.52 104.47-42.52 61.93 0 104.31 42.67 42.39 42.67 42.39 104.44 0 61.78-42.53 104.18-42.53 42.41-104.47 42.41Zm-.42 377.11q-85.22 0-161.66-32.93-76.44-32.92-133.22-90.25-56.79-57.33-89.27-132.75T62.8-480.47q0-86.09 33.21-161.79 33.22-75.71 90.21-132.56 56.99-56.85 132.46-89.73 75.48-32.88 161.82-32.88 86.1 0 161.67 33.35 75.56 33.36 132.08 89.94 56.53 56.58 89.86 132.3 33.32 75.71 33.32 161.57 0 86.26-32.88 161.66-32.88 75.4-89.8 132.39-56.92 56.99-132.9 90.21Q565.86-62.8 479.43-62.8Z" /></svg>
                                {team.leader.username}({team.leader.fullname}) (team-leader)
                            </div>
                        </li>

                        {team.members.map((member) => (
                            <li key={member._id}>
                                <div className={` ${colors[member.email.length % colors.length]} w-1/2 min-w-100 p-1 rounded-full border-2 border-black/20 hover:border-black/10 flex place-content-between shadow-[0px_4px_5px_-1px_rgba(2,_1,_2,_0.5)]`}>
                                    <div className=' flex gap-1 items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#18333C"><path d="M218.87-260.67q63.04-40.29 125.99-60.43 62.95-20.14 135.19-20.14 72.23 0 135.49 20.38 63.26 20.38 127.59 60.19 42.52-55.53 59.64-107.92 17.12-52.39 17.12-111.41 0-144.62-97.62-242.26-97.62-97.63-242.23-97.63-144.61 0-242.27 97.63-97.66 97.64-97.66 242.26 0 59.24 17.51 111.45 17.5 52.22 61.25 107.88Zm260.98-179.24q-61.93 0-104.31-42.55-42.39-42.55-42.39-104.33t42.53-104.3q42.53-42.52 104.47-42.52 61.93 0 104.31 42.67 42.39 42.67 42.39 104.44 0 61.78-42.53 104.18-42.53 42.41-104.47 42.41Zm-.42 377.11q-85.22 0-161.66-32.93-76.44-32.92-133.22-90.25-56.79-57.33-89.27-132.75T62.8-480.47q0-86.09 33.21-161.79 33.22-75.71 90.21-132.56 56.99-56.85 132.46-89.73 75.48-32.88 161.82-32.88 86.1 0 161.67 33.35 75.56 33.36 132.08 89.94 56.53 56.58 89.86 132.3 33.32 75.71 33.32 161.57 0 86.26-32.88 161.66-32.88 75.4-89.8 132.39-56.92 56.99-132.9 90.21Q565.86-62.8 479.43-62.8Z" /></svg>
                                        <p>{member.username}({member.fullname})</p>
                                    </div>
                                    <button 
                                    className=' text-white bg-red-700/80 rounded-full px-4 border-3 border-black/20 hover:border-white/20 active:scale-98'
                                    onClick={()=>{
                                        remove(member._id)
                                    }}
                                    >
                                        remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AddTeam
