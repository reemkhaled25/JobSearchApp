import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import * as DBServices from '../../../DB/Services/DB.service.js'
import { userModel } from "../../../DB/models/User.model.js";
import { providerTypes } from "../../../utils/common/common.enum.js";
import { compareHash, createHash } from "../../../utils/Security/hashing.js";
import { generateAccessToken, generateRefreshToken, tokenDecoding } from "../../../utils/Security/token.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";
import { emailEvent } from "../../../utils/Events/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

export const login = asyncHandler(
    async (req, res, next) => {

        const { email, password } = req.body

        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                email,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            }
        })

        if (!user) {
            return next(new Error('In-valid login data', { cause: 404 }))
        }

        if (!user.isConfirmed) {
            return next(new Error('Confirm Email first', { cause: 400 }))
        }

        if (user.provider != providerTypes.system) {
            return next(new Error('In-valid provider', { cause: 400 }))
        }

        if (!compareHash({ plainText: password, hashedValue: user.password })) {
            return next(new Error('In-valid login data', { cause: 400 }))
        }

        const access_token = generateAccessToken({ user })
        const refresh_token = generateRefreshToken({ user })

        return successResponse({ res, data: { access_token, refresh_token } })
    }
)

export const loginWithGmail = asyncHandler(
    async (req, res, next) => {

        const { idToken } = req.body;
        const client = new OAuth2Client();

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();

            return payload;
        }

        const { name, email_verified, email } = await verify()

        if (!email_verified) {
            return next(new Error("In-valid account", { cause: 404 }))
        }

        let user = await DBServices.findOne({
            model: userModel,
            filter: { email }
        })

        if (user?.provider === providerTypes.system) {
            return next(new Error("In-valid provider", { cause: 409 }))
        }

        if (!user) {
            user = await DBServices.create({
                model: userModel,
                data: {
                    userName: name,
                    email,
                    isConfirmed: email_verified,
                    provider: providerTypes.google
                }
            })
        }

        const access_token = generateAccessToken({ user })
        const refresh_token = generateRefreshToken({ user })

        return successResponse({ res, data: { access_token, refresh_token } })
    }
)

export const forgetPassword = asyncHandler(
    async (req, res, next) => {

        const { email } = req.body

        if (!await DBServices.findOne({
            model: userModel,
            filter: {
                email,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            }

        })) {
            return next(new Error('In-valid Email', { cause: 404 }))
        }

        emailEvent.emit('forgetPassword', { email })

        return successResponse({ res, message: 'Verification Code is sent' })
    }
)

export const resetPassword = asyncHandler(
    async (req, res, next) => {

        const { email, newPassword } = req.body

        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                email,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                isConfirmed: true
            }
        })

        if (!user) {

            return next(new Error('In-valid data', { cause: 404 }))
        }

        if (compareHash({ plainText: newPassword, hashedValue: user.password })) {

            return next(new Error('In-valid new password', { cause: 409 }))
        }

        if (user.OTP.length) {
            return next(new Error('Verify Code first', { cause: 400 }))
        }

        await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                email,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                isConfirmed: true
            },
            data: {
                password: createHash({ plainText: newPassword }),
                changeCredentialTime: Date.now()
            }
        })

        return successResponse({ res })
    }
)

export const refreshToken = asyncHandler(
    async (req, res, next) => {

        const user = await tokenDecoding({
            authorization: req.headers.authorization,
            next,
            tokenType: 'refresh'

        })

        const access_token = generateAccessToken({ user })
        const refresh_token = generateRefreshToken({ user })

        return successResponse({ res, data: { access_token, refresh_token } })
    }
)