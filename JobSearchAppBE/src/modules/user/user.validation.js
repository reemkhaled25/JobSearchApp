import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateProfileBasics = Joi.object().keys({
    mobileNumber: generalFields.mobileNumber,
    DOB: generalFields.DOB,
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    gender: generalFields.gender
}).required()

export const getUserProfile = Joi.object().keys({
    profileId: generalFields.id.required()
}).required()

export const updataPassword = Joi.object().keys({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.not(Joi.ref('oldPassword')).required(),
    confirmationPassword: generalFields.confirmationPassword.valid(Joi.ref('newPassword')).required()
}).required()

export const updateProfileImage = Joi.object().keys({
    file: generalFields.file.required()
}).required()

export const dashboard = Joi.object().keys({
    authorization: Joi.string().required(),
    size: Joi.number(),
    page: Joi.number(),
}).required()

export const sendFriendRequest = Joi.object().keys({
    recieverId: generalFields.id.required()
}).required()

export const acceptFriendRequest = Joi.object().keys({
    requestId: generalFields.id.required()
}).required()
