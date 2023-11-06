import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { featureSpecification } from "./featureSpecificationValidSchema";


export const featureSpecificationValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(featureSpecification.featureSpecificationSchema, req.body, next);
}