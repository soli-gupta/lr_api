import { Request, Response, NextFunction } from "express";
import validator from "../../../../helpers/uitls/validator";
import { blogCategorySchemavalidation } from "./blogCategorySchemavalidation";

export const blogValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(blogCategorySchemavalidation.blogCategoryonSchemaValidation, req.body, next);
}