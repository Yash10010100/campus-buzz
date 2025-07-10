import React, { useState } from 'react'
import { logout as reqLogout } from '../features/auth.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout as storeLogout } from '../redux/authSlice.js'
import { Button } from './'

function LogoutBtn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [disable, setDisable] = useState(false)
    const [error, setError] = useState()

    const logout = async () => {
        try {
            setDisable(true)
            const res = await reqLogout()

            if (res) {
                dispatch(storeLogout())
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setDisable(false)
        }
    }

    return (
        <div className=' w-full flex flex-col place-items-center'>
            <Button
                disabled={disable}
                onClick={logout}
                bgColor='bg-[#ca0101] '
                borderColor='border-[#e11025]'
                activeClasses='active:bg-[#ed2323] active:border-[#ad0606]'
                hoverClasses='hover:bg-[#d61212]'
                className={` py-2 px-6 text-white rounded-lg ${disable ? 'cursor-wait' : ''}`}
            >
                logout
            </Button>
        </div>
    )
}

export default LogoutBtn
