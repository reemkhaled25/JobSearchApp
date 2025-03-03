import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import * as DBService from '../../../DB/Services/DB.service.js'
import { companyModel } from "../../../DB/models/Company.model.js";
import { jobModel } from "../../../DB/models/Job.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { applicationModel } from "../../../DB/models/Application.model.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";
import { isHR, isOwner } from "../../company/company.authorization.js";
import { pagination } from "../../../utils/pagination/pagination.js";
import { statusTypes } from "../../../utils/common/common.enum.js";
import { emailEvent } from "../../../utils/Events/sendEmail.js";
import { getIo } from "../../socket/socket.controller.js";
import { socketConnections } from "../../../DB/models/User.model.js";

//create new application
export const applyForJob = asyncHandler(
    async (req, res, next) => {

        const { companyId, jobId } = req.params

        const company = await DBService.findOne({
            model: companyModel,
            filter: {
                _id: companyId,
                deleteAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            }
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        const job = await DBService.findOne({
            model: jobModel,
            filter: {
                _id: jobId,
                companyId,
                closed: false
            }, populate: [{
                path: 'addedBy'
            }]
        })

        if (!job) {
            return next(new Error('In-valid job id', { cause: 404 }))
        }

        const application = await DBService.findOne({
            model: applicationModel,
            filter: {
                jobId,
                userId: req.user._id
            }, populate: [{
                path: 'userId'
            }]
        })

        if (application) {
            return next(new Error('You applied for this job before'))
        }

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/company/${company.companyName}/job/${jobId}/applications/${req.user._id}` }
        )

        await DBService.create({
            model: applicationModel,
            data: {
                userCV: { public_id, secure_url },
                jobId,
                userId: req.user._id
            }
        })

        //sending notification to user how added job (company HR) with socket.io
        getIo().to(socketConnections.get(job.addedBy._id.toString())).emit('sendNotification', {

            message: `There is a new application for ${job.jobTitle}`,
            details: {
                applicationOwnerName: req.user.userName,
                applicationOwnerEmail: req.user.email,
            }
        })

        return successResponse({ res, status: 201, message: 'Your application is done, wait for response' })
    }
)

//Get All Applications For Specific Job
export const getAllApplicationsForSpecificJob = asyncHandler(
    async (req, res, next) => {

        const { companyId, jobId } = req.params

        const company = await DBService.findOne({
            model: companyModel,
            filter: {
                _id: companyId,
                deleteAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            }
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: company.companyName })
        const HR = await isHR({ HRId: req.user._id, companyId })

        if (!owner && !HR) {

            return next(new Error('You are not authorized to get this data', { cause: 403 }))
        }

        const job = await DBService.findOne({
            model: jobModel,
            filter: {
                _id: jobId,
                companyId,
            }
        })

        if (!job) {
            return next(new Error('In-valid job id', { cause: 404 }))
        }

        const applications = await pagination({
            model: applicationModel,
            filter: {
                jobId
            },
            ...req.query,
            populate: [{
                path: 'userId',
                select: 'userName email mobileNumber gender'
            }]
        })

        return successResponse({ res, data: { applications } })
    }
)

// Reject Or Accept an Application (only HR)
export const rejectOrAcceptApplication = asyncHandler(
    async (req, res, next) => {

        const { companyId, jobId, applicationId } = req.params
        const { action } = req.query

        const company = await DBService.findOne({
            model: companyModel,
            filter: {
                _id: companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            }
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        const job = await DBService.findOne({
            model: jobModel,
            filter: {
                _id: jobId,
                companyId,
            }
        })

        if (!job) {
            return next(new Error('In-valid job id', { cause: 404 }))
        }

        const application = await DBService.findOne({
            model: applicationModel,
            filter: {
                jobId
            },
            populate: [{
                path: 'userId'
            }]
        })

        if (!application) {
            return next(new Error('In-valid application id', { cause: 404 }))
        }

        const HR = await isHR({ HRId: req.user._id, companyId })

        if (!HR) {
            return next(new Error('You are not authorized to accept or reject an application', { cause: 403 }))
        }

        if (action === 'reject') {

            await DBService.findOneAndUpdate({
                model: applicationModel,
                filter: {
                    _id: applicationId,
                    jobId
                },
                data: {
                    status: statusTypes.rejected
                }
            })

            //to send rejection Email
            emailEvent.emit('sendRejectionEmail', {
                email: application.userId.email,
                applicationOwner: application.userId.userName,
                jobTitle: job.jobTitle,
                companyName: company.companyName,
                HRName: req.user.userName
            })

        } else if (action === 'accept') {

            await DBService.findOneAndUpdate({
                model: applicationModel,
                filter: {
                    _id: applicationId,
                    jobId
                },
                data: {
                    status: statusTypes.accepted
                }
            })

            //to send acceptance Email
            emailEvent.emit('sendAcceptanceEmail', {
                email: application.userId.email,
                applicationOwner: application.userId.userName,
                jobTitle: job.jobTitle,
                companyName: company.companyName,
                HRName: req.user.userName,
                companyEmail: company.companyEmail,
            })
        }

        return successResponse({ res, message: `Done, Your response is sent` })
    }
)