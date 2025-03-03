import { socketConnections } from "../../../DB/models/User.model.js";
import { authentcation } from "../../../middleware/socket/auth.socket.middleware.js";
import { roleTypes } from "../../../utils/common/common.enum.js";

export const registerSocket = async ({ socket = {} } = {}) => {

    try {
        
        const { data, valid } = await authentcation({
            socket,
            Roles: [roleTypes.admin, roleTypes.user]
        })

        if (!valid) {
            return socket.emit('socket_Error', data)
        }

        socketConnections.set(data?.user._id.toString(), socket.id)

        return 'Done'

    } catch (error) {

        return { data: { message: error.message } }
    }
}

export const logOutSocket = async ({ socket = {} } = {}) => {

    return socket.on('disconnect', async () => {

        try {
            const { data, valid } = await authentcation({
                socket,
                Roles: [roleTypes.admin, roleTypes.user]
            })

            if (!valid) {
                return socket.emit('socket_Error', data)
            }

            socketConnections.delete(data?.user._id.toString())

            return 'Done'

        } catch (error) {
            return { data: { message: error.message } }
        }
    })
}

