import { Request, Response } from "express";
import path from "path";
import fs from 'fs';
import InsuranceSchema from "../models/insurance-model";


const DIR = 'public/insurance/';
const insuranceImagePath = path.join(process.cwd(), '/public/insurance/');


const createInsurance = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const insuranceData = {
            insurance_name: body.name,
        }
        const ins = new InsuranceSchema(insuranceData);
        if (req.file !== undefined) {
            ins.insurance_image = req.file.filename;
        }
        await ins.save();

        res.status(201).json({ status: 1, message: `${ins.insurance_name} created successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



const getAllInsurances = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const insurances: any = [];
        const getInsurance = await InsuranceSchema.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getInsurance) {
            return res.status(400).json({ status: 0, message: `Not found.` });
        }

        getInsurance.map((insurance) => {
            insurances.push({
                _id: insurance._id,
                name: insurance.insurance_name,
                image: insurance.insurance_image ? DIR + insurance.insurance_image : '',
                status: insurance.insurance_status,
                createdAt: insurance.createdAt,
                updatedAt: insurance.updatedAt
            })
        })

        res.status(200).json({ status: 1, insurances });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const getInsuranceDetail = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const insurance = await InsuranceSchema.findById({ _id });

        if (!insurance) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const getInsurance = {
            _id: insurance._id,
            name: insurance.insurance_name,
            image: insurance.insurance_image ? DIR + insurance.insurance_image : '',
            status: insurance.insurance_status,
            createdAt: insurance.createdAt,
            updatedAt: insurance.updatedAt
        }

        res.status(200).json({ status: 1, insurance: getInsurance });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Soemthing went wrong.' });
    }
}


const updateInsurance = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;
        const body: any = req.body;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const insurance = await InsuranceSchema.findById({ _id });

        if (!insurance) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        insurance.insurance_name = body.name;

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : insurance.insurance_image;
            if (insurance.insurance_image) {
                fs.unlinkSync(insuranceImagePath + insurance.insurance_image);
            }
            insurance.insurance_image = uploadFile;
        }

        await insurance.save();

        res.status(200).json({ status: 1, message: `${insurance.insurance_name} updated successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const blockUnBlockInsurance = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const insurance = await InsuranceSchema.findById({ _id });

        if (!insurance) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        insurance.insurance_status = status;

        await insurance.save();

        res.status(200).json({ status: 1, message: `${insurance.insurance_name} updated successfully.` });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createInsurance, getAllInsurances, getInsuranceDetail, updateInsurance, blockUnBlockInsurance }