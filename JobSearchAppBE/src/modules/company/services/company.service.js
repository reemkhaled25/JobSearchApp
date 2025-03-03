import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import * as DBServices from '../../../DB/Services/DB.service.js'
import { companyModel } from "../../../DB/models/Company.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";
import { isOwner } from "../company.authorization.js";
import { roleTypes } from "../../../utils/common/common.enum.js";


export const addCompany = asyncHandler(
    async (req, res, next) => {

        if (
            req.body.minNumberOfEmployee && !req.body.maxNumberOfEmployee
            ||
            !req.body.minNumberOfEmployee && req.body.maxNumberOfEmployee

        ) {
            return next(new Error('Min number of employees and Max number of employees should be provided', { cause: 400 }))

        } else if (req.body.minNumberOfEmployee && req.body.maxNumberOfEmployee) {

            let numberOfEmployees = {}

            numberOfEmployees.minNumberOfEmployee = Number(req.body.minNumberOfEmployee)
            numberOfEmployees.maxNumberOfEmployee = Number(req.body.maxNumberOfEmployee)

            delete req.body.minNumberOfEmployee;
            delete req.body.maxNumberOfEmployee;

            req.body.numberOfEmployees = numberOfEmployees
        }

        let company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyEmail: req.body.companyEmail,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (company) {
            return next(new Error('Company Exists', { cause: 409 }))
        }

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/Company/${req.body.companyName}/legalAttachment` }
        )

        req.body.legalAttachment = { public_id, secure_url }
        req.body.CreatedBy = req.user._id

        company = await DBServices.create({
            model: companyModel,
            data: req.body
        })

        return successResponse({ res, status: 201, message: 'Company successfully created' })
    }
)

export const UpdateCompany = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: company.companyName })

        if (!owner && req.user.role != roleTypes.admin) {

            return next(new Error('You are not authorized to update these data', { cause: 403 }))
        }

        let filter = {}

        if (req.body.companyName) {

            filter = {
                companyName: req.body.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }

        } else if (req.body.companyEmail) {

            filter = {
                companyEmail: req.body.companyEmail,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        }

        if (filter) {

            if (! await DBServices.findOne({
                model: companyModel,
                filter
            })) {
                return next(new Error('Company Exists', { cause: 409 }))
            }
        }

        if (
            req.body.minNumberOfEmployee && !req.body.maxNumberOfEmployee
            ||
            !req.body.minNumberOfEmployee && req.body.maxNumberOfEmployee

        ) {
            return next(new Error('Min number of employees and Max number of employees should be provided', { cause: 400 }))

        } else if (req.body.minNumberOfEmployee && req.body.maxNumberOfEmployee) {

            let numberOfEmployees = {}

            numberOfEmployees.minNumberOfEmployee = Number(req.body.minNumberOfEmployee)
            numberOfEmployees.maxNumberOfEmployee = Number(req.body.maxNumberOfEmployee)

            delete req.body.minNumberOfEmployee;
            delete req.body.maxNumberOfEmployee;

            req.body.numberOfEmployees = numberOfEmployees
        }

        await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: req.body
        })

        return successResponse({ res, message: 'Done, Data has been updated ' })
    }
)

export const getCompanyByName = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            },
            select: '-_id companyName companyEmail description industry Logo coverPic address'
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        return successResponse({ res, data: { company } })
    }
)

export const getSpecificCompayWithRelatedJobs = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
                approvedByAdmin: true
            },
            populate: [{
                path: 'RelatedJobs'
            }]
        })

        if (!company) {
            return next(new Error('In-valid company id', { cause: 404 }))
        }

        return successResponse({ res, data: { company } })
    }
)

export const updateCompanyLogo = asyncHandler(
    async (req, res, next) => {

        let company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: req.params.companyName })

        if (!owner) {
            return next(new Error('You are Not authorized to update company logo'))
        }

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/company/${req.params.companyName}/logo` }
        )

        company = await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                CreatedBy: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                Logo: { public_id, secure_url }
            }
        })

        if (company.Logo?.public_id) {
            await cloud.uploader.destroy(company.Logo.public_id)
        }

        return successResponse({ res, message: 'Company logo has been uploaded ' })
    }
)

export const updateCompanyImageCover = asyncHandler(
    async (req, res, next) => {

        let company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: req.params.companyName })

        if (!owner) {
            return next(new Error('You are Not authorized to update company cover image'))
        }

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/company/${req.params.companyName}/coverPic` }
        )

        company = await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                CreatedBy: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                coverPic: { public_id, secure_url }
            }
        })

        if (company.coverPic?.public_id) {
            await cloud.uploader.destroy(company.coverPic.public_id)
        }

        return successResponse({ res, message: 'Company cover image has been uploaded ' })
    }
)

export const deleteCompanyLogo = asyncHandler(
    async (req, res, next) => {

        let company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: req.params.companyName })

        if (!owner) {
            return next(new Error('You are Not authorized to update company cover image'))
        }

        company = await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                CreatedBy: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                $unset: { Logo: 0 }
            }
        })

        if (company.Logo?.public_id) {
            await cloud.uploader.destroy(company.Logo.public_id)
        }

        return successResponse({ res, message: 'Company logo has been deleted ' })
    }
)

export const deleteCompanyImageCover = asyncHandler(
    async (req, res, next) => {

        let company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: req.params.companyName })

        if (!owner) {
            return next(new Error('You are Not authorized to delete company cover image'))
        }

        company = await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                CreatedBy: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                $unset: { coverPic: 0 }
            }
        })

        if (company.coverPic?.public_id) {
            await cloud.uploader.destroy(company.coverPic.public_id)
        }

        return successResponse({ res, message: 'Company cover image has been deleted ' })
    }
)

export const deleteCompany = asyncHandler(
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

        const owner = await isOwner({ id: req.user._id, companyName: company.companyName })

        if (!owner && req.user.role != roleTypes.admin) {
            return next(new Error('You are not authorized to delete this company', { cause: 403 }))
        }

        await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                _id: req.params.companyId,
            },
            data: {
                deletedAt: Date.now()
            },
            options: {
                new: true
            }
        })

        return successResponse({ res, message: 'This company is deleted' })
    }
)

export const addHRorDeleteHR = asyncHandler(
    async (req, res, next) => {

        const data = req.query.action === 'Delete' ? { $pull: { HRs: req.params.HRId } } : { $addToSet: { HRs: req.params.HRId } }

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            }
        })

        if (!company) {
            return next(new Error('Company not found', { cause: 404 }))
        }

        const owner = await isOwner({ id: req.user._id, companyName: company.companyName })

        if (!owner) {
            return next(new Error('You are not authorized to add HR', { cause: 403 }))
        }

        await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            },
            data
        })

        return req.query.action === 'Delete' ? successResponse({ res, message: 'This HR is now deleted' }) : successResponse({ res, message: 'This HR is now addded' })
    }
)