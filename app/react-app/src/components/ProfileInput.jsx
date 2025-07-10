import React, { useId } from 'react'

const ProfileInput = React.forwardRef(function ProfileInput(
    {
        label,
        disabled,
        type = "text",
        className = "",
        border=` border-2 ${disabled?'border-gray-200':'border-gray-600'}`,
        focusClasses = `${disabled?'':'focus:border-gray-600/80 focus:border-double'}`,
        hoverClasses = `${disabled?'':'hover:border-gray-600/60'}`,
        ...props
    }, ref
) {
    const id = useId()
    return (
        <div className=' w-full flex flex-col items-start'>
            {label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{label}</label>}
            <input
                type={type}
                disabled={disabled}
                className={` px-1 py-1 rounded-lg bg-[#fafafa] text-black outline-none duration-200 w-full ${border} ${className} ${focusClasses} ${hoverClasses} ${disabled?'text-gray-600':''}`}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    )
})

export default ProfileInput
