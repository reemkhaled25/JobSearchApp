import { companyModel } from '../../../DB/models/Company.model.js'
import { userModel } from '../../../DB/models/User.model.js'
import { authentcation } from '../../../middleware/graph/auth.graph.middleware.js'
import { validation } from '../../../middleware/graph/validation.graph.middleware.js'
import { roleTypes } from '../../../utils/common/common.enum.js'
import { pagination } from '../../../utils/pagination/pagination.js'
import { dashboard } from '../user.validation.js'

export const getUsers = async (parent, args) => {

    const { authorization, size, page } = args

    await validation(dashboard, args)

    await authentcation({
        authorization,
        Roles: [roleTypes.admin]
    })

    const data = await pagination({
        model: userModel,
        size,
        page,
    })

    return data
}

export const getCompanies = async (parent, args) => {

    const { authorization, size, page } = args

    await validation(dashboard, args)

    await authentcation({
        authorization,
        Roles: [roleTypes.admin]
    })

    const data = await pagination({
        model: companyModel,
        size,
        page,
    })

    return data
}