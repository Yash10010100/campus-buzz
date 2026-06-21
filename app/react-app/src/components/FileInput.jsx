import React, { useId, useState } from 'react'
import { Button, LoadingRing } from './'
import { useDispatch, useSelector } from 'react-redux'
import { uploadFile } from '../features/students'
import { updateEventForm } from '../redux/eventSlice'

const FileInput = React.forwardRef(function FileInput(
    {
        field,
        disabled,
        bg = 'bg-transparent',
        label,
        type = "text",
        className = "",
        border = " border-3",
        borderColor = 'border-[var(--sec-color)]',
        focusClasses = " focus:border-[var(--sec-color)]/80 focus:border-double",
        hoverClasses = " hover:border-[var(--sec-color)]/60",
        ...props
    }, ref
) {
    const id = useId()
    const [enabled, setEnabled] = useState(!fileUrl)

    const [reqLoading, setReqLoading] = useState(false)

    const dispatch = useDispatch()

    const eventId = useSelector(state => state.event.data._id)
    const participationId = useSelector(state => state.event.data.participation._id)
    const fileUrl = useSelector(state => state.event.data.participation.registrationdetail.details[field.name])

    const fileSubmit = async (file, name) => {
        setReqLoading(true)
        try {
            console.log(name, " : ", file);

            const formdata = new FormData()

            formdata.append("name", name)

            formdata.append("file", file[0])

            const res = await uploadFile(eventId, participationId, formdata)

            if (res) {
                dispatch(updateEventForm(res.data))
                // updateState(res.data)
                setEnabled(false)
                setReqLoading(false)
            }
        } catch (error) {
            console.log(error);
            setEnabled(false)
            setReqLoading(false)
        }
    }

    return (
        <div className=' w-full flex flex-col items-start '>
            {label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{field.name || label}</label>}
            {fileUrl &&
                <div className=' w-full p-3 flex place-content-center gap-5'>
                    <div className=' flex flex-col text-center'>
                        <a href={fileUrl} target='_blank' rel='noreferrer'>
                            <img src={fileUrl} alt="" loading='lazy' width={400} className=' rounded-lg outline outline-offset-2 outline-[var(--sec-color)]/80' />
                        </a>
                        {`(file preview)`}
                    </div>
                    <div className=' flex flex-col place-content-between'>
                        <div className=' flex flex-col gap-2'>
                            <button
                                title={enabled ? 'cancel' : 're-upload'}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setEnabled(state => !state)
                                }}
                                className=' p-1 rounded-lg border border-[var(--sec-color)]'
                            >
                                {enabled ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
                                )}
                            </button>
                        </div>
                        {reqLoading && 
                            <LoadingRing />
                        }
                    </div>
                </div>
            }
            {fileUrl && enabled &&
                <div className=' p-2'>
                    Choose a new file to replace the current file
                </div>
            }
            <div style={(fileUrl && !enabled) ? { display: "none" } : {}} className=' w-full flex'>
                <input
                    disabled={disabled || !enabled}
                    type="file"
                    className={`px-3 py-2 rounded-lg ${bg} text-black outline-none duration-200 w-full ${border} ${borderColor} ${className} ${focusClasses} ${hoverClasses} `}
                    ref={ref}
                    id={id}
                    {...props}
                />
                <Button
                    type="button"
                    disabled={disabled || !ref.current.value || ref.current.value.length === 0 || reqLoading}
                    onClick={async (e) => {
                        e.preventDefault()
                        await fileSubmit(ref.current.value[0], field.name)
                    }}
                >
                    upload
                </Button>
            </div>
        </div>
    )
})

export default FileInput
