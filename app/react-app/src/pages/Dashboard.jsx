import React from 'react'
import { CommonLayout, OrgDashboard, StdDashboard, } from '../components'
import { useSelector } from 'react-redux'

function Dashboard() {

    const user = useSelector(state => state.auth.user)

    return (
        <CommonLayout current='dashboard'>
            {user?.usertype === "student" ? (<StdDashboard />) : (user?.usertype === "organizer" ? (<OrgDashboard />) : null)}
        </CommonLayout>
    )
}

export default Dashboard
