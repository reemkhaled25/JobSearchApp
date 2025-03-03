export const create = async ({ model = '', data = {} } = {}) => {

    const document = await model.create(data)
    return document
}

export const find = async ({ model = '', filter = {}, populate = [], select = '', skip = 0, limit = 0, sort = {} } = {}) => {

    const documents = await model.find(filter).populate(populate).select(select).skip(skip).limit(limit).sort(sort)
    return documents
}

export const findOne = async ({ model = '', filter = {}, populate = [], select = '' } = {}) => {

    const document = await model.findOne(filter).populate(populate).select(select)
    return document
}

export const findById = async ({ model = '', id = '', populate = [], select = '' } = {}) => {

    const document = await model.findById(id).populate(populate).select(select)
    return document
}

export const findOneAndUpdate = async ({ model = '', filter = {}, data = {}, options = {}, populate = [], select = '' } = {}) => {

    const document = await model.findOneAndUpdate(filter, data, options).populate(populate).select(select)
    return document
}

export const findOneAndDelete = async ({ model = '', filter = {}, options = {} } = {}) => {

    const document = await model.findOneAndDelete(filter, options)
    return document
}

export const findByIdAndUpdate = async ({ model = '', id = '', data = {}, options = {} } = {}) => {

    const document = await model.findByIdAndUpdate(id, data, options)
    return document
}

export const findByIdAndDelete = async ({ model = '', id = '', options = {} } = {}) => {

    const document = await model.findByIdAndDelete(id, options)
    return document
}

export const updateOne = async ({ model = '', filter = {}, data = {}, options = {} } = {}) => {

    const document = await model.updateOne(filter, data, options)
    return document
}

export const updateMany = async ({ model = '', filter = {}, data = {}, options = {} } = {}) => {

    const documents = await model.updateMany(filter, data, options)
    return documents
}

export const deleteOne = async ({ model = '', filter = {}, options = {} } = {}) => {

    const document = await model.deleteOne(filter, options)
    return document
}

export const deleteMany = async ({ model = '', filter = {}, options = {} } = {}) => {

    const documents = model.deleteMany(filter, options)
    return documents
}
