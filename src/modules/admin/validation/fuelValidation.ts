import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/uitls/validator";
import { fuelSchemaValidation } from "./fuelSchemaValidation";

export const fuelValidation = async(req:Request, res:Response, next:NextFunction) => {
  validator(fuelSchemaValidation.fuelTypeValidation, req.body, next)

}
