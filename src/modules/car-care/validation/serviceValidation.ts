import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { serviceVal } from "./serviceValidationSchema";

export const productValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(serviceVal.serviceValSchema, req.body, next);
}