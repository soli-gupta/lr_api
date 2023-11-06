import { Request, Response } from "express";
import BodyType from "../../admin/models/body-type";
import Fuel from "../../admin/models/fuel";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import Products from "../../product/models/product-model";
import BookTestDrive from "../models/book-testdrive";
import Orders from "../models/orders";

import { SALES_FORCE } from "../../../config";
import { Secret } from "jsonwebtoken";
import axios from 'axios';

const request = require("request");


const SALES_FORCE_URL: Secret = SALES_FORCE!;



const createOrder = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        let order: any = {};

        const product: any = await Products.findOne({ product_slug: body.product_slug }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name", "variant_slug"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
        ]).where({ product_status: "live", product_type_status: 1 });


        if (!product) {
            return res.status(400).json({ status: 2, message: `This car has been bought or booked by someone else. Please contact our Customer Service Representative.` })
        }

        const brandName = await Brands.findById({ _id: product.brand_id._id }).select('brand_name');


        const modelName = await BrandModel.findById({ _id: product.model_id._id }).select("model_name");

        const variantName = await ModelVariant.findById({ _id: product.variant_id._id }).select("variant_name");

        const fuelType = await Fuel.findById({ _id: product.fuel_type._id })


        const bodyType = await BodyType.findById({ _id: product.body_type!._id }).select("body_name");

        const productLocation = await ExperienceCenter.findById({ _id: product.product_location._id }).select("center_name");

        const salesForceData = {
            "E_book_Stage": "1",
            "AccountWrap": {
                "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                "Phone": req.user?.mobile
            },
            "OpportunityWrap": {
                "Name": product.product_name,
                "OpportunityLineItemWrap": {
                    "Product2Id": product.sales_force_id
                }
            }
        }

        // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceData, {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }).then(async (response) => {
        const productData = {
            user_contact: req.user?.mobile,
            order_brand_name: brandName!.brand_name,
            order_model_name: modelName!.model_name,
            order_variant_name: variantName!.variant_name,
            order_car_registration_year: product.registration_year,
            order_car_ownership: product.product_ownership,
            order_car_kms: product.kms_driven,
            order_car_amount: product.price,
            user_booking_amount: product.product_booking_amount,
            order_balance_amount: product.price - parseInt(product.product_booking_amount),
            order_car_fuel_type: fuelType!.fuel_name,
            order_car_registration_state: product.registration_state,
            order_car_name: product.product_name,
            order_car_manufacturing_year: product.manufacturing_year,
            order_car_engine: product.engine_cc,
            order_car_body_type: bodyType!.body_name,
            order_car_insurance_type: product.insurance_type,
            order_car_insurance_valid: product.insurance_valid,
            order_car_location: productLocation!.center_name,
            order_id: 'LR-' + Date.now() + '-' + Math.round(Math.random() * 1e9),
            // payment_type: 'Cash',
            order_user_id: req.user?._id,
            order_product_id: product._id,
            order_car_color: product.product_color,
            user_optd_insurance: body.option_insurance ? body.option_insurance : 2,
            order_type: body.order_type ? body.order_type : '',
            form_step: body.form_step,
            order_status: 4,
            // salesforce_OpportunityId: response.data.OpportunityId
        }


        order = new Orders(productData);

        await order.save();
        // if (!req.user!.salesforce_account_id) {
        //     req.user!.salesforce_account_id = response.data.AccountId;
        //     req.user?.save();
        // }
        res.status(201).json({ status: 1, message: `Order confiremed.`, order_id: order._id });
        // }).catch((e) => {
        //     res.status(400).json({ status: 0, message: `Order not created.` })
        // });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const updateOrderDetails = async (req: Request, res: Response) => {

    try {
        const body: any = req.body;
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const order = await Orders.findById({ _id });

        if (!order) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        if (body.form_step === '2') {
            order!.user_first_name = body.first_name ? body.first_name : req.user?.first_name;
            order!.user_last_name = body.last_name ? body.last_name : req.user?.last_name;
            order!.user_email_id = body.email ? body.email : req.user?.email;
            order!.user_optd_insurance = body.option_insurance ? body.option_insurance : 2;
            order!.form_step = body.form_step;

            const salesForceStepTwo = {
                "E_book_Stage": "2",
                "AccountWrap": {
                    "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                    "FirstName": body.first_name ? body.first_name : req.user?.first_name,
                    "LastName": body.last_name ? body.last_name : req.user?.last_name,
                    "PersonEmail": body.email ? body.email : req.user?.email
                },
                "OpportunityWrap": {
                    "Loan_Finance": body.option_insurance === "1" ? "Yes" : "No",
                    "OpportunityId": order.salesforce_OpportunityId,
                    "Name": order.order_car_name,
                    "OpportunityLineItemWrap": {
                    }
                }
            }

            // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceStepTwo, {
            //     headers: {
            //         'Content-Type': "application/json",
            //     }
            // }).then(async (response) => {

            // }).catch((e) => {

            // });
        } else if (body.form_step === '3') {
            order!.user_address_type = body.address_type;
            order!.user_full_address = body.full_address;
            order!.user_optd_insurance = body.option_insurance ? body.option_insurance : 2;
            order!.form_step = body.form_step;

            const salesForceStepThree = {
                "E_book_Stage": "3",
                "AccountWrap": {
                    "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                    "BillingStreet": body.getUserAddress,
                    "BillingCity": body.cityName,
                    "BillingState": body.stateName,
                    "BillingPostalCode": body.pinCode,
                    "BillingCountry": "India"
                },
                "OpportunityWrap": {
                    "Loan_Finance": body.option_insurance === "1" ? "Yes" : "No",
                    "OpportunityId": order.salesforce_OpportunityId,
                    "Name": order.order_car_name,
                    "OpportunityLineItemWrap": {
                    }
                }
            }

            // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceStepThree, {
            //     headers: {
            //         'Content-Type': "application/json",
            //     }
            // }).then(async (response) => {

            // }).catch((e) => {

            // });



        } else if (body.form_step === '4') {
            order!.user_optd_insurance = body.option_insurance ? body.option_insurance : 2;
            order!.form_step = body.form_step;
            order!.payment_type = body.payment_type;
            order!.order_status = 1;

            console.log(order);


            const salesForceStepFour = {
                "E_book_Stage": "4",
                "AccountWrap": {
                    "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : ''
                },
                "OpportunityWrap": {
                    "Loan_Finance": body.option_insurance === "1" ? "Yes" : "No",
                    "OpportunityId": order.salesforce_OpportunityId,
                    "Name": order.order_car_name,
                    "PaymentAmount": order.user_booking_amount,
                    "OpportunityLineItemWrap": {
                    }
                }
            }

            // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceStepFour, {
            //     headers: {
            //         'Content-Type': "application/json",
            //     }
            // }).then(async (response) => {

            // }).catch((e) => {

            // });
            // .populate([
            //                 { path: "brand_id", select: ["brand_name", "brand_slug"] },
            //                 { path: "model_id", select: ["model_name", "model_slug"] },
            //                 { path: "variant_id", select: ["variant_name", "variant_slug"] },
            //                 { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            //                 { path: "body_type", select: ["body_name", "body_slug"] },
            //                 { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
            //             ]).

            const product = await Products.findOne({ _id: order.order_product_id }).where({ product_status: "live", product_type_status: 1 });

            if (!product) {
                return res.status(400).json({ status: 2, message: `This car has been bought or booked by someone else. Please contact our Customer Service Representative.` });
            }

            product!.product_status = "booked";
            await product!.save();
        }

        await order!.save();
        res.status(201).json({ status: 1, order_id: order!._id, order });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
        //'Something went wrong.'
    }

}

const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const order_id: any = req.params.orderId;
        const productDIR = 'public/products/'

        if (!order_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!!' });
        }

        const order = await Orders.findById({ _id: order_id }).populate([
            { path: "order_product_id", select: ["product_image", "product_monthely_emi"] }
        ]);

        if (!order) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!!' });
        }

        res.status(200).json({ status: 1, order, productDIR });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getAllOrdersDetails = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const status: any = req.query.type;
        const limit = 6;
        const skip = (page - 1) * limit;
        const order_type: any = req.query.orderType;
        let buildQuery: any = {};

        if (status === '' || status === undefined) {

        } else if (status === 'booked') {
            buildQuery.order_status = 1;
            buildQuery.form_step = 4;
        } else if (status === 'completed') {
            buildQuery.order_status = 2;
            buildQuery.form_step = 4;
        } else if (status === 'cancelled') {
            buildQuery.order_status = 3;
            buildQuery.form_step = 4;
        } else if (status === 'active') {
            buildQuery.order_status = 1;
        } else if (status === 'expired') {
            buildQuery.order_status = 3;
            buildQuery.form_step = 4;
        } else if (status === 'pending') {
            buildQuery.order_status = 4;
        }
        const orders = await Orders.find({ order_user_id: req.user?._id, order_type: order_type }).populate([
            { path: "order_product_id", select: ["product_image", "product_slug"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 }).where(buildQuery);
        if (!orders) {
            return res.status(404).json({ status: 2, message: 'No orders found' });
        }

        res.status(200).json({ status: 1, orders, path: 'public/products/', ordersCount: orders.length });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong. Please wait or refresh the page.' });
    }
}

const cancelUserOrder = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const order = await Orders.findById({ _id: body.order_id });
        if (!order) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!!' });
        }


        const cancelSaleForceOrder = {
            "E_book_Status": "Cancelled",
            "OpportunityWrap": {
                "OpportunityId": order.salesforce_OpportunityId,
                "Deal_Cancel_Description": body.cancel_reason,
                "Deal_Cancel_Description_Other": body.cancel_reason_dscription ? body.cancel_reason_dscription : '',
                "OpportunityLineItemWrap": {
                }
            }
        }
        // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, cancelSaleForceOrder, {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }).then(async (response) => { }).catch((e) => { });


        order.order_status = body.status ? body.status : order.order_status;
        order.order_cancel_reason = body.cancel_reason ? body.cancel_reason : '';

        order.order_cancel_description = body.cancel_reason_dscription ? body.cancel_reason_dscription : '';
        await order.save();

        const product = await Products.findById({ _id: order.order_product_id });

        product!.product_status = "live";
        await product!.save();

        res.status(200).json({ status: 1, message: `Your booking for  ${order.order_car_name} has been cancelled.` })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchAllTestDrives = async (req: Request, res: Response) => {
    try {
        const type = req.query.type;
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        let buildQuery: any = {};

        if (type === '' || type === undefined) {
            buildQuery = ''
        } else if (type === 'upcoming') {
            buildQuery.test_status = 1;
        } else if (type === 'completed') {
            buildQuery.test_status = 2;
        } else if (type === 'cancelled') {
            buildQuery.test_status = 3;
        }

        const testDrives = await BookTestDrive.find({ user_id: req.user?._id }).populate([
            { path: "product_id", select: ["product_name", "product_slug", "product_image", "price", "product_monthely_emi", "product_status"] },
            { path: "experience_center", select: ["center_name", "center_full_address"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 }).where(buildQuery);

        if (!testDrives) {
            return res.status(400).json({ status: 2, message: 'No test drivess found.' });
        }

        res.status(200).json({ status: 1, testDrives, path: 'public/products/', testDrivesCount: testDrives.length });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const cancelUsertestDrive = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const testDrive = await BookTestDrive.findById({ _id: body.drive_id });

        testDrive!.car_cancel_reason = body.cancel_reason ? body.cancel_reason : ''
        testDrive!.car_cancel_description = body.cancel_reason_dscription ? body.cancel_reason_dscription : ''
        testDrive!.test_status = body.status ? body.status : ''


        const cancelSalesForceTestDrive = {
            "IsTestDrive": "Yes",
            "AccountWrap": {
                "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                "Phone": testDrive!.user_contact,
                "FirstName": testDrive!.user_first_name,
                "LastName": testDrive!.user_last_name,
                "BillingStreet": testDrive!.user_address,
                "BillingCity": testDrive!.user_city,
                "BillingState": testDrive!.user_state,
                "BillingPostalCode": testDrive!.pin_code,
                "BillingCountry": "India"
            },
            "OpportunityWrap": {
                "OpportunityId": testDrive!.test_drive_OpportunityId,
                "Appointment_Status": "Cancelled",
                "Name": testDrive!.car_name,
                "Location": testDrive!.car_location,
                "Preferred_Date": testDrive!.test_drive_date,
                "Preferred_Time": testDrive!.test_drive_time,
                "Cancel_Reason": body.cancel_reason ? body.cancel_reason : '',
                "Cancel_Description": body.cancel_reason_dscription ? body.cancel_reason_dscription : '',
                "OpportunityLineItemWrap": {
                }
            }
        }

        // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, cancelSalesForceTestDrive, {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }).then(async (response) => {

        // }).catch((e) => {

        // });

        await testDrive!.save();

        res.status(200).json({ status: 1, message: `Your test drive for  ${testDrive!.car_name} has been cancelled.` })


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const reScheduleUserTestDrive = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const testDrive = await BookTestDrive.findById({ _id: body.test_id });



        testDrive!.test_drive_date = body.book_date ? body.book_date : testDrive!.test_drive_date;

        testDrive!.test_drive_time = body.book_time ? body.book_time : testDrive!.test_drive_date;

        testDrive!.user_first_name = body.first_name ? body.first_name : req.user?.first_name;
        testDrive!.user_last_name = body.last_name ? body.last_name : req.user?.last_name;
        testDrive!.user_contact = req.user?.mobile;
        testDrive!.user_address = body.drive_full_address ?? '';
        testDrive!.user_landmark = body.landmark ?? '';
        testDrive!.user_city = body.city ?? '';
        testDrive!.user_state = body.state ?? '';
        testDrive!.test_drive_date = body.book_date ?? '';
        testDrive!.test_drive_time = body.book_time ?? '';
        testDrive!.experience_center = body.experience_center ?? '';
        testDrive!.user_lat = '';
        testDrive!.user_long = '';
        testDrive!.product_id = body.product_id ?? testDrive!.product_id;
        testDrive!.pin_code = body.pincode ?? '';
        testDrive!.user_id = req.user?._id ?? testDrive!.user_id;
        testDrive!.test_status = 1;

        testDrive!.car_cancel_reason = ''
        testDrive!.car_cancel_description = '';

        const product = await Products.findById({ _id: testDrive!.product_id });

        const salesForceReSchuduleTestDrive = {
            "IsTestDrive": "Yes",
            "AccountWrap": {
                "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                "Phone": req.user?.mobile,
                "FirstName": body.first_name ? body.first_name : req.user?.first_name !== '' && req.user?.first_name !== undefined ? req.user?.first_name : 'User',
                "LastName": body.last_name ? body.last_name : req.user?.last_name !== '' && req.user?.last_name !== undefined ? req.user?.last_name : 'User',
                "BillingStreet": body.drive_full_address ?? '',
                "BillingCity": body.city ?? '',
                "BillingState": body.state ?? '',
                "BillingPostalCode": body.pincode ?? '',
                "BillingCountry": "India"
            },
            "OpportunityWrap": {
                "OpportunityId": testDrive!.test_drive_OpportunityId,
                "Appointment_Status": "Re-Scheduled",
                "Name": testDrive!.car_name,
                "Location": testDrive!.car_location,
                "Preferred_Date": body.book_date ?? '',
                "Preferred_Time": body.book_time ?? '',
                "OpportunityLineItemWrap": {
                    "Product2Id": product!.sales_force_id
                }
            }
        }


        // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceReSchuduleTestDrive, {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }).then(async (response) => {

        // }).catch((e) => {

        // });

        await testDrive!.save();

        res.status(200).json({ status: 1, message: `Your Test Drive for  ${testDrive!.car_name} has been Re-Scheduled successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { createOrder, updateOrderDetails, getOrderDetails, getAllOrdersDetails, cancelUserOrder, fetchAllTestDrives, cancelUsertestDrive, reScheduleUserTestDrive, };