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
        borderHoverClasses = " hover:border-white/20",
        borderActiveClasses = " active:border-black/20",
        hoverClasses = " hover:bg-[var(--accent-color)]/95",
        activeClasses = " active:bg-[var(--accent-color)]/95",
        className = "",
        ...props
    }, ref
) {

    const id = useId()

    return (
        <button ref={ref} id={id} className={`px-4 py-2 rounded-lg duration-100 ${textColor} ${className} ${activeClasses} ${hoverClasses} ${borderActiveClasses} ${borderHoverClasses} ${bgColor} ${border} ${borderColor}`} {...props}>
            {children}
        </button>
    )
})

export default Button
