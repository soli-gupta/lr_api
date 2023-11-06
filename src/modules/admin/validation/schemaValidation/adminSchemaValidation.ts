import Joi from "joi";

export const adminSchemavalidation = {
    admionSchemaValidation: Joi.object(
        {
            name: Joi.string().required(),
            email: Joi.string().required(),
            contact: Joi.string().required(),
            address: Joi.string(),
            password: Joi.string().required(),
            admin_profile: Joi.string()
        })
}