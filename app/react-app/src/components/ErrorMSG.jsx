import React from 'react'

function ErrorMSG({
    message="Something went wrong"
}) {
    return (
        <div className=' text-white rounded-lg px-3 py-2 bg-red-900/80 border-2 border-red-900'>{message}</div>
    )
}

export default ErrorMSG
