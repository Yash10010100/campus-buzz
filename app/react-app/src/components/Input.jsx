import React, { useId } from 'react'

const Input = React.forwardRef(function Input(
    {
        label,
        type = "text",
        className = "",
        border=" border-3  border-[var(--sec-color)]",
        focusClasses = " focus:border-[var(--sec-color)]/80 focus:border-double",
        hoverClasses = " hover:border-[var(--sec-color)]/60",
        ...props
    }, ref
) {
    const id = useId()
    return (
        <div className=' min-w-100 w-full flex flex-col items-start'>
            {label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{label}</label>}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-transparent text-black outline-none duration-200 w-full ${border} ${className} ${focusClasses} ${hoverClasses} `}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    )
})

export default Input