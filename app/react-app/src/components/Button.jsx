import React, { useId } from 'react'

const Button = React.forwardRef(function Button(
    {
        children,
        type = "button",
        // bgColor = "bg-[#3a3845ef]",
        // border = " border-3 ",
        // borderColor = " border-[#3a3845]",
        // activeClasses = " active:border-[#3a384584] active:bg-[#3a3845]",
        // hoverClasses = " hover:bg-[#3a3845e0]",
        textColor = "text-gray-50",
        bgColor = "bg-[var(--accent-color)]/90",
        border = " border-3",
        borderColor = " border-white/20",
        hoverClasses = " hover:bg-[var(--accent-color)]/95",
        activeClasses = " active:bg-[var(--accent-color)]/95 active:border-black/20",
        className = "px-4 py-2",
        ...props
    }, ref
) {

    const id = useId()

    return (
        <button ref={ref} id={id} className={` rounded-lg duration-100 ${bgColor} ${border} ${borderColor} ${textColor} ${className} ${activeClasses} ${hoverClasses}`} {...props}>
            {children}
        </button>
    )
})

export default Button
