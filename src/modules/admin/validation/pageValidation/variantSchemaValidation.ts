import Joi from "joi";

export const variantSchemaValidation = {
    varaintSchemaValidation: Joi.object(
        {
            brand_id: Joi.string().required(),
            model_id: Joi.string().required(),
            name: Joi.string().required(),
            slug: Joi.string().required(),
            image: Joi.string()
        }
    )
}