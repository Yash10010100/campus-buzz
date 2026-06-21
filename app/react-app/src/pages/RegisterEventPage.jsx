import React from 'react'
import { CommonLayout, RegisterEvent } from '../components'

function RegisterEventPage() {
    return (
        <CommonLayout current='events'>
            <RegisterEvent/>
        </CommonLayout>
    )
}

export default RegisterEventPage
