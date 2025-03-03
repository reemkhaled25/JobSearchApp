import multer from 'multer'

export const uploadCloudFile = (fileValidation = []) => {

    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {

        if (fileValidation.includes(file.mimetype)) {
            cb(null, true)

        } else {
            cb(new Error("In-valid format"), false)
        }
    }

    return multer({ dest: 'tempStorage', fileFilter, storage })
}