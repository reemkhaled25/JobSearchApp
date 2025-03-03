import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const applyForJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id.required(),
    file: generalFields.file.required()

}).required()

export const getAllApplicationsForSpecificJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id.required(),
    size: generalFields.size,
    page: generalFields.page
}).required()

export const rejectOrAcceptApplication = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id.required(),
    applicationId: generalFields.id.required(),
    action: Joi.string().valid('accept', 'reject').required()
}).required()