import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET } from "../../../config";



const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const jwtSecretKey: Secret = JWT_SECRET!;
        const token = req.header("token");
        const decode = jwt.verify(token!, jwtSecretKey) as JwtPayload;
        const admin = await Admin.findOne({
            _id: decode._id,
            "tokens.token": token
        }).where({ admin_status: 1 });
        if (!admin) {
            throw new Error();
        }
        req.admin = admin;
        req.token = token;
        next();
    } catch (e) {
        res.status(400).json({ status: 0, message: 'Please Authenicate First!' });
    }
}

export default auth;