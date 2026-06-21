import React, { useEffect, useState } from 'react'
import { addFormField, createForm, deleteFormField, getEvent, getTypes } from '../features/organizer'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ContentLoader, CustomForm, ErrorMSG, Input, LoadingRing, ProfileInput, Select } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { setEvent, setTypes, updateEventForm } from '../redux/eventSlice'

function CreateForm() {

    const { eventId } = useParams()

    const dispatch = useDispatch()

    const user = useSelector(state => state.auth.user)

    const event = useSelector(state => state.event.data)
    const formdatatypes = useSelector(state => state.event.types)

    // const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [reqLoading, setReqLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentField, setCurrentField] = useState({ name: "", datatype: "String", tooltip: "", required: false, ifenumoptions: [] })
    const [curOption, setCurOption] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    // const [formdatatypes, setFormdatatypes] = useState(null)

    const navigate = useNavigate()

    const reqCreateForm = async () => {
        setError('')
        setReqLoading(true)
        try {
            const res = await createForm(event._id)

            if (res) {
                dispatch(updateEventForm({ registrationform: { ...res.data, fields: [] } }))
            }
            setReqLoading(false)
        } catch (error) {
            setError(error.message)
            setReqLoading(false)
        }
    }

    const reqAddField = async () => {
        setError('')
        setReqLoading(true)
        console.log(currentField);


        if (!currentField.name || !currentField.datatype || !currentField.tooltip) {
            setError("Name, Datatype and Tooltip are required!")
            setReqLoading(false)
            return
        }
        setCurrentField(state => ({ ...state, ifenumoptions: [...state.ifenumoptions] }))
        try {
            const res = await addFormField(event._id, event.registrationform?._id, currentField)

            if (res) {
                dispatch(updateEventForm({ registrationform: { ...event.registrationform, fields: [...event.registrationform.fields, res.data] } }))
                // setEvent(state => ({ ...state, registrationform: { ...state.registrationform, fields: [...state.registrationform.fields, res.data] } }))
                setShowAddForm(false)
                setCurrentField({ datatype: "String", required: false, ifenumoptions: [] })
                setReqLoading(false)
            }
        } catch (error) {
            setError(error.message)
            setReqLoading(false)
        }
    }

    const reqDeleteField = async (field) => {
        setError('')
        setReqLoading(true)
        try {
            const res = await deleteFormField(event._id, event.registrationform?._id, field?._id)

            if (res) {
                dispatch(updateEventForm({ registrationform: { ...event.registrationform, fields: event.registrationform.fields.filter(f => f._id !== field._id) } }))
                setEvent(state => ({
                    ...state, registrationform: {
                        ...state.registrationform,
                        fields: state.registrationform.fields.filter((f) => (
                            f._id.toString() !== field._id.toString() ? f : null
                        ))
                    }
                }))
                setReqLoading(false)
            }
        } catch (error) {
            setError(error.message)
            setReqLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        getTypes()
            .then((res) => {
                dispatch(setTypes({ types: res.data }))
                // setFormdatatypes(res.data)
                console.log(res);

            })
            .catch(err => {
                setError(err.message + '; please try to refresh the page')
                // setLoading(false)
            })
        if (!event || event._id !== eventId) {
            getEvent(eventId)
                .then((res) => {
                    console.log(res);
                    dispatch(setEvent({ event: res.data }))
                    if (user?._id !== res.data.owner) {
                        navigate(`/events/${eventId}`)
                        return;
                    }
                    // setEvent(res.data)

                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message + '; please try to refresh the page')
                    setLoading(false)
                })
        } else if (user?._id !== event.owner) {
            navigate(`/events/${eventId}`)
        } else {
            setLoading(false)
        }
    }, [])

    return loading ? (
        <ContentLoader />
    ) : (
        <div className=' h-full'>
            <div className=' sticky top-0 z-2 bg-[var(--main-color)]'>
                <div className=' p-3 flex place-items-center'>
                    <div className=' pr-3'>
                        <button
                            title='back'
                            className={` p-1 rounded-full hover:bg-black/30 ${!navigation.canGoBack ? 'cursor-not-allowed' : ''}`}
                            disabled={!navigation.canGoBack}
                            onClick={(e) => {
                                if (navigation.canGoBack) navigation.back()
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={navigation.canGoBack ? "#343434" : "#818181"}><path d="m376-412 201 202-97 96-366-366 366-366 98 96-202 202h470v136H376Z" /></svg>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#343434"><path d="M646-39 203-480l443-442 109 110-332 332 332 332L646-39Z"/></svg> */}
                        </button>
                    </div>
                    <div className=' text-xl font-semibold text-[#343434] h-full border-l-2 pl-3'>
                        {event._id}/registration-form
                    </div>
                </div>
                <hr />
            </div>
            {error && (
                <div className='p-2'>
                    <ErrorMSG message={error} />
                </div>
            )}
            <div className=' p-4 flex place-content-between gap-3 relative'>
                {!event.registrationform?._id ? (
                    <div className=' w-full min-w-70'>
                        <p>You have not added a registration form for this event({event.name}) yet</p>
                        <p className='text-sm text-red-600'>Important : Participants will not be able to register for this event without this registration form, so add as soon as possible</p>
                        <div className='text-center p-6 flex place-items-center place-content-center gap-8'>
                            <Button
                                disabled={reqLoading}
                                onClick={reqCreateForm}
                                className='flex place-items-center'
                            >
                                Add now {reqLoading && <LoadingRing />}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className=' w-full min-w-70'>
                        <Button
                            className=' mb-4'
                            onClick={() => {
                                setShowAddForm(true)
                            }}
                        >
                            <p className='flex'>
                                Add a new field
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fcfcfc"><path d="M427.33-426.67H170.67v-106h256.66V-791h106v258.33H790v106H533.33v256h-106v-256Z" /></svg>
                            </p>
                        </Button>
                        {showAddForm && (
                            <div className=' py-4 w-3/5 absolute left-1/5 top-[5%] z-1'>
                                <div className=' w-full p-8 py-2 text-white border-3 border-[var(--main-border-color)] bg-[var(--sec-color)] rounded-lg shadow-[0px_15px_35px_-5px_rgba(2,_0,_4,_0.5)]'>

                                    <div className='flex place-content-end'>
                                        <button
                                            className=' p-1 rounded-full hover:bg-red-600/20'
                                            onClick={() => {
                                                setShowAddForm(false)
                                                setError('')
                                                setCurrentField({ name: "", datatype: "String", tooltip: "", required: false, ifenumoptions: [] })
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="m250.67-177-73.34-73.67 229-229.33-229-228.67 73.34-74.66L480-554.67l229.33-228.66 73.34 74.66L554.33-480l228.34 229.33L709.33-177 480-405.67 250.67-177Z" /></svg>
                                        </button>
                                    </div>

                                    <div className='flex flex-col gap-4'>
                                        <Input
                                            bg='bg-[var(--main-color)]'
                                            borderColor='border-[var(--main-border-color)]'
                                            focusClasses=' focus:border-[var(--main-hover-border-color)]'
                                            hoverClasses=' hover:border-[var(--main-border-color)]/60'
                                            onInput={(e) => {
                                                setCurrentField(state => ({ ...state, name: e.target.value }))
                                            }}
                                            label='Name'
                                            placeholder='name of the field'
                                        />

                                        <Input
                                            bg='bg-[var(--main-color)]'
                                            borderColor='border-[var(--main-border-color)]'
                                            focusClasses=' focus:border-[var(--main-hover-border-color)]'
                                            hoverClasses=' hover:border-[var(--main-border-color)]/60'
                                            onInput={(e) => {
                                                setCurrentField(state => ({ ...state, tooltip: e.target.value }))
                                            }}
                                            label='Tooltip'
                                            placeholder='instruction about this field'
                                        />

                                        <Select
                                            bg='bg-[var(--main-color)]'
                                            borderColor='border-[var(--main-border-color)]'
                                            focusClasses=' focus:border-[var(--main-hover-border-color)]'
                                            hoverClasses=' hover:border-[var(--main-border-color)]/60'
                                            onChange={(e) => {
                                                if (e.target.value === "Boolean") {
                                                    setCurrentField(state => ({ ...state, ifenumoptions: ["Yes", "No"] }))
                                                }
                                                else {
                                                    setCurrentField(state => ({ ...state, ifenumoptions: [] }))
                                                }
                                                setCurrentField(state => ({ ...state, datatype: e.target.value }))
                                            }}
                                            value={currentField?.datatype}
                                            label='Type'
                                            options={formdatatypes.map((e) => (e.name))}
                                        />

                                        <div className=' w-full space-y-4'>
                                            <div className=' px-2 py-6 border-3 rounded-lg border-[var(--main-border-color)]'>
                                                <div className=' flex gap-1 place-items-center'>
                                                    <label htmlFor="isRequired">Is the field mandatory?</label>
                                                    <input
                                                        onInput={(e) => {
                                                            setCurrentField(state => ({ ...state, required: !state.required }))
                                                        }}
                                                        type="checkbox" name="isRequired" id="isRequired" />
                                                </div>
                                            </div>
                                        </div>

                                        {currentField?.datatype === "Enum" && (<div className=''>
                                            <p className=''>You need to provide options for enum type field</p>
                                            <div className=' flex gap-3 place-items-end'>
                                                <Input
                                                    bg='bg-[var(--main-color)]'
                                                    borderColor='border-[var(--main-border-color)]'
                                                    focusClasses=' focus:border-[var(--main-hover-border-color)]'
                                                    hoverClasses=' hover:border-[var(--main-border-color)]/60'
                                                    value={curOption}
                                                    onInput={(e) => {
                                                        setCurOption(e.target.value)
                                                    }}
                                                    label='Add options for this field'
                                                    placeholder='new option'
                                                />
                                                <Button
                                                    className='py-2.5'
                                                    onClick={() => {
                                                        if ((currentField?.ifenumoptions.some((val) => (val.trim() === curOption.trim())) || curOption.trim() === "")) {
                                                            setCurOption('')
                                                            return
                                                        }
                                                        else {
                                                            const option = curOption
                                                            setCurOption('')
                                                            setCurrentField((state) => ({ ...state, ifenumoptions: [...state.ifenumoptions, option] }))
                                                        }
                                                    }}
                                                >Add</Button>
                                            </div>
                                            <div>
                                                {currentField?.ifenumoptions.length ? (
                                                    <div className=' p-1 py-2 flex flex-wrap place-items-center gap-1'>
                                                        Options :
                                                        {currentField?.ifenumoptions.map(e => (
                                                            <div title={`option : ${e}`} className='flex gap-1 p-1 border-2 bg-[var(--main-color)] border-black/20 rounded-md'>
                                                                {e}
                                                                <button
                                                                    title={`Remove ${e}`}
                                                                    className=' p-0.5 rounded-full hover:bg-red-500/20 duration-200'
                                                                    onClick={() => {
                                                                        const newOptions = currentField?.ifenumoptions.filter(opt => (opt.trim() !== e.trim() ? opt : null))
                                                                        setCurrentField(state => ({ ...state, ifenumoptions: newOptions }))
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fc5a7a"><path d="m289-199-89-90 190-191-190-191 89-91 191 191 191-191 89 91-190 191 190 191-89 90-191-191-191 191Z" /></svg>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>)}





                                    </div>


                                    <div className='pt-4 text-center'>
                                        <Button
                                            disabled={reqLoading}
                                            onClick={() => {
                                                reqAddField()
                                            }}
                                        >
                                            Add field
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <hr />
                        <div>
                            <p className='py-2'>Your form has {event.registrationform?.fields?.length ? `${event.registrationform?.fields?.length === 1 ? '1 field currently' : `${event.registrationform?.fields?.length} fields currently`}` : 'no fields currently'}</p>
                            {event.registrationform?.fields?.length ? (
                                <div>
                                    <ul className=' min-[780px]:min-w-104 grid grid-cols-2 max-[780px]:grid-cols-1 gap-4 '>
                                        {event.registrationform.fields.map((field, i) => (
                                            <li key={field._id}>
                                                <div className=' p-2 h-full rounded-lg flex flex-col bg-[var(--accent-color)]/90 hover:bg-[var(--accent-color)]/85 border-3 border-white/20 hover:border-black/10 hover:scale-101 shadow-[2px_2px_6px_-1px_black] text-white'>
                                                    <h1>{`{field ${i + 1}}`}</h1>
                                                    <div>
                                                        <p>Field name : '{field.name}'</p>
                                                        <p>Datatype : '{field.datatype}'</p>
                                                        <p>Mandatory to fill? : {field.required ? 'Yes' : 'No'}</p>
                                                        {field.ifenumoptions?.length ? (
                                                            <div>
                                                                {/* <hr className='my-1' /> */}
                                                                <div className='flex flex-wrap place-items-center gap-2'>
                                                                    <p>Options :</p>
                                                                    {field.ifenumoptions.map(e => (
                                                                        <div className='flex gap-1 p-1 border-2 bg-white/40 border-black/20 rounded-md'>
                                                                            {e}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        <div className='pt-2 flex place-content-center'>
                                                            <Button
                                                                bgColor='bg-red-600/80'
                                                                hoverClasses=" hover:bg-red-600/95"
                                                                activeClasses=" active:bg-red-700/95 active:border-black/20"
                                                                disabled={reqLoading}
                                                                onClick={() => {
                                                                    reqDeleteField(field)
                                                                }}
                                                            >Remove</Button>
                                                        </div>
                                                    </div>
                                                    {/* <p className='text-center'>{`(${i + 1})`}</p> */}
                                                </div>
                                                {/* <div className=' p-2 rounded-lg flex bg-[var(--sec-hover-color)] border-3 border-white/30'>
                                                    <div className='w-full'>
                                                        <div className='flex'>
                                                            <p className='w-1/2'>Name : '{field.name}'</p>
                                                            <p>Datatype : '{field.datatype}'</p>
                                                        </div>
                                                        <hr className='my-1' />
                                                        <div>
                                                            <p>Tooltip : '{field.tooltip}'</p>
                                                            <hr className='my-1' />
                                                            <p>Is the field mandatory to fill : '{field.required ? 'Yes' : 'No'}'</p>

                                                            {field.ifenumoptions?.length ? (
                                                                <div>
                                                                    <hr className='my-1' />
                                                                    <div className='flex flex-wrap place-items-center gap-2'>
                                                                        <p>Options for the field :</p>
                                                                        {field.ifenumoptions.map(e => (
                                                                            <div className='flex gap-1 p-1 border-2 bg-black/40 border-white/30 rounded-md'>
                                                                                {e}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : null}


                                                        </div>
                                                    </div>
                                                    <div className='pl-4 flex place-items-center'>
                                                        <Button
                                                            bgColor='bg-red-600/80'
                                                            hoverClasses=" hover:bg-red-600/95"
                                                            activeClasses=" active:bg-red-700/95 active:border-black/20"
                                                            disabled={reqLoading}
                                                            onClick={() => {
                                                                reqDeleteField(field)
                                                            }}
                                                        >Remove</Button>
                                                    </div>
                                                </div> */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                <div className='w-[4px] bg-[var(--main-border-color)]'></div>

                <div className='w-1/2 min-w-73 text-center'>
                    <div className=''>
                        {
                            event.registrationform?._id && event.registrationform?.fields?.length ? ('Preview') : ('You will see the preview of the form here')
                        }
                    </div>
                    {/* <hr /> */}

                    {event.registrationform?._id && event.registrationform?.fields?.length ?
                        <div className=''>
                            <CustomForm disableAll={true} form={event.registrationform} />
                        </div>
                        : null}
                </div>
            </div>
        </div >
    )
}

export default CreateForm
