import React from 'react'
import { LogoutBtn } from '../components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Home() {

    const status = useSelector(state=>state.auth.status)

    return (
        <div className=' h-full flex flex-col gap-6 place-content-center place-items-center text-6xl'>

            <div>
                Welcome home
            </div>
            <div>
                {status?
                    <LogoutBtn/>
                    :
                    <div className='flex flex-col place-items-center gap-2.5'>
                        <Link to="/auth">create a new account</Link>
                        or
                        <Link to="/auth/login">sign in to your account</Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home
