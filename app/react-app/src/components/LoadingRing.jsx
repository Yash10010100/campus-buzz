import React from 'react'

function LoadingRing() {
    return (
        <div className=''>
            {/* <svg className='lrsvg' viewBox="25 25 50 50">
                <circle className='lrcircle' r="20" cy="50" cx="50"></circle>
            </svg> */}
            <svg className='lrsvg' viewBox="0 0 50 50">
                <circle stroke='#343434' className='lrcircle' r="15" cy="25" cx="25"></circle>
            </svg>
        </div>
    )
}

export default LoadingRing
