import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    throw new ApiError(400, "Health check failed")
    return res.status(200).json(new ApiResponse(200, "OK", "Health check passed"))
})

export { healthcheck }