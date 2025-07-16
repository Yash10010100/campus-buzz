import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ErrorMSG, Input, Select } from './'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register as serverSignup } from '../features/auth.js'
import { login as storeLogin } from '../redux/authSlice'

function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { register, handleSubmit, getValues } = useForm({
        defaultValues:{
            usertype: "student",
            fullname: "",
            email: "",
            username: "",
            password: ""
        }
    })

    const [error, setError] = useState("")
    const [disable, setDisable] = useState(false)

    const signup = async (data) => {
        setDisable(true)
        setError("")

        try {
            console.log(JSON.stringify(data));

            const res = await serverSignup(data)

            if (res) {
                dispatch(storeLogin({ user: res.data }))
                navigate("/user")
            }
        } catch (error) {
            setError(error.message)
            console.error(error);
        } finally {
            setDisable(false)
        }
    }

    return (
        <div className=' flex flex-col gap-4 text-center'>
            <div>
                <h1 className=' font-medium text-lg'>
                    Sign-up
                </h1>
            </div>
            <p>
                Already have an account,&nbsp;
                <Link to="/auth/login" className="font-medium text-[#33D] transition-all duration-200 hover:underline">Sign-in</Link>
            </p>
            {error && <ErrorMSG message={error} />}
            <form onSubmit={handleSubmit(signup)} className=' flex flex-col gap-4 items-center'>
                <Select
                    label={"Select account type:"}
                    options={["student", "organizer"]}
                    {...register("usertype", { required: true })}
                />
                <Input
                    label="Fullname:"
                    placeholder="Enter your name"
                    {...register("fullname", { required: true })}
                />
                <Input
                    label="Email:"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                />
                <Input
                    label="Username:"
                    placeholder="Create a username"
                    {...register("username", { required: true })}
                />
                <Input
                    type="password"
                    label="Password:"
                    placeholder="Create a strong password"
                    {...register("password", { required: true })}
                />
                
                <Button
                    disabled={disable}
                    title={disable ? "wait" : "submit"}
                    className={`${disable ? " cursor-wait" : ""}`}
                    onClick={() => {
                        setError("")
                        if (!getValues("fullname") || !getValues("email") || !getValues("username") || !getValues("password")) {
                            setError("Required field is missing!")
                        }
                    }}
                    type='submit'
                >Sign in</Button>
            </form>
        </div>
    )
}

export default Signup
