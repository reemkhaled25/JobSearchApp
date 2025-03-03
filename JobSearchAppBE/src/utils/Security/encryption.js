import CryptoJS from "crypto-js";

export const encryption = ({ plainText = '', signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {

    const encryptedValue =CryptoJS.AES.encrypt(plainText,signature).toString()
    return encryptedValue

}

export const decryption = ({ cipherText = '', signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {

    const decryptedValue = CryptoJS.AES.decrypt(cipherText, signature).toString(CryptoJS.enc.Utf8)
    return decryptedValue
}

