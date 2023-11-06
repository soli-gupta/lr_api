import Joi from "joi";



export const testDriveSchema = {
    bookTestDriveSchema: Joi.object({
        first_name: Joi.string().empty(''),
        last_name: Joi.string().empty(''),
        drive_full_address: Joi.string().empty(''),
        landmark: Joi.string().empty(''),
        state: Joi.string().empty(''),
        city: Joi.string().empty(''),
        book_date: Joi.string(),
        book_time: Joi.string(),
        user_lat: Joi.string().empty(''),
        user_long: Joi.string().empty(''),
        experience_center: Joi.string(),
        product_id: Joi.string(),
        pincode: Joi.string().empty(''),
    })
}