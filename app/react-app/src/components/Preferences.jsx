import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Preferences() {

    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.user)


    return (
        <div>
            Preferences
        </div>
    )


}

export default Preferences
