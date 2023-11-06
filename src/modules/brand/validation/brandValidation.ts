import { Request, Response, NextFunction } from "express";
import validator from '../../../helpers/uitls/validator';
import { brandSchemaValidation } from "./brandSchemaValidation";

export const brandDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(brandSchemaValidation.brandSchemaValidation, req.body, next);
}