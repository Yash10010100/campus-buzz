import { CommonLayout, UpdateEventComp } from "../components"

function UpdateEvent() {
    return (
        <CommonLayout current={"events"}>
            <UpdateEventComp/>
        </CommonLayout>
    )
}

export default UpdateEvent