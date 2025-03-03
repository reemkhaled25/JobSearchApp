import * as DBServices from '../../DB/Services/DB.service.js'

export const pagination = async ({
    size = process.env.SIZE,
    page = process.env.PAGE,
    model = '',
    filter = {},
    populate = [],
    select = '',
    sort = { 'createdAt': 1 }
} = {}) => {

    size = parseInt(size > 0 ? size : process.env.SIZE)
    page = parseInt(page > 0 ? page : process.env.PAGE)

    const skip = (page - 1) * size
    const limit = size

    const count = await model.find(filter).countDocuments()

    const data = await DBServices.find({
        model,
        filter,
        populate,
        select,
        skip,
        limit,
        sort
    })

    return { data, page, size, count }
}