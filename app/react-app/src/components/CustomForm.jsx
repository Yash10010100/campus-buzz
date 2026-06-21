import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select } from './'
import { addRegDetails, uploadFile } from '../features/students'
import { useEffect } from 'react'
import { getTypes } from '../features/organizer'

function CustomForm({
    disableAll = false,
    eventId = '',
    participationId = '',
    form = {},
    registrationdetail = null, // use this for default values in form for details editing option
}) {

    const [loading, setLoading] = useState(true)
    const [types, setTypes] = useState([])
    
    useEffect(() => {
        setLoading(true)
        getTypes()
            .then((res) => {
                setTypes(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            })
    }, [])

    const defaults = {}

    form.fields?.forEach((field) => {
        defaults[`${field.name}`] = field.ifenumoptions?.length ? field.ifenumoptions[0] : ""
    })

    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            ...defaults
        }
    })

    const [reqLoading, setReqLoading] = useState(false)

    const submit = async (data) => {
        console.log(data);

        setReqLoading(true)
        try {
            const res = await addRegDetails(eventId, participationId, JSON.stringify({ data }))

            if (res) {
                updateState(res.data)
                setReqLoading(false)
            }
        } catch (error) {
            console.log(error);
            setReqLoading(false)
        }
    }

    const fileSubmit = async (file, name) => {
        setReqLoading(true)
        try {
            console.log(name, " : ", file);

            const formdata = new FormData()

            formdata.append("name", name)

            formdata.append("file", file[0])

            const res = await uploadFile(eventId, participationId, formdata)

            if (res) {
                updateState(res.data)
                setReqLoading(false)
            }
        } catch (error) {
            console.log(error);
            setReqLoading(false)
        }
    }

    return !loading ? (
        <div className='p-4 rounded-xl bg-white/90 border-2 border-[var(--sec-color)] text-black text-lg w-full max-w-240'>
            <p>Registration form</p>
            <hr className='my-1' />
            <div>
                <form onSubmit={handleSubmit(submit)}>
                    {form.fields?.length ? (
                        <ul className=' space-y-2'>
                            <p className='text-red-800 text-sm text-left'>Fields marked with * are mandatory to fill</p>
                            {form.fields.map((field) => (field.datatype !== "File" ?
                                <li key={field._id}>
                                    {
                                        (field.datatype === "Enum" || field.datatype === "Boolean") ? (
                                            <Select
                                                disabled={disableAll}
                                                title={field.tooltip}
                                                label={field.required ? `${field.name}  *` : `${field.name}`}
                                                options={field.ifenumoptions}
                                                {...register(`${field.name}`, { required: Boolean(field.required) })}
                                            />
                                        ) : (
                                            <Input
                                                disabled={disableAll}
                                                title={field.tooltip}
                                                placeholder={field.tooltip}
                                                label={field.required ? `${field.name}  *` : `${field.name}`}
                                                type={types.filter((type) => (type.name === field.datatype))[0].inputtype}
                                                {...register(`${field.name}`, { required: Boolean(field.required) })}
                                                {...types.filter(type => (type.name === field.datatype))[0].inputoptions}
                                            />
                                        )
                                    }
                                </li> : null
                            ))}
                            {form.fields.map((field) => (field.datatype === "File" ?
                                <li key={field._id}>
                                    <div className='flex gap-2'>
                                        <Input
                                            fileUrl={registrationdetail?.[field.name]?.url || null}
                                            disabled={disableAll || registrationdetail?.[field.name]?.url}
                                            title={field.tooltip}
                                            placeholder={field.tooltip}
                                            label={field.required ? `${field.name}  *` : `${field.name}`}
                                            type="file"
                                            {...register(`${field.name}`, { required: Boolean(field.required) })}
                                            {...types.filter(type => (type.name === field.datatype))[0].inputoptions}
                                        />
                                        <div className='flex flex-col place-content-end'>
                                            <Button
                                                type="button"
                                                disabled={disableAll || !getValues(`${field.name}`) || getValues(`${field.name}`).length === 0 || reqLoading}
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    await fileSubmit(getValues(`${field.name}`), field.name)
                                                }}
                                            >
                                                upload
                                            </Button>
                                        </div>
                                    </div>
                                </li> : null
                            ))}
                            <div className=' text-center pt-3'>
                                <Button
                                disabled={disableAll || reqLoading}
                                type="submit"
                                bgColor='bg-[var(--main-border-color)]'
                                hoverClasses='hover:bg-[var(--main-border-color)]/90'
                                activeClasses='active:bg-[var(--main-border-color)]/90'
                                className={`${reqLoading ? 'cursor-wait' : ''}`}
                            >Submit</Button></div>
                        </ul>
                    ) : null}
                </form>
            </div>
        </div>
    ) : null
}

export default CustomForm