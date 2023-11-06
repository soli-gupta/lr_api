import Joi from "joi";



export const userAddress = {
    userAddressSchema: Joi.object({
        address_type: Joi.string().required(),
        full_address: Joi.string().required(),
        pincode: Joi.string(),
        state: Joi.string().required(),
        city: Joi.string().required()
    })
}