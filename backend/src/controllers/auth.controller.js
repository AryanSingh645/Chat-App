import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { generateAccessAndRefreshToken } from '../utils/generateToken.js';


const options = {
    httpOnly: true,
    secure: true
}
const signupUser = asyncHandler( async (req, res) => {
    
    const {fullName, email, username, password, confirmPassword, gender} = req.body;
    if([fullName, email, username, password, confirmPassword, gender].some((field) => (field?.trim() === ""))){
        throw new ApiError(400, "All fields are required");
    }

    if(password != confirmPassword) {
        throw new ApiError(400, "Passwords don not match");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if(existingUser){
        throw new ApiError(400, "User already exists");
    }

    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file not found");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }
    console.log(avatar);



    const user = new User(
        {
            fullName,
            username: username.toLowerCase(),
            email,
            password,
            gender,
            avatar: avatar.url
        }
    )

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(user); 
    await user.save();

    console.log("refreshToken",refreshToken);

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accesToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        createdUser,
        "User created successfully"
    ))
})

const loginUser = asyncHandler( async (req, res) => {
    const {username, email, password} = req.body;

    if(!(username || email)){
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, "Password is not correct");
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(user);
    await user.save();

    console.log(accessToken, "\n", refreshToken);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
    ))
})

export {
    signupUser,
    loginUser
}