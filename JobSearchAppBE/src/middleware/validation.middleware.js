import joi from "joi";
import { asyncHandler } from "../utils/Response/Error/error.handling.js";
import { Types } from "mongoose";
import { genderTypes, jobLocationTypes, seniorityLevel, workingTime } from "../utils/common/common.enum.js";

//validating ids
export const validationObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid ObjectId')
}

//validating DOB to be greater than now and age more than 18
export const validateDOB = (value, helper) => {

    const currentDate = new Date()

    if (value >= currentDate || (currentDate.getFullYear() - value.getFullYear()) < 18) {
        return helper.message(`Entered date is not a valid date of birth. It must be in the future and age of greater than 18`)
    } else {
        return true
    }
}

//validate file object of multer
export const fileObj = {
    fieldname: joi.string().valid('attachments'),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    finalPath: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
    size: joi.number()
}

//general used fields
export const generalFields = {

    //params field
    action: joi.string().valid('Ban', 'Unban'),
    size: joi.number().integer().positive(),
    page: joi.number().integer().positive(),

    //user field
    userName: joi.string().trim().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,20}$/)),
    firstName: joi.string().trim().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,10}$/)),
    lastName: joi.string().trim().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,10}$/)),
    mobileNumber: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    gender: joi.string().valid(genderTypes.male, genderTypes.female),
    email: joi.string().pattern(new RegExp(/^[a-zA-Z]{1,}\d{0,}[a-zA-Z0-9]{1,}[@][a-z]{1,}(\.com|\.edu|\.net){1,3}$/)),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmationPassword: joi.string(),
    DOB: joi.date().custom(validateDOB),

    //common fields
    id: joi.string().custom(validationObjectId),
    otp: joi.string().length(4).pattern(new RegExp(/^\d{4}$/)),
    file: joi.object().keys(fileObj),

    //company fields
    companyName: joi.string().trim().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,30}$/)),
    description: joi.string().trim().min(2).max(50000),
    industry: joi.string().trim(),
    address: joi.string().trim(),
    minNumberOfEmployee: joi.number().min(2),
    maxNumberOfEmployee: joi.number().min(joi.ref('minNumberOfEmployee')),

    //job fields
    jobTitle: joi.string().trim().pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,30}$/)),
    jobLocation: joi.string().valid(jobLocationTypes.hybrid, jobLocationTypes.onsite, jobLocationTypes.remotely),
    workingTime: joi.string().valid(workingTime.fullTime, workingTime.partTime),
    seniorityLevel: joi.string().valid(seniorityLevel.CTO, seniorityLevel.fresh, seniorityLevel.junior, seniorityLevel.midLevel, seniorityLevel.senior, seniorityLevel.teamLead),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    closed: joi.boolean()
}

export const validation = (schema) => {

    return asyncHandler(async (req, res, next) => {

        const inputData = { ...req.body, ...req.query, ...req.params }

        if (req.file || req.files?.length) {
            inputData.file = req.file || req.files
        }

        const validationResults = schema.validate(inputData, { abortEarly: false })

        if (validationResults?.error?.details.length) {

            return res.status(400).json({ message: 'Validation Error', error: validationResults.error.details })
        }

        return next()
    })
}