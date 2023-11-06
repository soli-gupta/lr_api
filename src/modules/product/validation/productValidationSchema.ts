import Joi from 'joi'

export const productSchemaVal = {
    productSchemaValidation: Joi.object({
        brand_id: Joi.string().required(),
        model_id: Joi.string().required(),
        variant_id: Joi.string().required(),
        registration_year: Joi.string().required(),
        registration_state: Joi.string().required(),
        kms_driven: Joi.string().required(),
        product_ownership: Joi.string().required(),
        fuel_type: Joi.string().required(),
        price: Joi.string().required(),
        name: Joi.string().required(),
        slug: Joi.string().required(),
        color: Joi.string(),
        product_banner: Joi.number(),
        booking_amount: Joi.string(),
        product_status: Joi.string(),
        image: Joi.string(),
        // linked_from: Joi.array()
        // short_description: Joi.string(),
        // manufacturing_year: Joi.string(),
        // engine_cc: Joi.string(),
        // body_type: Joi.string(),
        // insurance_type: Joi.string(),
        // insurance_valid: Joi.string(),
        // product_location: Joi.string().required(),
        // page_title: Joi.string(),
        // meta_keywords: Joi.string(),
        // meta_description: Joi.string(),
        // meta_other: Joi.string()
    })
}