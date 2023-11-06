import { Request, Response } from "express";
import BankSchema from "../../admin/models/bank-model";
import InsuranceLoans from "../models/insurance-loans";
import InsuranceSchema from "../../admin/models/insurance-model";



const bankDIR = 'public/banks/';
const insuranceDIR = 'public/insurance/';

const getAllBanksList = async (req: Request, res: Response) => {
    try {
        const banks: any = [];
        const getBanks = await BankSchema.find({}).where({ bank_status: 1 }).sort({ createdAt: -1 });

        if (!getBanks) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }


        getBanks.map((bank) => {
            banks.push({
                _id: bank._id,
                name: bank.bank_name,
                image: bank.bank_image ? bankDIR + bank.bank_image : '',
            })
        });
        res.status(200).json({ status: 1, banks });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const getAllInsuranceList = async (req: Request, res: Response) => {
    try {
        const insurances: any = [];
        const getInsurance = await InsuranceSchema.find({}).where({ insurance_status: 1 }).sort({ createdAt: -1 });

        if (!getInsurance) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }


        getInsurance.map((insurance) => {
            insurances.push({
                _id: insurance._id,
                name: insurance.insurance_name,
                image: insurance.insurance_image ? insuranceDIR + insurance.insurance_image : '',
            })
        });

        res.status(200).json({ status: 1, insurances });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const addInsuranceLoansData = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const getFormData = {
            user_first_name: req.user?.first_name ? req.user?.first_name : '',
            user_last_name: req.user?.last_name ? req.user?.last_name : '',
            user_mobile_number: req.user?.mobile,
            user_email: req.user?.email,
            car_number: body.car_number,
            form_type: body.form_type
        }

        const addData = new InsuranceLoans(getFormData);
        await addData.save();

        res.status(201).json({ status: 1, message: 'Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.' });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { getAllBanksList, addInsuranceLoansData, getAllInsuranceList };