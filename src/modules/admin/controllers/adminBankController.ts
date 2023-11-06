import { Request, Response } from "express";
import BankSchema from "../models/bank-model";
import path from "path";
import fs from 'fs';


const DIR = 'public/banks/';
const bankImagePath = path.join(process.cwd(), '/public/banks/');


const createBank = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const bankData = {
            bank_name: body.name,
        }
        const bank = new BankSchema(bankData);
        if (req.file !== undefined) {
            bank.bank_image = req.file.filename;
        }
        await bank.save();

        res.status(201).json({ status: 1, message: `${bank.bank_name} created successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getAllBanks = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const banks: any = [];
        const getBanks = await BankSchema.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!banks) {
            return res.status(400).json({ status: 0, message: `Not found.` });
        }

        getBanks.map((bank) => {
            banks.push({
                _id: bank._id,
                name: bank.bank_name,
                image: bank.bank_image ? DIR + bank.bank_image : '',
                status: bank.bank_status,
                createdAt: bank.createdAt,
                updatedAt: bank.updatedAt
            })
        })

        res.status(200).json({ status: 1, banks });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getBankDetail = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const bank = await BankSchema.findById({ _id });

        if (!bank) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const getBank = {
            _id: bank._id,
            name: bank.bank_name,
            image: bank.bank_image ? DIR + bank.bank_image : '',
            status: bank.bank_status,
            createdAt: bank.createdAt,
            updatedAt: bank.updatedAt
        }

        res.status(200).json({ status: 1, bank: getBank });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Soemthing went wrong.' });
    }
}

const updateBank = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;
        const body: any = req.body;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const bank = await BankSchema.findById({ _id });

        if (!bank) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        bank.bank_name = body.name;

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : bank.bank_image;
            if (bank.bank_image) {
                fs.unlinkSync(bankImagePath + bank.bank_image);
            }
            bank.bank_image = uploadFile;
        }

        await bank.save();

        res.status(200).json({ status: 1, message: `${bank.bank_name} updated successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnBlockBank = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const bank = await BankSchema.findById({ _id });

        if (!bank) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        bank.bank_status = status;

        await bank.save();

        res.status(200).json({ status: 1, message: `${bank.bank_name} updated successfully.` });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createBank, getAllBanks, getBankDetail, updateBank, blockUnBlockBank }