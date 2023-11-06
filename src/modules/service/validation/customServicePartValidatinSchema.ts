import Joi from "joi";

export const customServiceVal = {
    customServiceValSchema: Joi.object({
        custom_service_part_name: Joi.string().required(),
        custom_service_part_slug: Joi.string().required(),
        custom_service_part_image: Joi.string().required(),
        custom_service_part_status: Joi.number()
    })

}