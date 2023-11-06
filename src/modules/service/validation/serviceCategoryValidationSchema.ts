import Joi from "joi";

export const serviceCateVal = {
    serviceCateValSchema: Joi.object({
        service_category_name: Joi.string().required(),
        service_category_slug: Joi.string().required(),
        service_category_image: Joi.string().required(),
        service_category_status: Joi.number()
    })

}