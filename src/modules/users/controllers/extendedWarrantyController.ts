import { Request, Response } from "express";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import BookExtendedWarranty from "../models/extended-warranty";
import Fuel from "../../admin/models/fuel";
import Orders from "../models/orders";
import path from "path";
import fs from 'fs';


const insuranceDIR = 'public/extended-warranty/insurance-copy/';
const rcDIR = '/public/extended-warranty/rc-certificate/';
const insuranceImgPath = path.join(process.cwd(), '/public/extended-warranty/insurance-copy/');
const rcImagePath = path.join(process.cwd(), '/public/extended-warranty/rc-certificate/');



const bookExtendedWarrantyPackage = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;

        const warrantyData = {
            user_first_name: req.user?.first_name ? req.user?.first_name : '',
            user_last_name: req.user?.last_name ? req.user?.last_name : '',
            user_contact: req.user?.mobile,
            user_email_id: req.user?.email ? req.user?.email : '',
            order_car_registration_year: body.year,
            order_brand_name: body.brand,
            order_model_name: body.model,
            order_variant_name: body.variant,
            order_car_fuel_type: body.fuel,
            order_car_kms: body.kms,
            // service_center_name: body.preferred_center_name,
            // service_center_address: body.preferred_center_address,
            // vehicle_inspaction_date: body.inspaction_date,
            // user_address_type: body.user_address_type,
            // user_full_address: body.user_full_address,
            order_id: 'LR-EW-' + Date.now() + '-' + Math.round(Math.random() * 1e9),
            order_type: body.order_type,
            order_user_id: req.user?._id,
            form_step: body.form_step,
            order_status: 4,
            // vehicle_inspaction_time: body.inspaction_time,
            // order_payment_type: body.payment_type
        }

        const extendedWarranty = new Orders(warrantyData);
        await extendedWarranty.save();

        res.status(201).json({ status: 1, message: `Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.`, orderId: extendedWarranty._id })
    } catch (e) {
        res.status(500).json({ status: 0, messsage: 'Somethig went wrong.' })
    }
}



const updateExtendedWarrantyPackage = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const extendedWarranty = await Orders.findById({ _id });

        if (!extendedWarranty) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        if (body.form_step === 2) {
            extendedWarranty.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            extendedWarranty.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            extendedWarranty.user_email_id = req.user?.email ? req.user?.email : '';
            extendedWarranty.service_center_name = body.preferred_center_name;
            extendedWarranty.service_center_address = body.preferred_center_address;
            extendedWarranty.form_step = body.form_step;
        } else if (body.form_step === 3) {
            extendedWarranty.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            extendedWarranty.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            extendedWarranty.user_email_id = req.user?.email ? req.user?.email : '';
            extendedWarranty.user_address_type = body.user_address_type;
            extendedWarranty.user_full_address = body.user_full_address;
            extendedWarranty.form_step = body.form_step;
        } else if (body.form_step === 4) {
            extendedWarranty.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            extendedWarranty.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            extendedWarranty.user_email_id = req.user?.email ? req.user?.email : '';
            extendedWarranty.vehicle_inspaction_date = body.inspaction_date;
            extendedWarranty.vehicle_inspaction_time = body.inspaction_time;
            extendedWarranty.form_step = body.form_step;
        } else if (body.form_step === 5) {
            extendedWarranty.order_payment_type = body.payment_type;
            extendedWarranty.form_step = body.form_step;
            extendedWarranty.order_status = 1;
            extendedWarranty.vehicle_inspaction_date = body.inspaction_date;
            extendedWarranty.vehicle_inspaction_time = body.inspaction_time;
        }

        await extendedWarranty.save();

        res.status(201).json({ status: 1, message: `Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.`, orderId: extendedWarranty._id })
    } catch (e) {
        res.status(500).json({ status: 0, messsage: 'Somethig went wrong.' })
    }
}

const uploadDocsAfterOrder = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 2, message: 'Something went wrong. Please refresh the page and try again.' });
        }
        const body: any = req.body;


        const order = await Orders.findById({ _id });

        if (!order) {
            return res.status(400).json({ status: 2, message: 'Something went wrong. Please refresh the page and try again.' });
        }


        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {
            if (files.rc_certificate && files.rc_certificate[0].fieldname === "rc_certificate") {
                const uploadRC = files.rc_certificate[0].filename ? files.rc_certificate[0].filename : order.vehicle_rc;
                if (order.vehicle_rc) {
                    fs.unlinkSync(rcImagePath + order.vehicle_rc);
                }
                order.vehicle_rc = uploadRC;
            }

            if (files.insurance_copy && files.insurance_copy[0].fieldname === "insurance_copy") {
                const uploadInsurance = files.insurance_copy[0].filename ? files.insurance_copy[0].filename : order.vehicle_insurance;
                if (order.vehicle_insurance) {
                    fs.unlinkSync(insuranceImgPath + order.vehicle_insurance);
                }
                order.vehicle_insurance = uploadInsurance;
            }

        }
        await order.save();

        order.vehicle_rc = rcDIR + order.vehicle_rc;
        order.vehicle_insurance = insuranceDIR + order.vehicle_insurance;

        res.status(200).json({ status: 1, message: 'Document uploaded successfully.', order });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


export { bookExtendedWarrantyPackage, uploadDocsAfterOrder, updateExtendedWarrantyPackage }