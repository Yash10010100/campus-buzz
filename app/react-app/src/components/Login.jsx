import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ErrorMSG, Input, Select } from './'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as serverLogin } from '../features/auth'
import { login as storeLogin } from '../redux/authSlice'

function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            usertype: "student",
            usernameoremail: "",
            password: ""
        }
    })

    const [error, setError] = useState("")
    const [disable, setDisable] = useState(false)

    const login = async(data) => {
        setDisable(true)
        setError("")
        try {
            const res = await serverLogin(data)
            if(res){
                dispatch(storeLogin({user:res.data.user}))
                navigate("/user")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setDisable(false)
        }
    }

    return (
        <div className=' flex flex-col gap-4 text-center'>
            <div>
                <h1 className=' font-medium text-lg'>
                    Sign-in
                </h1>
            </div>
            <p>
                Don&apos;t have an account,&nbsp;
                <Link to="/auth" className="font-medium text-[#33D] transition-all duration-200 hover:underline">Sign-up</Link>
            </p>
            {error && <ErrorMSG message={error} />}
            <form onSubmit={handleSubmit(login)} className=' flex flex-col gap-4 items-center'>
                <Select
                    label={"Select login type:"}
                    options={["student", "organizer"]}
                    {...register("usertype", { required: true })}
                />
                <Input
                    label="Email or Username:"
                    placeholder="Enter your email/username"
                    {...register("usernameoremail", { required: true })}
                />
                <Input
                    type="password"
                    label="Password:"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                />
                <Button
                    disabled={disable}
                    title={disable?"wait":"submit"}
                    className={` ${disable?" cursor-wait":""}`}
                    onClick={()=>{
                        setError("")
                        if(!getValues("usernameoremail") || !getValues("password")){
                            setError("Required field is missing!")
                        }
                    }}
                    type='submit'
                >Sign in</Button>
            </form>
        </div>
    )
}

export default Login
