import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { serviceCateVal } from "./serviceCategoryValidationSchema";

export const productValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(serviceCateVal.serviceCateValSchema, req.body, next);
}