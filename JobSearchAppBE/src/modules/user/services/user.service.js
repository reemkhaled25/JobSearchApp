import { asyncHandler } from "../../../utils/Response/Error/error.handling.js";
import { encryption } from "../../../utils/Security/encryption.js";
import { userModel } from "../../../DB/models/User.model.js";
import { successResponse } from "../../../utils/Response/Success/success.response.js";
import * as DBServices from '../../../DB/Services/DB.service.js'
import { compareHash, createHash } from "../../../utils/Security/hashing.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { friendRequestModel } from "../../../DB/models/FriendRequest.model.js";


export const updateProfileBasics = asyncHandler(
    async (req, res, next) => {

        if (req.body.mobileNumber) {
            let mobileNumber = encryption({ plainText: req.body.mobileNumber })
            req.body.mobileNumber = mobileNumber
        }

        const user = await DBServices.updateOne({
            model: userModel,
            filter: {
                _id: req.user._id,
            },
            data: req.body
        })


        return successResponse({ res, message: 'Updated successfully' })

    }
)

export const loggedUserProfile = asyncHandler(
    async (req, res, next) => {


        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            },
            populate: [{
                path: 'friends'
            }]
        })

        return successResponse({ res, data: { user } })
    }

)

export const getUserProfile = asyncHandler(
    async (req, res, next) => {


        const user = await DBServices.findOne({
            model: userModel,
            filter: {
                _id: req.params.profileId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            },
            select: '-_id firstName lastName mobileNumber profilePic coverPic'
        })

        if (!user) {
            return next(new Error('In-valid profile id'))
        }

        return successResponse({ res, data: { user } })

    }
)

export const updatePassword = asyncHandler(
    async (req, res, next) => {

        const { oldPassword, newPassword } = req.body

        if (!compareHash({ plainText: oldPassword, hashedValue: req.user.password })) {
            return next(new Error('In-valid old password', { cause: 400 }))
        }

        await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false },
            },
            data: {
                password: createHash({ plainText: newPassword }),
                changeCredentialTime: Date.now()
            }
        })

        return successResponse({ res, message: 'Password has been updated successfully' })
    }
)

export const updateProfileImage = asyncHandler(
    async (req, res, next) => {

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/user/${req.user._id}/profile/profilePic` }
        )
        const user = await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                profilePic: { public_id, secure_url }
            },
            options: {
                new: false,
                runValidators: true
            }
        })

        if (user.profilePic?.public_id) {
            await cloud.uploader.destroy(user.profilePic.public_id)
        }
        return successResponse({ res, message: 'Profile picture has been uploaded ' })

    }
)

export const updateProfileImageCover = asyncHandler(
    async (req, res, next) => {

        const { public_id, secure_url } = await cloud.uploader.upload(
            req.file.path,
            { folder: `${process.env.APP_NAME}/user/${req.user._id}/profile/coverPic` }
        )
        const user = await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                coverPic: { public_id, secure_url }
            }
        })

        if (user.coverPic?.public_id) {
            await cloud.uploader.destroy(user.coverPic.public_id)
        }
        return successResponse({ res, message: 'Profile cover image has been uploaded ' })

    }
)

export const deleteProfileImage = asyncHandler(
    async (req, res, next) => {

        const user = await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                $unset: { profilePic: 0 }
            }
        })

        if (user.profilePic?.public_id) {
            await cloud.uploader.destroy(user.profilePic.public_id)
        }
        return successResponse({ res, message: 'Profile image has been deleted ' })

    }
)

export const deleteProfileImageCover = asyncHandler(
    async (req, res, next) => {

        const user = await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                $unset: { coverPic: 0 }
            }
        })

        if (user.coverPic?.public_id) {
            await cloud.uploader.destroy(user.coverPic.public_id)
        }
        return successResponse({ res, message: 'Profile cover image has been deleted ' })

    }
)

export const freezeAccount = asyncHandler(
    async (req, res, next) => {

        await DBServices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            },
            data: {
                deletedAt: Date.now(),
                changeCredentialTime: Date.now()
            },
            options: {
                new: true
            }
        })

        return successResponse({ res, message: 'Account freezed' })

    }
)

export const sendFriendRequest = asyncHandler(
    async (req, res, next) => {

        if (req.user._id.toString() === req.params.recieverId) {
            return next(new Error('You cannot send friend request to yourself', { cause: 400 }))
        }

        const reciever = await DBServices.findOne({
            model: userModel,
            filter: {
                _id: req.params.recieverId,
                deletedAt: { $exists: false },
                bannedAt: { $exists: false }
            }
        })

        if (!reciever) {
            return next(new Error('In-valid user id', { cause: 404 }))
        }

        await DBServices.create({
            model: friendRequestModel,
            data: {
                recieverId: req.params.recieverId,
                senderId: req.user._id,
            }
        })

        return successResponse({ res, status: 201, message: 'Your friend request is sent ' })
    }
)

export const acceptFriendRequset = asyncHandler(
    async (req, res, next) => {

        console.log(req.params);

        const friendRequest = await DBServices.findOneAndDelete({
            model: friendRequestModel,
            filter: {
                _id: req.params.requestId,
                recieverId: req.user._id,
                status: false
            }
        })

        if (!friendRequest) {
            return next(new Error('In-valid friend request id', { cause: 404 }))
        }

        await DBServices.updateOne({
            model: userModel,
            filter: {
                _id: req.user._id
            }, data: {
                $addToSet: { friends: friendRequest.senderId }
            }
        })

        await DBServices.updateOne({
            model: userModel,
            filter: {
                _id: friendRequest.senderId
            }, data: {
                $addToSet: { friends: req.user._id }
            }
        })

        return successResponse({ res, message: 'You accept this friend request' })

    }
)