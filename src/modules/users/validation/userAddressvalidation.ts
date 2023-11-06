import { NextFunction, Request, Response } from "express";
import validator from "../../../helpers/uitls/validator";
import { userAddress } from "./userAddressSchema";


export const userAddressValidation = (req: Request, res: Response, next: NextFunction) => {
    validator(userAddress.userAddressSchema, req.body, next);
}