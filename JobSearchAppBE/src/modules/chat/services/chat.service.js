import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import * as DBService from '../../../DB/Services/DB.service.js'
import { chatModel } from "../../../DB/models/Chat.model.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";

export const getChat = asyncHandler(
    async (req, res, next) => {

        const { friendId } = req.params

        const chat = await DBService.findOne({
            model: chatModel,
            filter: {
                $or: [
                    {
                        mainUser: req.user._id,
                        subParticipant: friendId
                    }, {
                        mainUser: friendId,
                        subParticipant: req.user._id
                    }
                ]
            },
            populate:[
                {
                    path:"mainUser",
                    select:'userName profilePic'
                },
                {
                    path:"subParticipant",
                    select:'userName profilePic'
                },
                {
                    path:"messages.senderId",
                    select:'userName profilePic'
                },
            ]
        })

        return successResponse({ res, data: { chat } })
    }
)