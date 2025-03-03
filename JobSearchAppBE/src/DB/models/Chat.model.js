import mongoose, { model, Schema, Types } from "mongoose";
import { roleTypes } from "../../utils/common/common.enum.js";

const chatSchema = new Schema({

    mainUser: {
        type: Types.ObjectId,
        ref: roleTypes.user
    },

    subParticipant: {
        type: Types.ObjectId,
        ref: roleTypes.user
    },

    messages: [{
        message: {
            type: String,
            minlength: 1,
            maxlength: 50000,
            required: true
        },
        senderId: { type: Types.ObjectId, ref: roleTypes.user }
    }]
    
}, { timestamps: true })

export const chatModel = mongoose.models.Chat || model('Chat', chatSchema)