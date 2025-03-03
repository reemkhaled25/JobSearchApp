
import { userModel } from '../../DB/models/User.model.js';
import * as DBServices from '../../DB/Services/DB.service.js'
import { decodeToken } from '../../utils/Security/token.js';

//authentcation and authorization for socket.io
export const authentcation = async ({
    socket = {},
    tokenType = 'access',
    Roles = [],
} = {}) => {
  
    const [bearer, token] = socket?.handshake?.auth?.authorization?.split(' ') || []

    if (!bearer || !token) {
        return { data: { message: 'In-valid authorization', status: 400 } }
    }

    let access_signature = undefined
    let refresh_signature = undefined

    switch (bearer) {
        case 'Bearer':
            access_signature = process.env.USER_ACCESS_SIGNATURE
            refresh_signature = process.env.USER_REFRESH_SIGNATURE
            break;
        case 'System':
            access_signature = process.env.ADMIN_ACCESS_SIGNATURE
            refresh_signature = process.env.ADMIN_REFRESH_SIGNATURE
            break;

        default:
            break;
    }

    const decode = decodeToken(
        {
            token,
            signature: tokenType === 'access' ? access_signature : refresh_signature
        }
    )

    if (!decode?.id) {
        return { data: { message: 'In-valid token payload', status: 401 } }
    }

    const user = await DBServices.findOne({
        model: userModel,
        filter: {
            _id: decode.id,
            deletedAt: { $exists: false }
        }
    })

    if (!user) {
        return { data: { message: 'In-valid authorization', status: 404 } }
    }

    if (user.changeCredentialTime?.getTime() > decode.iat * 1000) {
        return { data: { message: "In-valid credentials", status: 400 } }
    }

    if (!Roles.includes(user.role)) {
        return { data: { message: 'Not authorized', status: 403 } }
    }

    return { data: { message: 'Done', user }, valid: true }
}
