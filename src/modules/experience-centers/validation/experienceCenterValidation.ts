import { Request, Response, NextFunction } from "express";
import { experienceCenterSchemaValidation } from "./experienceCenterSchemaValidation";
import validator from "../../../helpers/uitls/validator";


export const experienceCenterDataValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(experienceCenterSchemaValidation.experienceCenterSchemaValidation, req.body, next);
}