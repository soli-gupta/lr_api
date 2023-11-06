import { NextFunction, Request, Response } from "express";
import validator from "../../../../helpers/uitls/validator";
import { bankSchemaValidation } from "../bankSchemaValidation";




export const bankValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(bankSchemaValidation.bankSchemaValidation, req.body, next);
}