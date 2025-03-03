import bcrypt from "bcryptjs";

export const createHash = ({ plainText = '', salt = process.env.SALT } = {}) => {

    const hashedValue = bcrypt.hashSync(plainText, parseInt(salt))
    return hashedValue
}

export const compareHash = ({ plainText = '', hashedValue = '' } = {}) => {

    const compare = bcrypt.compareSync(plainText, hashedValue)
    return compare
}