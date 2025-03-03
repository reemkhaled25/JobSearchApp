import { companyModel } from '../../DB/models/Company.model.js'
import * as DBServices from '../../DB/Services/DB.service.js'
import { roleTypes } from '../../utils/common/common.enum.js'

export const isOwner = async ({ id, companyName } = {}) => {

    const company = await DBServices.findOne({
        model: companyModel,
        filter: {
            companyName,
            CreatedBy: id,
            deletedAt: { $exists: false },
        }
    })

    return company?.CreatedBy?.toString()
}

export const isHR = async ({ HRId, companyId } = {}) => {

    const company = await DBServices.findOne({
        model: companyModel,
        filter: {
            _id: companyId,
            deletedAt: { $exists: false },
            bannedAt: { $exists: false }
        }
    })

    
    if (company?.HRs?.includes(HRId)) {
        return true

    } else {
        return false
    }
}

export const endPoint = {
    addCompany: [roleTypes.user]
}

