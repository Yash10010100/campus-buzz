import React, { useId, useState } from 'react'

const Input = React.forwardRef(function Input(
    {
        fileUrl,
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
    return (
        <div className=' w-full flex flex-col items-start '>
            {label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{label}</label>}
            {fileUrl &&
                <div className=' w-full p-3 flex place-content-center gap-5'>
                    <div className=' flex flex-col text-center'>
                        {/* <Image src={fileUrl} /> */}
                        <a href={fileUrl} target='_blank' rel='noreferrer'><img src={fileUrl} alt="" loading='lazy' width={400} className=' rounded-lg outline outline-offset-2 outline-[var(--sec-color)]/80' /></a>
                        (preview)
                    </div>
                    <div className=' flex flex-col place-content-start'>

                        <button
                        title={enabled?'cancel':'re-upload'}
                        onClick={(e)=>{
                            e.preventDefault()
                            setEnabled(state => !state)
                        }}
                        className=' p-1 rounded-lg border border-[var(--sec-color)]'
                        >
                            {enabled ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            }
            {fileUrl && enabled && 
                <div className=' p-2'>
                    Choose a new file to replace the current file
                </div>
            }
            <input
                disabled={disabled || !enabled}
                type={type}
                className={`px-3 py-2 rounded-lg ${bg} text-black outline-none duration-200 w-full ${border} ${borderColor} ${className} ${focusClasses} ${hoverClasses} `}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    )
})

export default Input