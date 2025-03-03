export const asyncHandler = (fn) => {

    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            return next(error)
        })
    }

}


export const globalErrorHandling = (error, req, res, next) => {

    if (process.env.MOOD === "PROD") {
        return res.status(error.cause || 500).json({ error: error.message })

    }
    return res.status(error.cause || 500).json({ error: error.message, stack: error.stack })
}