import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Participants() {

    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.username)

    return (
        <div>
            Participants
        </div>
    )
}

export default Participants
