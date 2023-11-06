import Joi from "joi";

export const cmsPageValidationSchema = {
    cmsPageValidationSchema: Joi.object(
        {
            name: Joi.string().required(),
            slug: Joi.string().required(),
            sub_text: Joi.string(),
            content_one: Joi.string(),
            content_two: Joi.string(),
            content_three: Joi.string(),
            content_four: Joi.string(),
            page_banner: Joi.string(),
            banner_image_alt: Joi.string(),
            page_title: Joi.string(),
            meta_keywords: Joi.string(),
            meta_description: Joi.string(),
            meta_other: Joi.string()
        }

    )
}