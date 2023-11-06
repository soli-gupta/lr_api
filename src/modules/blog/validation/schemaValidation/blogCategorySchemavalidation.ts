import Joi from "joi";

export const blogCategorySchemavalidation = {
    blogCategoryonSchemaValidation: Joi.object(
        {
            name: Joi.string().required(),
            slug: Joi.string().required(),
           
        })
}