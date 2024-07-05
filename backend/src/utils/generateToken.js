import jwt from "jsonwebtoken"
import { ApiError } from "./ApiError.js"

const generateAccessToken = function(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = function(user){
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const generateAccessAndRefreshToken = (user) => {
    try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong when generating access token and refresh token");
    }
}

export {generateAccessAndRefreshToken}