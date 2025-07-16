const getDateAndTimeFromMS = (ms) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dateObject = new Date(ms)
    
    const date = `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()}`
    const time = `${dateObject.getHours()%12}:${dateObject.getMinutes()} ${dateObject.getHours()<12?'AM':'PM'}`
    const day = `${days[dateObject.getDay()]}`

    return {date, time, day}
}

export {
    getDateAndTimeFromMS,
}