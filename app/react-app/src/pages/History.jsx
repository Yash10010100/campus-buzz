import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CommonLayout, OrgHistory, StdHistory } from '../components'

function History() {

    const user = useSelector(state => state.auth.user)

    return (
        <CommonLayout current='history'>
            {user?.usertype === "student" ? (<StdHistory />) : (user?.usertype === "organizer" ? (<OrgHistory />) : null)}
        </CommonLayout>
    )
}

export default History
