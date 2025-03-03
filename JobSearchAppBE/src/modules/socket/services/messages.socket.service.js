import { authentcation } from "../../../middleware/socket/auth.socket.middleware.js"
import * as DBService from '../../../DB/Services/DB.service.js'
import { chatModel } from "../../../DB/models/Chat.model.js"
import { socketConnections } from "../../../DB/models/User.model.js"
import { roleTypes } from "../../../utils/common/common.enum.js"

export const sendMessage = async ({ socket = {} } = {}) => {

    return socket.on('sendMessage', async (msgData) => {

        const { data, valid } = await authentcation({
            socket,
            Roles: [roleTypes.admin, roleTypes.user]
        })

        if (!valid) {
            return socket.emit('socket_Error', data)
        }
        
        const userId = data.user._id
        const { message, destId } = msgData

        let chat = await DBService.findOneAndUpdate({
            model: chatModel,
            filter: {
                $or: [
                    {
                        mainUser: userId,
                        subParticipant: destId
                    }, {
                        mainUser: destId,
                        subParticipant: userId
                    }
                ]
            },
            data: {
                $push: { messages: { message, senderId: userId } }
            },
            populate: [
                {
                    path: "mainUser",
                    select: 'userName profilePic'
                },
                {
                    path: "subParticipant",
                    select: 'userName profilePic'
                },
                {
                    path: "messages.senderId",
                    select: 'userName profilePic'
                },
            ]
        })

        if (!chat) {
            chat = await DBService.create({
                model: chatModel,
                data: {
                    mainUser: userId,
                    subParticipant: destId,
                    messages: { message, senderId: userId }
                }
            })
        }

        socket.emit('successMessage', { chat, message })
        
        socket.to(socketConnections.get(destId)).emit('receiveMessage', { chat, message })

        return 'Done'
    })
}