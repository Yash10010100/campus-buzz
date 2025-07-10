import React, { useId } from 'react'

function Select({
    options,
    label,
    className,
    border=" border-3  border-[var(--sec-color)]",
    focusClasses=' focus:border-[var(--sec-color)]/80 focus:border-double',
    hoverClasses=' hover:border-[var(--sec-color)]/60',
    ...props
},ref) {
    const id=useId()
    return (
        <div className='w-full flex flex-col items-start'>
            {label && <label htmlFor={id} className='inline-block mb-1 pl-1'>{label}</label>}
            <select
            {...props}
            id={id}
            ref={ref}
            className={` text-lg px-3 py-2 rounded-lg bg-transparent text-black outline-none duration-200 ${border} w-full ${className} ${focusClasses} ${hoverClasses}`}
            >
                {options?.map((option)=>(
                    <option key={option} value={option} className=''>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)
