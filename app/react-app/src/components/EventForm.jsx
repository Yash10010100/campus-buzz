import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { eventFormBody } from '../features/organizer'
import { Button, Input } from '../components'
import { uploadEvent } from '../features/organizer.js'

function EventForm({
    event,
}) {

    const user = useSelector(state => state.auth.user)
    const [error, setError] = useState("")
    const [imgURL, setImgURL] = useState(null)
    const [isteamevent, setIsteamevent] = useState(false)

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            ...eventFormBody,
            owner: user?._id
        }
    })

    const upload = async (data) => {

    }

    return (

        <div className=' w-full'>
            <div className=' font-mono font-stretch-110% text-lg py-2 px-2 flex place-content-between place-items-center gap-4 '>
                <p className=' font-semibold font-sans text-2xl'>You can upload your new upcomming event here.</p>
                <Button
                    onClick={() => {
                        setShow(false)
                    }}
                    type="button"
                    bgColor='bg-[#ca0101] '
                    borderColor='border-[#e11025]'
                    activeClasses='active:bg-[#ed2323] active:border-[#ad0606]'
                    hoverClasses='hover:bg-[#d61212]'
                    className='flex place-items-center gap-2 '>
                    Close the form <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e2e2e2"><path d="m254-159-94-95 225-226-225-226 94-96 226 226 226-226 94 96-225 226 225 226-94 95-226-226-226 226Z" /></svg>
                </Button>
                {/* Once uploaded, you can create a custom registration form for it. */}


                {/* <button>

                    </button>
                    <button
                        onClick={() => {
                            setShow(false)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f16"><path d="m254-159-94-95 225-226-225-226 94-96 226 226 226-226 94 96-225 226 225 226-94 95-226-226-226 226Z" /></svg>
                    </button> */}
            </div>
            <form className=' w-full border-2 border-[var(--main-border-color)] bg-[#fafafa]/20' onSubmit={handleSubmit(upload)}>
                <div className=' w-full p-2 flex gap-8'>
                    <div className=' w-full flex flex-col gap-6'>
                        <Input
                            className=" font-bold"
                            placeholder="Name of the event"
                            label="Name of the event : "
                            {...register("name", { required: true })}
                        />

                        <Input
                            placeholder="name of event organizer"
                            label="Event organizer : "
                        />

                        <Input
                            placeholder="Domain of the event"
                            label="Domain :"
                            {...register("domain", { required: true })}
                        />

                        <Input
                            inputMode="numeric"
                            maxLength={2}
                            label="Duration of the event (in days) :"
                            placeholder="enter the duration"
                        />

                        <Input
                            type="datetime-local"
                            label="Date of the event :"
                            {...register("date", { required: true })}
                        />

                        <Input
                            type="datetime-local"
                            label="Last date of registration : "
                            {...register("lastregistrationdate", { required: true })}
                        />

                        {imgURL && <div className='px-8 flex flex-col items-center gap-1'>
                            Theme image preview
                            <img className=' rounded-lg  border-[var(--main-border-color)] shadow-2xl' src={imgURL} alt="null" />
                        </div>}

                        <Input
                            onInput={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImgURL(URL.createObjectURL(e.target.files[0]))
                                } else {
                                    setImgURL(null)
                                }
                            }}
                            type="file"
                            label="Choose your event's theme image (.png/.jpg/.jpeg) :"
                            accept='image/png, image/jpg, image/jpeg'
                            {...register("themeimage", { required: true })}
                        />

                    </div>
                    <div className=' w-full flex flex-col gap-6'>

                        <div className=' min-w-100 w-full flex flex-col items-start'>
                            <label className='inline-block mb-1 pl-1' htmlFor="description">Event description : </label>
                            <textarea
                                id='description'
                                placeholder={"add your event's description here (max 400 letters)"}
                                maxLength={400}
                                className='px-3 py-2 rounded-lg bg-transparent text-black outline-none duration-200 w-full h-40 max-h-80 min-h-20 border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60'
                                {...register("description", {required: true})}
                            />
                        </div>

                        <div className=' min-w-100 w-full flex flex-col items-start'>
                            <label className='inline-block mb-1 pl-1' htmlFor="location">Location of the event : </label>
                            <textarea
                                id='location'
                                placeholder={"enter the complete location of event"}
                                maxLength={400}
                                className='px-3 py-2 rounded-lg bg-transparent text-black outline-none duration-200 w-full h-25 max-h-60 min-h-15 border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60'
                                {...register("location", { required: true })}
                            />
                        </div>

                        <Input
                            placeholder="city of event"
                            label="City of the event :"
                            {...register("city", { required: true })}
                        />

                        <Input
                            placeholder="enter the registration fees(in number)"
                            inputMode="numeric"
                            maxLength={5}
                            label="Registration fees : "
                            {...register("registrationfees", { required: true })}
                        />

                        <div className='pl-1'>
                            <div className=' text-lg flex place-items-center gap-3'>
                                <label htmlFor="isteamevent">Is it a team event?</label>
                                <input
                                    onInput={() => {
                                        setIsteamevent(state => !state)
                                    }}
                                    className=' size-4'
                                    id='isteamevent'
                                    type="checkbox"
                                    value={true}
                                    {...register("isteamevent")}
                                />
                            </div>
                            <span className='text-red-700 text-lg'>Note:</span> If not selected, then only individual participants will be allowed to your event!
                        </div>

                        {isteamevent && <div className={`${isteamevent ? '' : 'opacity-20 cursor-not-allowed'} pl-1 text-lg`}>
                            <p className='pb-1'>Set allowed team size : </p>
                            <div className='flex place-items-center'>
                                <label htmlFor="min">Min-</label>
                                <input
                                    disabled={!isteamevent}
                                    id='min'
                                    className={`px-3 py-2 max-w-25 rounded-lg bg-transparent text-black outline-none duration-200  border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60 ${isteamevent ? '' : 'cursor-not-allowed'}`} type="number" />
                                &nbsp;to&nbsp;
                                <label htmlFor="max">Max-</label>
                                <input
                                    disabled={!isteamevent}
                                    id='max'
                                    className={`px-3 py-2 max-w-25 rounded-lg bg-transparent text-black outline-none duration-200  border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60 ${isteamevent ? '' : 'cursor-not-allowed'}`} type="number" />
                            </div>
                        </div>}



                    </div>
                </div>
                <div className=' p-6 flex place-content-center place-items-center'>
                    <Button type='submit' onSubmit={handleSubmit(upload)}>Upload event</Button>
                </div>
            </form>
        </div>
    )
}

export default EventForm
