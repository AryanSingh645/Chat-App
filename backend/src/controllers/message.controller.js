import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";

const sendMessage = asyncHandler( async (req, res) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
        participants: {
            $all : [senderId, receiverId]
        }
    })

    if(!conversation){
        conversation = new Conversation({
            participants: [senderId, receiverId]
        })
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        message
    })

    if(newMessage){
        conversation.messages.push(newMessage._id)
    }
    
    await Promise.all([conversation.save(), newMessage.save()]);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        newMessage,
        "Message sent successfully"
    ))
})

const getMessage = asyncHandler( async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
        participants: {
            $all: [senderId, userToChatId]
        }
    }).populate("messages")
    
    if(!conversation){
        throw new ApiError(400, [], "No conversation");
    }

    console.log(conversation);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        conversation.messages,
        "Message Fetched Successfully"
    ))
})

export {
    sendMessage,
    getMessage
}