import { userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";
import * as DBServices from '../../../DB/Services/DB.service.js'
import { emailEvent } from "../../../utils/Events/sendEmail.js";
import { compareHash } from "../../../utils/Security/hashing.js";
import { otpTypes } from "../../../utils/common/common.enum.js";

export const signup = asyncHandler(
    async (req, res, next) => {

        const { email } = req.body

        if (await DBServices.findOne({ model: userModel, filter: { email } })) {
            return next(new Error('Email Exists', { cause: 409 }))
        }

        const user = new userModel(req.body)
        await user.save()

        emailEvent.emit('sendConfirmEmail', { email })

        return successResponse({ res, status: 201, message: 'Confirmation Code is sent, Please confirm your email' })
    }
)

export const confirmOTP = asyncHandler(
    async (req, res, next) => {

        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                email: req.body.email,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            }
        })

        if (!user || !user?.OTP?.length) {
            return next(new Error('In-valid Email', { cause: 404 }))
        }

        for (const element of user.OTP) {

            if (Date.now() > element.expiresIn.getTime()) {
                return next(new Error('Expired code', { cause: 400 }))
            }

            if (element.type === otpTypes.confirmEmail && user.isConfirmed) {

                return next(new Error('Email already confirmed', { cause: 409 }))

            } else if (element.type === otpTypes.confirmEmail && !user.isConfirmed) {

                if (!compareHash({ plainText: req.body.OTP, hashedValue: element.code })) {

                    return next(new Error('In-valid Code', { cause: 400 }))

                } else {

                    await DBServices.findOneAndUpdate({
                        model: userModel,
                        filter: { email: req.body.email },
                        data: {
                            isConfirmed: true,
                            $unset: { OTP: 0 }
                        }
                    })

                    return successResponse({ res, message: 'Email confirmed Successfully' })
                }

            } else if (element.type === otpTypes.forgetPassword) {

                if (!compareHash({ plainText: req.body.OTP, hashedValue: element.code })) {

                    return next(new Error('In-valid Code', { cause: 400 }))
                } else {

                    await DBServices.findOneAndUpdate({
                        model: userModel,
                        filter: { email: req.body.email },
                        data: {
                            $unset: { OTP: 0 }
                        }
                    })

                    return successResponse({ res, message: 'Code Verified Successfully' })
                }
            }
        }
    }
)

