import { Request, Response, NextFunction } from "express";
import validator from "../../../../helpers/uitls/validator";
import { variantSchemaValidation } from "./variantSchemaValidation";


export const variantDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(variantSchemaValidation.varaintSchemaValidation, req.body, next);
}