import { Server } from 'socket.io';
import { logOutSocket, registerSocket } from './services/auth.socket.service.js';
import { sendMessage } from './services/messages.socket.service.js';

let io = undefined

export const runIo = (httpServer) => {

    io = new Server(httpServer, {
        cors: '*'
    })

    return io.on('connection', async (socket) => {

        await registerSocket({ socket })
        await sendMessage({ socket })
        await logOutSocket({ socket })
    })
}

export const getIo = () => {

    return io
}