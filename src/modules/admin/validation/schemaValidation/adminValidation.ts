import { Request, Response, NextFunction } from "express";
import validator from "../../../../helpers/uitls/validator";
import { adminSchemavalidation } from "./adminSchemaValidation";

export const adminDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(adminSchemavalidation.admionSchemaValidation, req.body, next);
}