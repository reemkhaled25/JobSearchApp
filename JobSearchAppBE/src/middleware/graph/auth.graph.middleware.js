import { decodeToken } from "../../utils/Security/token.js"
import * as DBServices from '../../DB/Services/DB.service.js'
import { userModel } from "../../DB/models/User.model.js"

//authentecation and authorization to graphql
export const authentcation = async ({
    authorization = '',
    tokenType = 'access',
    Roles = [],
} = {}) => {

    const [bearer, token] = authorization?.split(' ') || []

    if (!bearer || !token) {
        throw new Error('In-valid authorization')
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
        throw new Error('In-valid token payload')
    }

    const user = await DBServices.findOne({
        model: userModel,
        filter: {
            _id: decode.id,
            deletedAt: { $exists: false }
        }
    })

    if (!user) {
        throw new Error('In-valid authorization')
    }

    if (user.changeCredentialTime?.getTime() > decode.iat * 1000) {
        throw new Error("In-valid credentials")
    }

    if(!Roles.includes(user.role)){
        throw new Error('Not authorized')
    }

    return user
}
