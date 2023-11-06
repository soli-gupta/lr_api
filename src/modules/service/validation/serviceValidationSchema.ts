import Joi from "joi";

export const serviceVal = {
    serviceValSchema: Joi.object({
        brand_id: Joi.string(),
        brand_name: Joi.string(),
        model_id: Joi.string(),
        model_name: Joi.string(),
        variant_id: Joi.string(),
        variant_name: Joi.string(),
        fuel_type: Joi.string(),
        body_type: Joi.string(),
        service_category_id: Joi.string().required(),
        service_name: Joi.string().required(),
        service_slug: Joi.string(),
        service_price: Joi.string().required(),
        service_taken_hours: Joi.string().required(),
        service_short_description: Joi.string().required(),
        service_description: Joi.string().required(),
        service_recommend: Joi.string(),
        service_sorting: Joi.string()
    })

}