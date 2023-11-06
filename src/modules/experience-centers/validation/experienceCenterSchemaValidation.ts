import Joi from "joi";


export const experienceCenterSchemaValidation = {
    experienceCenterSchemaValidation: Joi.object(
        {
            name: Joi.string().required(),
            slug: Joi.string(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            address: Joi.string().required(),
            address_google_url: Joi.string(),
            center_type: Joi.array(),
            short_description: Joi.string(),
            area: Joi.string(),
            car_bay: Joi.string(),
            daily_service: Joi.string(),
            sorting: Joi.number(),
            center_title: Joi.string(),
            // day_time : Joi.string(),
            // manager_name : Joi.string().required(),
            // manager_mobile : Joi.string().required(),
            // manager_email : Joi.string().required(),
            center_banner: Joi.string(),
            service_center_banner: Joi.string(),
            car_care_banner: Joi.string()
        }
    )
}