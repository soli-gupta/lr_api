import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { brandModelSchemaValidation } from "./brandModelSchemavalidation";


export const brandModelDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(brandModelSchemaValidation.brandModelSchemaValidation, req.body, next);
}