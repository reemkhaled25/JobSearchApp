import { companyModel } from '../../../DB/models/Company.model.js';
import { jobModel } from '../../../DB/models/Job.model.js';
import * as DBServices from '../../../DB/Services/DB.service.js'
import { pagination } from '../../../utils/pagination/pagination.js';
import { asyncHandler } from '../../../utils/Response/Error/error.handling.js'
import { successResponse } from '../../../utils/Response/Success/success.response.js';
import { isHR, isOwner } from '../../company/company.authorization.js';

export const addJob = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            }
        })


        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        if (!company.approvedByAdmin) {

            return next(new Error('Company should be approved by admin first', { cause: 400 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: company.companyName })
        const HR = await isHR({ HRId: req.user._id, companyId: req.params.companyId })

        if (!owner && !HR) {
            return next(new Error('You are not authorized to add job to this company', { cause: 403 }))
        }

        req.body.addedBy = req.user._id
        req.body.companyId = req.params.companyId

        const job = await DBServices.findOne({
            model: jobModel,
            filter: req.body
        })

        if (job) {
            return next(new Error('There is same job with these data in this company', { cause: 409 }))
        }

        await DBServices.create({
            model: jobModel,
            data: req.body
        })

        return successResponse({ res, status: 201, message: "Done, job is added" })
    }
)

export const updateJob = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }

        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        if (!company.approvedByAdmin) {

            return next(new Error('Company should be approved by admin first', { cause: 400 }))
        }

        const job = await DBServices.findOne({
            model: jobModel,
            filter: {
                _id: req.params.jobId,
                companyId: req.params.companyId
            }
        })

        if (!job) {
            return next(new Error('There is no job with this id', { cause: 404 }))
        }


        if (job.addedBy.toString() != req.user._id.toString()) {
            return next(new Error('You are not authorized to update this job', { cause: 403 }))
        }

        req.body.updatedBy = req.user._id
        await DBServices.findOneAndUpdate({
            model: jobModel,
            filter: {
                _id: req.params.jobId,
                addedBy: req.user._id
            },
            data: req.body
        })

        return successResponse({ res, message: 'Job is updated' })

    }
)

export const deleteJob = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        if (!company.approvedByAdmin) {

            return next(new Error('Company should be approved by admin first', { cause: 400 }))
        }

        const job = await DBServices.findOne({
            model: jobModel,
            filter: {
                _id: req.params.jobId,
                companyId: company._id
            }
        })

        if (!job) {
            return next(new Error('There is no job with this id', { cause: 404 }))
        }

        if (!company.HRs.includes(req.user._id)) {
            return next(new Error('You are not authorized to delete this job', { cause: 403 }))
        }

        await DBServices.findOneAndDelete({
            model: jobModel,
            filter: {
                _id: req.params.jobId,
                companyId: company._id
            }
        })

        return successResponse({ res, message: 'Job is deleted' })
    }
)

export const getAllOrSpecificJob = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            }
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        if (!req.query.jobId) {
            const data = await pagination({
                size: req.query.size,
                page: req.query.page,
                model: jobModel,
                filter: {
                    companyId: company._id
                }
            })


            return successResponse({ res, data })
        }

        const job = await DBServices.findOne({
            model: jobModel,
            filter: {
                _id: req.query.jobId,
                companyId: req.params.companyId
            }
        })

        if (!job) {
            return next(new Error('There is no job with that id', { cause: 404 }))
        }

        return successResponse({ res, data: { job } })
    }
)


