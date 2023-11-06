import { DocumentDefinition } from "mongoose";
import Admin, { IAdmin } from "../models/admin";
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";

export const findCredentialsForAdmin = async (email: string, password: string) => {

    const admin = await Admin.findOne({ admin_email: email });
    if (!admin) { 
        throw createHttpError(404, "Email not exists.");
    }
    
    const matchPassword = await bcrypt.compare(password, admin.admin_password);

    if (!matchPassword) { 
        throw createHttpError(404, "Password not matched!");
    }

    return admin;


}

