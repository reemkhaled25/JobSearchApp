import mongoose, { model, Schema, Types } from "mongoose";

//model to handle friend requests

const friendRequestSchema = new Schema({

    recieverId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }

})

export const friendRequestModel = mongoose.models.FriendRequest || model('FriendRequest', friendRequestSchema)