import Joi from "joi";


export const featureSpecification = {
    featureSpecificationSchema: Joi.object({
        feature_id: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.string()
    })
}