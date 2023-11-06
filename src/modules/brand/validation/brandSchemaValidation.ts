import Joi from "joi";

export const brandSchemaValidation = {
    brandSchemaValidation: Joi.object(
        {
            name: Joi.string().required(),
            slug: Joi.string().required(),
            sort: Joi.string()
        }
    )
}