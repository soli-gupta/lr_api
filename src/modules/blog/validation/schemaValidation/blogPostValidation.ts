import { Request, Response, NextFunction } from "express";
import validator from "../../../../helpers/uitls/validator";
import { blogPostSchemaValidation } from "./blogPostSchemaValidation";

export const blogPostValidate = (req:Request, res:Response, next:NextFunction) => {
    validator(blogPostSchemaValidation.blogPostOnSchemaValidation, req.body, next )
}