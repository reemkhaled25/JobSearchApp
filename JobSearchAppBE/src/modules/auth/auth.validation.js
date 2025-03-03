import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const signup = Joi.object().keys({
    userName: generalFields.userName.required(),
    mobileNumber: generalFields.mobileNumber.required(),
    gender: generalFields.gender,
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.valid(Joi.ref('password')).required(),
    DOB: generalFields.DOB,
}).required()

export const ConfirmOTP = Joi.object().keys({
    email: generalFields.email.required(),
    OTP: generalFields.otp.required()
}).required()

export const login = Joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()
}).required()

export const forgetPassword = Joi.object().keys({
    email: generalFields.email.required()
}).required()

export const resetPassword=Joi.object().keys({
    email: generalFields.email.required(),
    newPassword: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.valid(Joi.ref('newPassword')).required(),
}).required()