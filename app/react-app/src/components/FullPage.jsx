import React from 'react'

function FullPage({
    children
}) {
    return (
        <div className=' w-screen h-screen bg-[var(--main-color)] overflow-auto'>
            <>{children}</>
        </div>
    )
}

export default FullPage
