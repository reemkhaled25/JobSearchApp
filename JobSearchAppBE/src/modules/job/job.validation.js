import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const addJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobTitle: generalFields.jobTitle.required(),
    jobLocation: generalFields.jobLocation.required(),
    jobDescription: generalFields.description,
    workingTime: generalFields.workingTime.required(),
    seniorityLevel: generalFields.seniorityLevel.required(),
    technicalSkills: generalFields.technicalSkills.required(),
    softSkills: generalFields.softSkills.required(),
}).required()

export const updateJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id.required(),
    jobTitle: generalFields.jobTitle,
    jobLocation: generalFields.jobLocation,
    jobDescription: generalFields.description,
    workingTime: generalFields.workingTime,
    seniorityLevel: generalFields.seniorityLevel,
    technicalSkills: generalFields.technicalSkills,
    softSkills: generalFields.softSkills,
    closed: generalFields.closed,
}).required()

export const deleteJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id.required(),
}).required()

export const getAllOrSpecificJob = Joi.object().keys({
    companyId: generalFields.id.required(),
    jobId: generalFields.id,
    size: generalFields.size,
    page: generalFields.page
}).required()