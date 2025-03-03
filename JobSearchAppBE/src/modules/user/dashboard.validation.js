import Joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"

export const banORUnbanUser = Joi.object().keys({
    userId: generalFields.id.required(),
    action: generalFields.action.required()
}).required()

export const banORUnbanCompany = Joi.object().keys({
    companyName: generalFields.companyName.required(),
    action: generalFields.action.required()
}).required()

export const approveCompany = Joi.object().keys({
    companyName: generalFields.companyName.required(),
}).required()