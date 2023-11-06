import { Request, Response, NextFunction } from "express";
import { generateRequestID } from "../../../helpers/common_helper";
import Sell from "../../user/model/sell";
import fs from 'fs';
import path from "path";

const SellCarCertificatePath = path.join(process.cwd(), '/public/sell/car-certificate/');
const SellCertDIR = 'public/sell/car-certificate/';

const SellCarInsurance = path.join(process.cwd(), '/public/sell/car-insurance/')
const SellCarInsuranceDIR = 'public/sell/car-insurance/'


const sellDataList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellData: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const getSellData = await Sell.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
        if (!getSellData) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }
        getSellData.forEach((sellRequest) => {
            sellData.push({
                id: sellRequest._id,
                brand_name: sellRequest.brand_name,
                model_name: sellRequest.model_name,
                variant_name: sellRequest.variant_name,
                year: sellRequest.year,
                ownership: sellRequest.ownership,
                kms: sellRequest.kms,
                user_name: sellRequest.user_name,
                user_email: sellRequest.user_email,
                user_mobile: sellRequest.user_mobile,
                state: sellRequest.state,
                address_type: sellRequest.address_type,
                city: sellRequest.city,
                pincode: sellRequest.pincode,
                full_address: sellRequest.full_address,
                slot_time: sellRequest.slot_time,
                slot_date: sellRequest.slot_date,
                request_id: sellRequest.request_id,
                car_insurance: sellRequest.car_insurance ? SellCarInsuranceDIR + sellRequest.car_insurance : '',
                rc_registration_certificate: sellRequest.rc_registration_certificate ? SellCertDIR + sellRequest.rc_registration_certificate : '',
                expected_sell_price: sellRequest.expected_sell_price,
                cancel_reason: sellRequest.cancel_reason,
                cancel_reason_description: sellRequest.cancel_reason_dscription,
                status: sellRequest.status,
                createdAt: sellRequest.createdAt,
                updatedAt: sellRequest.updatedAt
            })
        });
        res.status(200).json({ status: 1, sellData: sellData });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const viewSellData = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const getSellData = await Sell.findById({ _id })

        if (!getSellData) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }

        const data = {
            id: getSellData._id,
            brand_name: getSellData.brand_name,
            model_name: getSellData.model_name,
            variant_name: getSellData.variant_name,
            year: getSellData.year,
            ownership: getSellData.ownership,
            kms: getSellData.kms,
            user_name: getSellData.user_name,
            user_email: getSellData.user_email,
            user_mobile: getSellData.user_mobile,
            state: getSellData.state,
            address_type: getSellData.address_type,
            city: getSellData.city,
            pincode: getSellData.pincode,
            full_address: getSellData.full_address,
            slot_time: getSellData.slot_time,
            slot_date: getSellData.slot_date,
            request_id: getSellData.request_id,
            car_insurance: getSellData.car_insurance ? SellCarInsuranceDIR + getSellData.car_insurance : '',
            rc_registration_certificate: getSellData.rc_registration_certificate ? SellCertDIR + getSellData.rc_registration_certificate : '',
            expected_sell_price: getSellData.expected_sell_price,
            cancel_reason: getSellData.cancel_reason,
            cancel_reason_description: getSellData.cancel_reason_dscription,
            status: getSellData.status,
            createdAt: getSellData.createdAt,
            updatedAt: getSellData.updatedAt
        }

        res.status(200).json({ status: 1, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}
const updateAdminSellDataDetail = async (req: Request, res: Response) => {
    try {

        const _id = req.body.id
        const order = await Sell.findById({ _id })

        order!.status = req.body.status ? req.body.status : order!.status
        order!.cancel_reason_dscription = req.body.cancel_reason_dscription ? req.body.cancel_reason_dscription : ''

        await order!.save()
        res.status(200).json({ status: 1, message: 'Sell Request Updated Successfully', order });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}
export { sellDataList, viewSellData, updateAdminSellDataDetail }