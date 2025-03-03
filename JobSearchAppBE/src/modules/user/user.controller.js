import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as dashboardValidators from './dashboard.validation.js'
import * as validators from './user.validation.js'
import { authentcation, authorization } from "../../middleware/auth.middleware.js";
import { endPoint } from "./user.authorization.js";
import * as userServices from './services/user.service.js'
import * as dashboardService from './services/dashboard.service.js'
import { fileValidation } from "../../utils/common/common.enum.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";

const router = Router()

//Dashboard

router.patch(
    '/dashboard/banOrUnbanUser/:userId',
    validation(dashboardValidators.banORUnbanUser),
    authentcation(),
    authorization(endPoint.dashboard),
    dashboardService.banORUnbanUser
)

router.patch(
    '/dashboard/banOrUnbanCompany/:companyName',
    validation(dashboardValidators.banORUnbanCompany),
    authentcation(),
    authorization(endPoint.dashboard),
    dashboardService.banORUnbanCompany
)

router.patch(
    '/dashboard/approve-company/:companyName',
    validation(dashboardValidators.approveCompany),
    authentcation(),
    authorization(endPoint.dashboard),
    dashboardService.approveCompany
)

//Profile 

router.patch(
    '/profile',
    validation(validators.updateProfileBasics),
    authentcation(),
    authorization(endPoint.updateProfile),
    userServices.updateProfileBasics
)

router.get(
    '/profile',
    authentcation(),
    userServices.loggedUserProfile
)

router.get(
    '/profile/:profileId',
    validation(validators.getUserProfile),
    authentcation(),
    userServices.getUserProfile
)

router.patch(
    '/profile/password',
    validation(validators.updataPassword),
    authentcation(),
    authorization(endPoint.profile),
    userServices.updatePassword
)

router.patch(
    '/profile/profile-image',
    authentcation(),
    uploadCloudFile(fileValidation.image).single('attachments'),
    validation(validators.updateProfileImage),
    userServices.updateProfileImage
)

router.patch(
    '/profile/profile-image-cover',
    authentcation(),
    authorization(endPoint.profile),
    uploadCloudFile(fileValidation.image).single('attachments'),
    validation(validators.updateProfileImage),
    userServices.updateProfileImageCover
)

router.delete(
    '/profile/profile-image',
    authentcation(),
    authorization(endPoint.profile),
    userServices.deleteProfileImage
)

router.delete(
    '/profile/profile-image-cover',
    authentcation(),
    authorization(endPoint.profile),
    userServices.deleteProfileImageCover
)

router.delete(
    '/profile/freeze-account',
    authentcation(),
    authorization(endPoint.profile),
    userServices.freezeAccount
)

router.post(
    '/profile/sendFriendRequest/:recieverId',
    validation(validators.sendFriendRequest),
    authentcation(),
    userServices.sendFriendRequest
)

router.patch(
    '/profile/acceptFriendRequest/:requestId',
    validation(validators.acceptFriendRequest),
    authentcation(),
    userServices.acceptFriendRequset
)
export default router