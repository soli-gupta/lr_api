import { NextFunction, Request, Response } from "express";
import validator from "../../../helpers/uitls/validator";
import { testDriveSchema } from "./bookTestDriveSchema";
// import { testDriveSchema } from "./booktestDriveSchema";




export const BooktestDriveValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(testDriveSchema.bookTestDriveSchema, req.body, next);
}