import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PageLoader } from './'

function AuthContainer({
    children,
    authentication = true,
    usertype = ""
}) {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const status = useSelector((state) => (state.auth.status))
    const userdata = useSelector((state) => (state.auth.user))

    useEffect(() => {
            if (authentication && status !== authentication) {
                navigate("/")
            }
            else if (!authentication && status !== authentication) {
                navigate("/user")
            }
            else if (usertype && userdata?.usertype !== usertype) {
                console.log(usertype);
                console.log(userdata);

                navigate("/user")
            }
            setLoading(false)
    }, [status, userdata])

    return loading ? (
        <PageLoader />
    ) : (<>{children}</>)
}

export default AuthContainer
