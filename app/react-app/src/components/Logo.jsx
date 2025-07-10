import React from 'react'

function Logo({
    size = 48
}) {
    return (
        <div className=' bg-[var(--sec-color)] w-full flex place-content-center place-items-center box-border'>
            <div className={` h-${size/4} w-full text-blue-50 text-6xl font-bold font-mono text-center`}>LOGO</div>
        </div>
    )
}

export default Logo
