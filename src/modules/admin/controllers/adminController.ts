import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { encryptPassword } from "../../../helpers/common_helper";
import { findCredentialsForAdmin } from "../middelware/adminLogIn";
import generateAdAuthToken from "../middelware/generateAdAuthToken";
import Admin from "../models/admin";
import fs from 'fs';
import path from "path";

const DIR = 'public/admin/profile/';
const adminImagePath = path.join(process.cwd(), '/public/admin/profile/');

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminData = {
            admin_name: req.body.name ?? '',
            admin_email: req.body.email ?? '',
            admin_password: req.body.password ? await encryptPassword(req.body.password) : '',
            admin_address: req.body.address ?? '',
            admin_contact: req.body.contact ?? ''
        }
        const admin = new Admin(adminData);
        await admin.save();
        const token = await generateAdAuthToken(admin._id);

        const shareAdmin = {
            _id: admin!._id,
            name: admin!.admin_name,
            email: admin!.admin_email,
            contact: admin!.admin_contact,
            address: admin!.admin_address,
            status: admin!.admin_status,
            createAt: admin!.createdAt,
            lastUpdated: admin!.updatedAt,
            profile: DIR + admin!.admin_profile
        }
        res.status(201).json({ admin: shareAdmin, token });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
        // return next(createHttpError.InternalServerError);
    }
}

const adminLogIn = async (req: Request, res: Response) => {
    try {
        const admin = await findCredentialsForAdmin(req.body.email, req.body.password);
        const token = await generateAdAuthToken
            (admin._id);
        const shareAdmin = {
            _id: admin!._id,
            name: admin!.admin_name,
            email: admin!.admin_email,
            contact: admin!.admin_contact,
            address: admin!.admin_address,
            status: admin!.admin_status,
            createAt: admin!.createdAt,
            lastUpdated: admin!.updatedAt,
            profile: DIR + admin!.admin_profile
        }
        res.status(200).json({ status: 1, message: 'Admin Login Successfully!', admin: shareAdmin, token });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getAdminProfile = async (req: Request, res: Response) => {
    try {
        const shareAdmin = {
            _id: req.admin!._id,
            name: req.admin!.admin_name,
            email: req.admin!.admin_email,
            contact: req.admin!.admin_contact,
            address: req.admin!.admin_address,
            status: req.admin!.admin_status,
            createAt: req.admin!.createdAt,
            lastUpdated: req.admin!.updatedAt,
            profile: req.admin!.admin_profile ? DIR + req.admin!.admin_profile : ''
        }
        res.status(200).json({ status: 1, admin: shareAdmin })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const updateAdminProfile = async (req: Request, res: Response) => {
    try {
        const _id = req.admin?._id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action isnot alowed at this time!' });
        }
        const admin = await Admin.findById({ _id })!;

        admin!.admin_name = req.body.name ? req.body.name : admin!.admin_name;
        admin!.admin_email = req.body.email ? req.body.email : admin!.admin_email;
        admin!.admin_contact = req.body.contact ? req.body.contact : admin!.admin_contact;
        admin!.admin_address = req.body.address ? req.body.address : admin!.admin_address;
        admin!.admin_password = req.body.password ? await encryptPassword(req.body.password) : admin!.admin_password;


        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : admin!.admin_profile;
            if (admin!.admin_profile !== '' || admin!.admin_profile !== undefined) {
                fs.unlinkSync(adminImagePath + req.admin!.admin_profile);
            }
            admin!.admin_profile = uploadFile;
        }
        await admin?.save();

        const shareAdmin = {
            _id: admin!._id,
            name: admin!.admin_name,
            email: admin!.admin_email,
            contact: admin!.admin_contact,
            address: admin!.admin_address,
            status: admin!.admin_status,
            createAt: admin!.createdAt,
            lastUpdated: admin!.updatedAt,
            profile: admin!.admin_profile ? DIR + admin!.admin_profile : ''
        }

        res.status(200).json({ status: 1, message: 'Admin profile updated successfully!', admin: shareAdmin })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const adminLogOut = async (req: Request, res: Response) => {
    try {
        req.admin!.tokens = req.admin!.tokens.filter((token: any) => {
            return token.token !== req.token;
        });
        await req.admin!.save();
        res.status(200).json({ status: 1, message: 'Admin logout succerssfully!' });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const adminLogOutOfAllDevices = async (req: Request, res: Response) => {
    try {
        req.admin!.tokens = [];
        await req.admin!.save();
        res.status(200).json({ status: 1, message: 'Admin Logged of all devices!' });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

export { createAdmin, adminLogIn, getAdminProfile, updateAdminProfile, adminLogOut, adminLogOutOfAllDevices }