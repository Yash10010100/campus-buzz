import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { eventFormBody } from '../features/organizer'
import { Button, ErrorMSG, Input } from '../components'
import { uploadEvent } from '../features/organizer.js'

function EventForm({
    fn
}) {

    const user = useSelector(state => state.auth.user)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [imgURL, setImgURL] = useState(null)
    const [isteamevent, setIsteamevent] = useState(false)

    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            ...eventFormBody,
        }
    })

    const upload = async (data) => {
        console.log(data);

        try {
            const formData = new FormData()

            formData.append("name", data.name)
            formData.append("organizer", data.organizer)
            formData.append("domain", data.domain)
            formData.append("date", new Date(data.date).getTime())
            formData.append("lastregistrationdate", new Date(data.lastregistrationdate).getTime())
            formData.append("description", data.description)
            formData.append("location", data.location)
            formData.append("city", data.city)
            formData.append("registrationfees", data.registrationfees)

            formData.append("isteamevent", data.isteamevent || false)
            if (data.isteamevent) {
                formData.append("minteamsize", data.minteamsize)
                formData.append("maxteamsize", data.maxteamsize)
            }

            const file = data.themeimage[0] // Access the first file
            formData.append("themeimage", file)

            console.log(data);

            console.log('Raw Form Data Object:')
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1])
            }

            const res = await uploadEvent(formData)

            if (res) {
                setMessage("Event uploaded successfully")
                setSuccess(true)
                setTimeout(() => {
                    fn()
                }, 2000)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return !success ? (
        <div className=' w-full py-3'>
            <p className=' flex gap-1.5 p-1 font-medium text-[#c91700] font-mono text-md'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m40-120 440-760 440 760H40Zm440-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Z" /></svg>
                <span>Please do not refresh the page, progress inside the form will not be saved here!</span>
            </p>

            <form className=' w-full rounded-b-lg border-2 border-[var(--main-border-color)] bg-[var(--sec-color)]/5' onSubmit={handleSubmit(upload)}>
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
                            {...register("organizer", { required: true })}
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
                            <img className=' rounded-lg border-2  border-black/20 shadow-2xl' src={imgURL} alt="null" />
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
                                placeholder={"add your event's description here"}
                                className='px-3 py-2 rounded-lg bg-transparent text-black outline-none duration-200 w-full h-40 max-h-80 min-h-20 border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60'
                                {...register("description", { required: true })}
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
                                    className={`px-3 py-2 max-w-25 rounded-lg bg-transparent text-black outline-none duration-200  border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60 ${isteamevent ? '' : 'cursor-not-allowed'}`}
                                    type="number"
                                    {...register("minteamsize", { required: Boolean(isteamevent) })}
                                />
                                &nbsp;to&nbsp;
                                <label htmlFor="max">Max-</label>
                                <input
                                    disabled={!isteamevent}
                                    id='max'
                                    className={`px-3 py-2 max-w-25 rounded-lg bg-transparent text-black outline-none duration-200  border-3  border-[var(--sec-color)] focus:border-[var(--sec-color)]/80 focus:border-double hover:border-[var(--sec-color)]/60 ${isteamevent ? '' : 'cursor-not-allowed'}`}
                                    type="number"
                                    {...register("maxteamsize", { required: Boolean(isteamevent) })}
                                />
                            </div>
                        </div>}



                    </div>
                </div>
                <div className=' p-6 flex flex-col gap-2 place-content-center place-items-center'>
                    {error && <ErrorMSG message={error} />}
                    <Button
                        type='submit'
                        onSubmit={handleSubmit(upload)}
                    >Upload event</Button>
                </div>
            </form>
        </div>
    ) : <div className=' w-full p-4 text-xl text-center text-white bg-[var(--sec-color)]/95 rounded-lg border-2 border-white/20'>{message}</div>
}

export default EventForm
