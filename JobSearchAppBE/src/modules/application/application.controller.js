import { Router } from "express";
import * as applicationService from './services/application.service.js'
import { authentcation, authorization } from "../../middleware/auth.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { fileValidation } from "../../utils/common/common.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from '../application/application.validation.js'
import { endPoint } from "./application.authorization.js";


const router = Router({
    mergeParams: true
})

router.post(
    '/',
    authentcation(),
    authorization(endPoint.applyForJob),
    uploadCloudFile(fileValidation.document).single('attachments'),
    validation(validators.applyForJob),
    applicationService.applyForJob
)

router.get(
    '/',
    validation(validators.getAllApplicationsForSpecificJob),
    authentcation(),
    authorization(endPoint.applyForJob),
    applicationService.getAllApplicationsForSpecificJob
)

router.patch(
    '/reject-or-accept-application/:applicationId',
    validation(validators.rejectOrAcceptApplication),
    authentcation(),
    authorization(endPoint.applyForJob),
    applicationService.rejectOrAcceptApplication
)

export default router