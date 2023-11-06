import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { customServiceVal } from "./customServicePartValidatinSchema";

export const productValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(customServiceVal.customServiceValSchema, req.body, next);
}