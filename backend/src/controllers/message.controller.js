import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler( async (req, res) => {
    console.log("message", req.params.id);
})

export {sendMessage}