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

    const user = useSelector(state => state.auth.user)
    return (
        <div className=' h-full min-w-60 flex flex-col'>
            <Logo size={logosize} />
            <div className=''>
                <ul className=' w-full flex flex-col text-center'>
                    {user?.usertype === "student" ? (stdelements.map((e) => (
                        <li className={` text-white text-lg border-b-2   duration-200 ${e.name === current ? "bg-[var(--sec-hover-color)] border-[var(--accent-color)]" : "border-[var(--main-border-color)] bg-[var(--sec-color)] hover:bg-[var(--sec-hover-color)] hover:border-[var(--main-hover-border-color)] hover:shadow-[inset_3px_2px_30px_6px_var(--sec-color)]"}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : user?.usertype === "organizer" ? (orgelements.map((e) => (
                        <li className={` text-white text-lg border-b-2  hover:border-[var(--main-hover-border-color)] duration-200 ${e.name === current ? " bg-[var(--sec-color)]/70 border-[var(--accent-color)] shadow-[inset_3px_2px_30px_6px_var(--sec-color)] inset-1" : "border-[var(--main-border-color)] bg-[var(--sec-color)] hover:bg-[var(--sec-hover-color)]"}`} key={e.name}><Link to={e.to}><p className=' p-3'>{e.name}</p></Link></li>
                    ))) : ""
                    }
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
