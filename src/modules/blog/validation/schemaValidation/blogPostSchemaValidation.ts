import Joi from "joi";

export const blogPostSchemaValidation = {
    blogPostOnSchemaValidation : Joi.object(
        {
            category_id : Joi.string().required(),
            name: Joi.string().required(),
            slug: Joi.string().required(),
            posted_by:Joi.string().required(),
            posted_date: Joi.string(),
            image: Joi.string(),
            tags:Joi.array(),
            page_title:Joi.string(),
            short_description:Joi.string(),
            description:Joi.string(), 
            meta_keywords: Joi.string(),
            meta_description: Joi.string()
        }
    )
 
}