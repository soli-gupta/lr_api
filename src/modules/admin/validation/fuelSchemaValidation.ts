import Joi from "joi";

export const fuelSchemaValidation = {
    fuelTypeValidation: Joi.object({
        name: Joi.string().required(),
        slug: Joi.string(),
        status: Joi.string() 
    })
}