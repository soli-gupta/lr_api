import Joi from "joi";

export const BookVisit = {
    bookVisitSchema: Joi.object({
        visitor_first_name: Joi.string().required(),
        visitor_last_name: Joi.string(),
        visitor_contact: Joi.string().required(),
        experience_center: Joi.string().required(),
        date: Joi.string().required(),
        book_time: Joi.string(),
        type: Joi.string().required()
    })
}