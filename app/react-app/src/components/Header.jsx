import React, { useState } from 'react'
import { Input, LogoutBtn, ProfileInput, Search } from "./"
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { updateAccount } from '../features/auth.js'
import { login } from '../redux/authSlice.js'

function Header() {

    const dispatch = useDispatch()
    const [dropdown, setDropdown] = useState(false)
    const [disableInput, setDisableInput] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const user = useSelector(state => state.auth.user)
    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: user?.username || "Unknown",
            usertype: user?.usertype || "Unknown",
            fullname: user?.fullname || "Jhon Wick",
            email: user?.email || "jhon@continental.in",
            password: "********"
        }
    })

    const updateProfile = async (data) => {
        if (!disableInput) {
            return
        }
        setError('')
        setMessage('')

        if(!data.username || !data.username.trim()){
            setValue("username",user?.username)
            data.username=user?.username
        }

        if(!data.fullname || !data.fullname.trim()){
            setValue("fullname",user?.fullname)
            data.fullname=user?.fullname
        }

        if (data.username === user.username && data.fullname === user.fullname) {
            setMessage("No changes")
            return
        }

        try {
            const res = await updateAccount(data)

            if (res) {
                dispatch(login({ user: res.data }))
                setMessage(res.message)
            }
        } catch (err) {
            console.error(err);
            setError(err.message)
        }

    }

    return (
        <div className=' w-full h-full px-8 flex place-content-between place-items-center'>
            <div></div>
            {/* <Search /> */}
            <div className={` relative h-12`}>
                <div title='Account' className={` border-2 border-black/30 absolute right-0 top-0 rounded-xl h-full flex duration-300 overflow-hidden z-80 ${dropdown ? "bg-[var(--sec-color)]" : "bg-[#fcfcfc]"}`}>
                    <button
                        className={` p-0 m-0 outline-none border-none`}
                        onClick={() => {
                            setDropdown(state => !state)
                            setDisableInput(true)
                            setError("")
                            setMessage("")
                        }}
                    >
                        {
                            user?.avatar ?
                                (
                                    <img src={user.avatar} alt="" width={48} height={48} className=' bg-cover' />
                                ) : (
                                    <svg className=' duration-400' xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="48px" fill={`${dropdown ? '#ffffffdd' : '#242424'}`}><path d="M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm.66 370Q398-80 325-111.5t-127.5-86q-54.5-54.5-86-127.27Q80-397.53 80-480.27 80-563 111.5-635.5q31.5-72.5 86-127t127.27-86q72.76-31.5 155.5-31.5 82.73 0 155.23 31.5 72.5 31.5 127 86t86 127.03q31.5 72.53 31.5 155T848.5-325q-31.5 73-86 127.5t-127.03 86Q562.94-80 480.47-80Zm-.47-60q55 0 107.5-16T691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140Zm0-370q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0-77Zm0 374Z" /></svg>
                                )
                        }
                    </button>
                </div>
                {
                    // dropdown && 
                    <div className={` ${dropdown ? "w-80 h-104 bg-[#fcfcfc]/95 border-black/10 p-1 px-2 z-10  top-[-6px] right-[-7px]" : "p-0 w-0 h-0 bg-transparent border-transparent z-0 top-6 right-6"} absolute rounded-[15px] duration-400 border-2 overflow-hidden flex flex-col `}>
                        <div className={` ${dropdown ? ' scale-100' : ' scale-0'} duration-400 space-y-2.5 overflow-hidden `}>
                            <form onSubmit={handleSubmit(updateProfile)}>
                                <div className=' flex flex-col gap-2.5'>
                                    <div className='mr-14 h-12 flex gap-8 place-items-center place-content-between'>
                                        <button
                                            className=' rounded-4xl p-[2px] hover:bg-red-600/30'
                                            onClick={() => {
                                                setDropdown(false)
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f16"><path d="m254-159-94-95 225-226-225-226 94-96 226 226 226-226 94 96-225 226 225 226-94 95-226-226-226 226Z" /></svg>
                                        </button>
                                        <div className=' flex flex-col text-right'>
                                            {/* <div className=' h-2.5 w-full'></div> */}
                                            <div className=' text-xl font-semibold flex gap-2'>

                                                <button
                                                    title={disableInput?'edit profile':'save profile'}
                                                    type='submit'
                                                    onClick={() => {
                                                        setDisableInput(state=>!state)
                                                    }}>
                                                        {disableInput?(
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#555"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                                                        ):(
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#484"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>
                                                        )}
                                                </button>

                                                <ProfileInput className=" text-right" {...register("username")} disabled={disableInput} />
                                            </div>
                                        </div>
                                    </div>

                                    <ProfileInput disabled type="text" label="User type :" {...register("usertype")} />
                                    <ProfileInput disabled={disableInput} label="Full name :" {...register("fullname")} />
                                    <ProfileInput disabled type="email" label="Email :" {...register("email")} />
                                    <ProfileInput disabled type="password" label="Password :" {...register("password")} />

                                </div>
                            </form>
                            <LogoutBtn />
                        </div>
                    </div>}
                {dropdown && (error || message) && <div className={` w-80 p-2 px-3 flex place-content-between place-items-center bg-[#fcfcfc]/80 border-2 border-[var(--main-border-color)]/30 rounded-xl absolute z-80 left-[-313px] top-104 ${error ? 'text-red-800' : 'text-green-900'}`}>

                    <div>{error ? 'Error : ' + error : message}</div>
                    <button onClick={() => {
                        setError('')
                        setMessage('')
                    }} className=' hover:bg-black/20 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3a3a3a"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" /></svg></button>
                </div>}
            </div>

        </div>
    )
}

export default Header
