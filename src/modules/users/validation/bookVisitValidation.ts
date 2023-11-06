import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { BookVisit } from "./bookVisitSchemaValidation";



export const BookVisitValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(BookVisit.bookVisitSchema, req.body, next);
}