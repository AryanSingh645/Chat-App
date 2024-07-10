import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUsersForSideBar = asyncHandler( async (req, res) => {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
        _id : {
            $ne: loggedInUserId
        }
    }).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        filteredUsers,
        "All Users Fetched Successfully"
    ))
})

export {
    getUsersForSideBar
}