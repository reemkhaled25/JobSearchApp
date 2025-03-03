import { Router } from 'express'
import { authentcation, authorization } from '../../middleware/auth.middleware.js'
import { validation } from '../../middleware/validation.middleware.js'
import * as validators from './company.validation.js'
import { fileValidation } from '../../utils/common/common.enum.js'
import { uploadCloudFile } from '../../utils/multer/cloud.multer.js'
import * as companyService from './services/company.service.js'
import jobController from '../job/job.controller.js'
import { endPoint } from './company.authorization.js'

const router = Router()

router.use('/:companyId/job', jobController)

router.post(
    '/add-company',
    authentcation(),
    authorization(endPoint.addCompany),
    uploadCloudFile([...fileValidation.document, ...fileValidation.image]).single('attachments'),
    validation(validators.addCompany),
    companyService.addCompany
)

router.patch(
    '/update-company/:companyId',
    validation(validators.updateCompany),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.UpdateCompany
)

router.get(
    '/search/:companyName',
    validation(validators.getCompanyByName),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.getCompanyByName
)

router.get(
    '/:companyId',
    validation(validators.getSpecificCompayWithRelatedJobs),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.getSpecificCompayWithRelatedJobs
)

router.patch(
    '/:companyName/logo',
    authentcation(),
    authorization(endPoint.addCompany),
    uploadCloudFile(fileValidation.image).single('attachments'),
    validation(validators.updateCompanyLogo),
    companyService.updateCompanyLogo
)

router.patch(
    '/:companyName/cover-image',
    authentcation(),
    authorization(endPoint.addCompany),
    uploadCloudFile(fileValidation.image).single('attachments'),
    validation(validators.updateCompanyLogo),
    companyService.updateCompanyImageCover
)

router.delete(
    '/:companyName/logo',
    validation(validators.getCompanyByName),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.deleteCompanyLogo
)

router.delete(
    '/:companyName/cover-image',
    validation(validators.getCompanyByName),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.deleteCompanyImageCover
)

router.delete(
    '/:companyId',
    validation(validators.deleteCompany),
    authentcation(),
    companyService.deleteCompany
)

router.patch(
    '/update-company/:companyName/update-HRs/:HRId',
    validation(validators.addHRorDeleteHR),
    authentcation(),
    authorization(endPoint.addCompany),
    companyService.addHRorDeleteHR
)

export default router