import jwt from 'jsonwebtoken';
import * as DBServices from '../../DB/Services/DB.service.js'
import { userModel } from '../../DB/models/User.model.js';
import { roleTypes } from '../common/common.enum.js';

//Generate new token
export const generateToken = ({ payload = {}, signature = process.env.USER_ACCESS_SIGNATURE, options = {} } = {}) => {
    const token = jwt.sign(payload, signature, options)
    return token
}

//Verify token
export const decodeToken = ({ token = '', signature = process.env.USER_ACCESS_SIGNATURE } = {}) => {

    const decode = jwt.verify(token, signature)
    return decode
}

//verify bearer token
export const tokenDecoding = async ({ authorization = '', next = {}, tokenType = 'access' } = {}) => {

    const [bearer, token] = authorization?.split(' ') || []

    if (!bearer || !token) {
        return next(new Error('In-valid authorization', { cause: 400 }))
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
        return next(new Error('In-valid token payload', { cause: 400 }))
    }

    const user = await DBServices.findOne({
        model: userModel,
        filter: {
            _id: decode.id,
            deletedAt: { $exists: false }
        }
    })

    if (!user) {
        return next(new Error('In-valid authorization', { cause: 404 }))
    }

    if (user.changeCredentialTime?.getTime() > decode.iat * 1000) {

        return next(new Error("In-valid credentials", { cause: 403 }))
    }

    return user
}

//Generate Access tokens
export const generateAccessToken =  ({ user = {} } = {}) => {

    const access_token = generateToken({
        payload: { id: user._id },
        signature: user.role === roleTypes.admin ? process.env.ADMIN_ACCESS_SIGNATURE : process.env.USER_ACCESS_SIGNATURE,
        options: { expiresIn: '1h' }
    })

    return access_token
}

//Generate Refresh tokens
export const generateRefreshToken = ({ user = {} } = {}) => {

    const refresh_token = generateToken({
        payload: { id: user._id },
        signature: user.role === roleTypes.admin ? process.env.ADMIN_REFRESH_SIGNATURE : process.env.USER_REFRESH_SIGNATURE,
        options: { expiresIn: '7d' }
    })

    return refresh_token
}