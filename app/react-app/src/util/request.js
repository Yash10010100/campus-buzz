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
        .then((response)=>(response.json()))

        if(res){
            if(!Boolean(res.success) && Number(res.statusCode)>=400){
                console.log(res);
                throw new Error(res.message)
            }
        }

        return res
    } catch (error) {
        if(error.message === "Failed to fetch"){
            // throw new Error("Server is down")
            throw error
        }
        else{
            throw error
        }
    }
}

export default request