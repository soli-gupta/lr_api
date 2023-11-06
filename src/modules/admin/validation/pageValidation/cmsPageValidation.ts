import { Request, Response, NextFunction } from "express";
import validator from "../../../../helpers/uitls/validator";
import { cmsPageValidationSchema } from "./cmsPageSchemaValidation";

export const cmsPageDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(cmsPageValidationSchema.cmsPageValidationSchema, req.body, next);
}