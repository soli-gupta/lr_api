import Joi from "joi";

export const brandModelSchemaValidation = {
    brandModelSchemaValidation: Joi.object(
        {
            brand_id: Joi.string().required(),
            name: Joi.string().required(),
            slug: Joi.string().required(),
            image: Joi.string(),
            meta_keywords: Joi.string(),
            meta_description: Joi.string()
        }
    )
}