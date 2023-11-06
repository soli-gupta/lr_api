import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { contactSchemaValidation } from "./contactschemaValidation";

export const contactsValidation = async(req:Request, res:Response, next:NextFunction) => {
  validator(contactSchemaValidation .contactTypeValidation, req.body, next)

}
