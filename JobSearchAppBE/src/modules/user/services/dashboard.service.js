import { companyModel } from '../../../DB/models/Company.model.js'
import { userModel } from '../../../DB/models/User.model.js'
import * as DBServices from '../../../DB/Services/DB.service.js'
import { roleTypes } from '../../../utils/common/common.enum.js'
import { asyncHandler } from '../../../utils/Response/Error/error.handling.js'
import { successResponse } from '../../../utils/Response/Success/success.response.js'


export const banORUnbanUser = asyncHandler(
    async (req, res, next) => {

        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                _id: req.params.userId,
                role: roleTypes.user,
                deletedAt: { $exists: false }
            }
        })

        if (!user) {
            return next(new Error('In-valid userId', { cause: 404 }))
        }

        if (req.query.action === 'Ban' && !user.bannedAt) {

            await DBServices.findOneAndUpdate({
                model: userModel,
                filter: {
                    _id: req.params.userId,
                    role: roleTypes.user,
                    deletedAt: { $exists: false }
                },
                data: {
                    bannedAt: Date.now()
                }
            })
            return successResponse({ res, message: 'This user in banned now' })


        } else if (req.query.action === 'Ban' && user.bannedAt) {

            return next(new Error('This user is already banned', { cause: 409 }))

        } else if (req.query.action === 'Unban' && !user.bannedAt) {

            return next(new Error('You cannot unban an unbanned user', { cause: 409 }))

        } else if (req.query.action === 'Unban' && user.bannedAt) {

            await DBServices.findOneAndUpdate({
                model: userModel,
                filter: {
                    _id: req.params.userId,
                    role: roleTypes.user,
                    deletedAt: { $exists: false }
                },
                data: {
                    $unset: { bannedAt: 0 }
                }
            })

            return successResponse({ res, message: 'This user in unbanned now' })
        }
    }
)

export const banORUnbanCompany = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false }
            }
        })

        if (!company) {
            return next(new Error('In-valid company name', { cause: 404 }))
        }

        if (req.query.action === 'Ban' && !company.bannedAt) {

            await DBServices.findOneAndUpdate({
                model: companyModel,
                filter: {
                    companyName: req.params.companyName,
                    deletedAt: { $exists: false }
                },
                data: {
                    bannedAt: Date.now()
                }
            })

            return successResponse({ res, message: 'This company in banned now' })

        } else if (req.query.action === 'Ban' && company.bannedAt) {

            return next(new Error('This company is already banned', { cause: 409 }))

        } else if (req.query.action === 'Unban' && !company.bannedAt) {

            return next(new Error('You cannot unban an unbanned company', { cause: 409 }))

        } else if (req.query.action === 'Unban' && company.bannedAt) {

            await DBServices.findOneAndUpdate({
                model: companyModel,
                filter: {
                    companyName: req.params.companyName,
                    deletedAt: { $exists: false }
                },
                data: {
                    $unset: { bannedAt: 0 }
                }
            })

            return successResponse({ res, message: 'This company in unbanned now' })
        }
    }
)

export const approveCompany = asyncHandler(
    async (req, res, next) => {

        const company = await DBServices.findOne({
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

        if (company.approvedByAdmin) {
            return next(new Error('This company is alreadt approved', { cause: 409 }))
        }

        await DBServices.findOneAndUpdate({
            model: companyModel,
            filter: {
                companyName: req.params.companyName,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                approvedByAdmin: true
            }
        })

        return successResponse({ res, message: 'Company has been approved' })
    }
)
