import Joi from "joi";

export const specificationCategorySchemaValidation = {
    specificationCategorySchemaValidation: Joi.object(
        {
            name: Joi.string().required(),
            slug: Joi.string().required(),
            logo: Joi.string()
        }
    )
}


