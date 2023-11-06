import { Request, Response, NextFunction } from "express";
import validator from '../../../helpers/uitls/validator';
import { specificationCategorySchemaValidation } from "./specificationCategorySchemaValidation";

export const specificationCategoryValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(specificationCategorySchemaValidation.specificationCategorySchemaValidation, req.body, next);
}