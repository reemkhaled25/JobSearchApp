import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const addCompany = Joi.object().keys({
    companyName: generalFields.companyName.required(),
    description: generalFields.description.required(),
    industry: generalFields.industry,
    address: generalFields.address,
    companyEmail: generalFields.email.required(),
    minNumberOfEmployee: generalFields.minNumberOfEmployee,
    maxNumberOfEmployee: generalFields.maxNumberOfEmployee,
    file: generalFields.file.required()
}).required()

export const updateCompany = Joi.object().keys({
    companyId: generalFields.id.required(),
    companyName: generalFields.companyName,
    description: generalFields.description,
    industry: generalFields.industry,
    address: generalFields.address,
    companyEmail: generalFields.email,
    minNumberOfEmployee: generalFields.minNumberOfEmployee,
    maxNumberOfEmployee: generalFields.maxNumberOfEmployee
}).required()

export const getCompanyByName = Joi.object().keys({
    companyName: generalFields.companyName.required(),
}).required()

export const updateCompanyLogo = Joi.object().keys({
    companyName: generalFields.companyName.required(),
    file: generalFields.file.required()
}).required()

export const addHRorDeleteHR = Joi.object().keys({
    companyName: generalFields.companyName.required(),
    HRId: generalFields.id.required(),
    action: Joi.string().valid('Add', 'Delete').required()
}).required()

export const deleteCompany = Joi.object().keys({
    companyId: generalFields.id.required(),
}).required()

export const getSpecificCompayWithRelatedJobs = Joi.object().keys({
    companyId: generalFields.id.required(),
}).required()
