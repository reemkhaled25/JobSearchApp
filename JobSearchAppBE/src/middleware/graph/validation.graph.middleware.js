
//to validate graphql arg 
export const validation = async (schema, arg) => {

    const validationResults = schema.validate(arg, { abortEarly: false })

    if (validationResults?.error?.details.length) {

        throw new Error(validationResults.error.toString())
    }
}