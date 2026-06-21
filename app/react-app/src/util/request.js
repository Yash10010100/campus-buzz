import ServerError from "./ServerError"
import { getDateAndTimeFromMS } from "./time"

const request = async (
    method,
    headers,
    url,
    options,
) => {
    try {
        const res = await fetch(
            url,
            {
                method:method,
                headers: headers || {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                ...options
            }
        )

        const resJson = await res.json()
        
        if(!res.ok || res.status>=400){
                throw new Error(resJson.message)
            
        }

        return resJson
    } catch (error) {
        
            throw error
        
    }
}

export default request