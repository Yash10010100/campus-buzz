import { CommonLayout ,Event } from "../components"

function EventPage() {
    return (
        <CommonLayout current="events">
            <Event />
        </CommonLayout>
    )
}

export default EventPage
