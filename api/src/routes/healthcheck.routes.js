import { Router } from "express";

import { healthcheck } from "../controllers/healthcheck.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router()

router.route("/").get(healthcheck)

router.route("/test").get(

    (req,res,next)=>{
        console.log("Test");
        console.log(next());
        res.append("Test", "Test");
    },
    asyncHandler(async (req, res) => {
        res
            .status(200)
            .send({
                message: "Test has been completed",
                test: "Test"
            })
    })
)

export default router