import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { productSchemaVal } from "./productValidationSchema";

export const productValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(productSchemaVal.productSchemaValidation, req.body, next);
}