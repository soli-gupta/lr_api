import Joi from "joi";


export const bankSchemaValidation = {
    bankSchemaValidation: Joi.object({
        name: Joi.string(),
        image: Joi.string()
    })
}