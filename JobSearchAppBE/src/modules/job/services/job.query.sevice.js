import { jobModel } from "../../../DB/models/Job.model.js";
import { authentcation } from "../../../middleware/graph/auth.graph.middleware.js";
import { roleTypes } from "../../../utils/common/common.enum.js";
import { pagination } from "../../../utils/pagination/pagination.js";


export const getAllJobs = async (parent, args) => {

    const { authorization, size, page } = args;

    let filter = {}

    if (args.filter) {
        filter = args.filter
    }

    await authentcation({
        authorization,
        Roles: [roleTypes.user, roleTypes.admin]

    })

    const Jobs = await pagination({
        model: jobModel,
        size,
        filter,
        page,

    })
    
    return Jobs
}