import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET } from "../../../config";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  
    try {

        const jwtSecretKey: Secret = JWT_SECRET!;
        const token = req.header("token");
        const decode = jwt.verify(token!, jwtSecretKey) as JwtPayload;
        
        const user = await User.findOne({
            _id: decode._id,
            "tokens.token": token
        }).where({ status: 1 });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(400).json({ status: 0, message: 'Please Authenicate First!' });
    }
}

export default auth;