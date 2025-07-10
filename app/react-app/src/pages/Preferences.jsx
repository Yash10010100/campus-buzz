import React from 'react'
import { CommonLayout, Preferences as Pref } from '../components'

function Preferences() {
    return (
        <CommonLayout current='preferences'>
            <Pref/>
        </CommonLayout>
    )
}

export default Preferences
