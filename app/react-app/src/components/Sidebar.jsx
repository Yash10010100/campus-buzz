import React from 'react'
import { Logo } from './'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Sidebar({
    logosize = 60,
    current
}) {

    const orgelements = [
        {
            name: "dashboard",
            to: "/user",
        },
        {
            name: "events",
            to: "/events"
        },
        {
            name: "participants",
            to: "/user/participants"
        },
        {
            name: "history",
            to: "/user/history"
        }
    ]

    const stdelements = [
        {
            name: "dashboard",
            to: "/user",
        },
        {
            name: "events",
            to: "/events"
        },
        {
            name: "preferences",
            to: "/user/preferences"
        },
        {
            name: "history",
            to: "/user/history"
        }
    ]

    const commonClasses = "text-white text-lg border-b-2 duration-50 hover:scale-103 hover:shadow-[0px_0px_25px_1px_var(--accent-color)] z-1000"
    const activeClasses = "bg-[var(--accent-color)]/95 border-[var(--accent-color)] hover:bg-[var(--accent-color)]"
    const inactiveClasses = "border-[var(--main-border-color)] bg-[var(--sec-color)] hover:border-[var(--main-hover-border-color)] hover:shadow-[inset_0px_0px_12px_4px_var(--accent-color),_0px_0px_25px_1px_var(--accent-color)]"

    const user = useSelector(state => state.auth.user)

    return (
        <div className=' h-full min-w-60 flex flex-col'>
            <Logo size={logosize} />
            <div className=''>
                <ul className=' w-full flex flex-col text-center'>
                    {user?.usertype === "student" ? (stdelements.map((e) => (
                        <li className={`${commonClasses} ${e.name === current ? activeClasses : inactiveClasses}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : user?.usertype === "organizer" ? (orgelements.map((e) => (
                        <li className={`${commonClasses} ${e.name === current ? activeClasses : inactiveClasses}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : ""
                    }
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
