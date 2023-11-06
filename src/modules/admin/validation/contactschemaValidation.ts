import Joi from "joi";

export const contactSchemaValidation = {
    contactTypeValidation: Joi.object({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        email: Joi.string(),
        query_type: Joi.string(),
        description: Joi.string()
    })
}