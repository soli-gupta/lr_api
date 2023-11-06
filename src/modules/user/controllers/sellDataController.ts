"use strict";
import { Request, Response, NextFunction } from "express";
import {
    base64Encode,
    convertTimeStamp,
    generateRequestID,
} from "../../../helpers/common_helper";
import * as dotenv from "dotenv";
import Sell from "../model/sell";
// import fs from "fs";
import path from "path";
import { sendEmail } from "../../../helpers/common_helper";

dotenv.config();
var request = require("request");
var fs = require("fs");

const SellCarCertificatePath = path.join(process.cwd(), "/public/sell/car-certificate/");
const SellCertDIR = "public/sell/car-certificate/";

const SellCarInsurance = path.join(process.cwd(), "/public/sell/car-insurance/");
const SellCarInsuranceDIR = "public/sell/car-insurance/";

const createSellData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        let data = {
            Is_Sell_Evaluation: "Yes",
            Evaluation_Stage: "1",
            AccountWrap: {
                "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                Phone: req.user!.mobile,
            },
            OpportunityWrap: {
                Name:
                    req.body.brand_name +
                    " " +
                    req.body.model_name +
                    " " +
                    req.body.variant_name,
                Kms_Driven: req.body.kms,
                Make: req.body.brand_name,
                Model: req.body.model_name,
                Manufacturing_Year: req.body.year,
                Variant: req.body.variant_name,
                Owner_Serial: req.body.ownership,
                OpportunityLineItemWrap: {},
            },
        };
        // request(
        //     {
        //         url: url,
        //         method: "POST",
        //         json: true, // <--Very important!!!
        //         body: data,
        //     },
        //     async function (error: any, response: any, body: any) {
        //         if (error) {
        //             console.log(error);
        //             return res.status(500).json({ status: 0, message: error });
        //         } 
        // else if (response.body.AccountId) {
        // let salesforce_account_id = response.body.AccountId;
        // let salesforce_opportunity_id = response.body.OpportunityId;
        // let userEmail = "kamlesh.kumar@luxuryride.in"
        // let ccEmail = "raghavendra.dixit@grapesdigital.com"
        let userEmail = "neeraj.sharma@luxuryride.in"
        let ccEmail = ["sumit.garg@luxuryride.in", "himanshu.arya@luxuryride.in"]
        let subject = `Sell Request For : ${req.user!.mobile}"`
        let message = `<p>Hello Neeraj,<br/>Hope you are well.</p><p>Kindly assign the following <b>Sell Request</b> lead:</p>
        <table style="width:100%,padding:10px" border="1px solid black">
            <tr>
                <th style="padding:5px">Brand(Make)</th>
                <th style="padding:5px">Model</th>
                <th style="padding:5px">Variant</th>
                <th style="padding:5px">Year</th>
                <th style="padding:5px">Ownership</th>
                <th style="padding:5px">Kms Driven</th> 
                <th style="padding:5px">Contact</th>
                <th style="padding:5px">Created At</th>
            </tr>
            <tr>
                <td style="padding:5px">${req.body.brand_name}</td>
                <td style="padding:5px">${req.body.model_name}</td>
                <td style="padding:5px">${req.body.variant_name}</td> 
                <td style="padding:5px">${req.body.year}</td>
                <td style="padding:5px">${req.body.ownership}${req.body.ownership === '1' ? 'st' : req.body.ownership === '2' ? 'nd' : req.body.ownership === '3' ? 'rd' : ''}</td>
                <td style="padding:5px">${req.body.kms ? Number(req.body.kms).toLocaleString('en-US') : ''}</td>
                <td style="padding:5px">${req.user!.mobile}</td>
                <td style="padding:5px">${convertTimeStamp(new Date())}</td>
            </tr>
        </table>
        <br/>
        <p> Regards,<br/>Team Luxury Ride</p>`
        const sellInfo = {
            user_id: req.user!._id,
            // salesforce_account_id: salesforce_account_id,
            // salesforce_opportunity_id: salesforce_opportunity_id,
            brand_id: req.body.brand_id ?? req.body.brand_id,
            brand_name: req.body.brand_name ?? req.body.brand_name,
            year: req.body.year ?? req.body.year,
            model_id: req.body.model_id ?? req.body.model_id,
            model_name: req.body.model_name ?? req.body.model_name,
            variant_id: req.body.variant_id ?? req.body.variant_id,
            variant_name: req.body.variant_name ?? req.body.variant_name,
            ownership: req.body.ownership ?? req.body.ownership,
            step_form: req.body.step_form,
            kms: req.body.kms ?? req.body.kms,
            user_mobile: req.user!.mobile ?? req.user!.mobile,
            request_id: await generateRequestID(),
            status: 5,
        };

        const sell = new Sell(sellInfo);
        await sell.save();
        sendEmail(userEmail, ccEmail, subject, message).catch(console.error)
        // if (!req.user!.salesforce_account_id) {
        //     req.user!.salesforce_account_id = response.body.AccountId;
        //     req.user?.save();
        // }
        res.status(200).json({
            status: 1,
            message: `Your appointment for home inspection is booked. Your Sell request ID ${sell.request_id}`,
            sell: sell,
            lastInsertId: sell._id,
            requestId: sell.request_id,
        });
        // }
        //  else {
        //     res.status(500).json({ status: 0, message: "error" });
        // }
        // }
        // );
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const editSellData = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.query.id;
    // console.log(req.query.id)
    const getSellData = await Sell.findOne({ user_id: req.user!._id })
        .populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name", "variant_slug"] },
        ])
        .sort({ createdAt: -1 });
    res.status(200).json({ status: 1, data: getSellData });
};

const editSellRequestData = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const getSellData = await Sell.findById({ _id })
            .where({ user_id: req.user!._id })
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 1, data: getSellData });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const updateRequestData = async (req: Request, res: Response) => {
    //  console.log(req.body)
    try {
        const _id = req.params.id;
        const sell = await Sell.findById({ _id });
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        if (req.body.step_form === "2") {
            let defaultUser = req.user!.first_name + " " + req.user!.last_name;
            let currentUser = req.body.first_name + " " + req.body.last_name;
            sell!.step_form = req.body.step_form;
            sell!.user_name = currentUser ? currentUser : defaultUser;
            sell!.user_email = req.body.email ? req.body.email : sell!.user_email;
            let data = {
                Is_Sell_Evaluation: "Yes",
                Evaluation_Stage: "2",
                AccountWrap: {
                    AccountId: sell!.salesforce_account_id,
                    FirstName: req.body.first_name
                        ? req.body.first_name
                        : req.user!.first_name
                            ? req.user!.first_name
                            : "",
                    LastName: req.body.last_name
                        ? req.body.last_name
                        : req.user!.last_name
                            ? req.user!.last_name
                            : "",
                    PersonEmail: req.body.email ? req.body.email : sell!.user_email,
                },
            };
            // request(
            // {
            //     url: url,
            //     method: "POST",
            //     json: true,
            //     body: data,
            // },
            // async function (error: any, response: any, body: any) {
            // console.log(response.body);
            // if (error) throw new Error(error);
            // if (response.body) {
            await sell!.save();
            res.status(200).json({ status: 1, sell: sell });
            // }
            // }
            // );
        }

        if (req.body.step_form === "3") {
            sell!.step_form = req.body.step_form;
            sell!.address_type = req.body.address_type
                ? req.body.address_type
                : sell!.address_type;
            sell!.full_address = req.body.full_address
                ? req.body.full_address
                : sell!.full_address;
            sell!.state = req.body.state ? req.body.state : sell!.state;
            sell!.city = req.body.city ?? req.body.city;
            sell!.pincode = req.body.pincode ?? req.body.pincode;
            const data = {
                Is_Sell_Evaluation: "Yes",
                Evaluation_Stage: "3",
                AccountWrap: {
                    AccountId: sell!.salesforce_account_id,
                    BillingStreet: req.body.full_address
                        ? req.body.full_address
                        : sell!.full_address,
                    BillingCity: req.body.city ?? req.body.city,
                    BillingState: req.body.state ? req.body.state : sell!.state,
                    BillingPostalCode: req.body.pincode ?? req.body.pincode,
                    BillingCountry: "India",
                },
            };
            // request(
            //     {
            //         url: url,
            //         method: "POST",
            //         json: true,
            //         body: data,
            //     },
            // async function (error: any, response: any, body: any) {
            // console.log(response.body);
            // if (error) throw new Error(error);
            // if (response.body) {
            await sell!.save();
            res.status(200).json({ status: 1, sell: sell });
            // }
            //     }
            // );
        }

        if (req.body.step_form === "4") {
            sell!.step_form = req.body.step_form;
            sell!.slot_time = req.body.slot_time
                ? req.body.slot_time
                : sell!.slot_time;
            sell!.slot_date = req.body.slot_day ? req.body.slot_day : sell!.slot_date;

            // const data = {
            //     Is_Sell_Evaluation: "Yes",
            //     Evaluation_Stage: "4",
            //     OpportunityWrap: {
            //         OpportunityId: sell!.salesforce_opportunity_id,
            //         Preferred_Date: req.body.slot_day
            //             ? req.body.slot_day
            //             : sell!.slot_date,
            //         Preferred_Time: req.body.slot_time
            //             ? req.body.slot_time
            //             : sell!.slot_time,
            //     },
            // };
            // request(
            //     {
            //         url: url,
            //         method: "POST",
            //         json: true, // <--Very important!!!
            //         body: data,
            //     },
            // async function (error: any, response: any, body: any) {
            // console.log(response.body);
            // if (error) throw new Error(error);
            // if (response.body) {
            await sell!.save();
            res.status(200).json({ status: 1, sell: sell });
            // }
            //     }
            // );
        }
        if (req.body.step_form === "5") {
            console.log(req.body.step_form)
            sell!.step_form = req.body.step_form;
            sell!.status = 1;
            // const data = {
            //     Is_Sell_Evaluation: "Yes",
            //     Evaluation_Stage: "5",
            //     OpportunityWrap: {
            //         OpportunityId: sell!.salesforce_opportunity_id,
            //         Appointment_Status: "Confirmed",
            //     },
            // };
            // request(
            //     {
            //         url: url,
            //         method: "POST",
            //         json: true,  
            //         body: data,
            //     },
            // async function (error: any, response: any, body: any) {
            // console.log(response.body);
            // if (error) throw new Error(error);
            // if (response.body) {
            await sell!.save();
            res.status(200).json({ status: 1, sell: sell });
            // }
            // }
            // );
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const updateSellData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.body.id;
        const sell = await Sell.findById({ _id });
        let base64 = ''
        let base641 = ''
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        if (req.body.id && req.body.expected_sell_price) {
            if (!sell) {
                return res.status(404).json({ status: 0, message: "Data Not found!" });
            }
            sell.expected_sell_price = req.body.expected_sell_price
                ? req.body.expected_sell_price
                : sell.expected_sell_price;

            // const data = {
            //     Is_Sell_Evaluation: "Yes",
            //     Evaluation_Stage: "6",
            //     OpportunityWrap: {
            //         OpportunityId: sell!.salesforce_opportunity_id,
            //         Expected_Selling_Price: req.body.expected_sell_price
            //             ? req.body.expected_sell_price
            //             : sell.expected_sell_price,
            //     },
            // };
            // request(
            //     {
            //         url: url,
            //         method: "POST",
            //         json: true,
            //         body: data,
            //     },
            // async function (error: any, response: any, body: any) {
            // console.log(response.body);
            // if (error) throw new Error(error);
            // if (response.body) {
            await sell.save();
            res.status(200).json({
                status: 1,
                message: "Your expected sell price added successfully",
                price: sell.expected_sell_price,
            });
            //         }
            //     }
            // );
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {
            if (
                files.rc_registration_certificate &&
                files.rc_registration_certificate[0].fieldname ===
                "rc_registration_certificate"
            ) {
                base64 = fs.readFileSync(files.rc_registration_certificate[0].path, 'base64');

                const carCertificate = files.rc_registration_certificate[0].filename
                    ? files.rc_registration_certificate[0].filename
                    : sell!.rc_registration_certificate;
                if (sell!.rc_registration_certificate) {
                    fs.unlinkSync(
                        SellCarCertificatePath + sell!.rc_registration_certificate
                    );
                }
                sell!.rc_registration_certificate = carCertificate;
            }
            if (
                files.car_insurance &&
                files.car_insurance[0].fieldname === "car_insurance"
            ) {
                const carInsurance = files.car_insurance[0].filename
                    ? files.car_insurance[0].filename
                    : sell!.car_insurance;
                base641 = fs.readFileSync(files.car_insurance[0].path, 'base64');
                if (sell!.car_insurance) {
                    fs.unlinkSync(SellCarInsurance + sell!.car_insurance);
                }
                sell!.car_insurance = carInsurance;
            }
            // let docData = {
            //     "Is_Sell_Evaluation": "Yes",
            //     "AccountWrap": {
            //         "AccountId": sell!.salesforce_account_id,
            //     },
            //     "OpportunityWrap": {
            //         "Name": sell!.brand_name + " " + sell!.model_name + " " + sell!.variant_name,
            //         "OpportunityId": sell!.salesforce_opportunity_id,
            //         "OpportunityLineItemWrap": {},
            //         "FilesTOBeUploaded": [
            //             {
            //                 "FileName": files.rc_registration_certificate ? files.rc_registration_certificate[0].originalname : '',
            //                 "Base64": base64,
            //             },
            //             {
            //                 "FileName": files.car_insurance && files.car_insurance[0].originalname ? files.car_insurance[0].originalname : '',
            //                 "Base64": base641 ? base641 : '',
            //             },
            //         ],
            //     },
            // };
            // request(
            //     {
            //         url: url,
            //         method: "POST",
            //         json: true,
            //         body: docData,
            //     },
            // async function (error: any, response: any, body: any) {
            //     if (error) throw new Error(error);
            //     console.log(error)
            //     if (response.body) {
            //         console.log(response.body)
            sell!.rc_registration_thumbnail = files.rc_registration_certificate ? files.rc_registration_certificate[0].originalname : sell!.rc_registration_thumbnail
            sell!.car_insurance_thumbnail = files.car_insurance && files.car_insurance[0].originalname ? files.car_insurance[0].originalname : sell!.car_insurance_thumbnail
            await sell!.save();
            //     }
            // }
            // );
            // await sell!.save();
            res
                .status(200)
                .json({ status: 1, messages: "Your document uploaded successfully" });
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const cancelSellRequestData = async (req: Request, res: Response) => {
    try {
        const _id = req.body.id;
        const status = req.body.status;
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        if (!_id) {
            return res.status(400).json({
                status: 0,
                message: "Something went wrong. Please refresh the page and try again!",
            });
        }
        const sell = await Sell.findById({ _id });
        sell!.cancel_reason = req.body.cancel_reason;
        sell!.cancel_reason_dscription = req.body.cancel_reason_dscription;
        sell!.status = status;

        // const data = {
        //     Is_Sell_Evaluation: "Yes",
        //     Evaluation_Stage: "6",
        //     OpportunityWrap: {
        //         OpportunityId: sell!.salesforce_opportunity_id,
        //         Appointment_Status: "Cancelled",
        //         Cancel_Reason: req.body.cancel_reason,
        //         Cancel_Description: req.body.cancel_reason_dscription,
        //     },
        // };
        // request(
        //     {
        //         url: url,
        //         method: "POST",
        //         json: true,
        //         body: data,
        //     },
        // async function (error: any, response: any, body: any) {
        //     console.log(response.body);
        //     if (error) throw new Error(error);
        //     if (response.body) {
        await sell!.save();
        res.status(200).json({
            status: 1, message: "Your evaluation has been cancelled."
        });
        //         }
        //     }
        // );
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const rescheduleSellRequest = async (req: Request, res: Response) => {
    try {
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        const _id = req.body.id;
        if (!_id) {
            return res.status(400).json({
                status: 0,
                message: "Something went wrong. Please refresh the page and try again!",
            });
        }
        const sell = await Sell.findById({ _id });
        sell!.slot_date = req.body.slot_day;
        sell!.slot_time = req.body.slot_time;

        // const data = {
        //     Is_Sell_Evaluation: "Yes",
        //     Evaluation_Stage: "6",
        //     OpportunityWrap: {
        //         OpportunityId: sell!.salesforce_opportunity_id,
        //         Appointment_Status: "Re-Scheduled",
        //         Preferred_Date: req.body.slot_day,
        //         Preferred_Time: req.body.slot_time,
        //     },
        // };
        // request(
        //     {
        //         url: url,
        //         method: "POST",
        //         json: true,
        //         body: data,
        //     },
        // async function (error: any, response: any, body: any) {
        //     console.log(response.body);
        //     if (error) throw new Error(error);
        //     if (response.body) {
        await sell!.save();
        res.status(200).json({
            status: 1,
            message: "Your reschedule evaluation successfully!",
        });
        //         }
        //     }
        // );
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const deleteEvaluationDocument = async (req: Request, res: Response) => {
    try {
        const _id = req.body.id;
        const sell = await Sell.findById({ _id });
        const doc_name = req.body.doc_name;
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;

        // const data = {
        //     "Is_Sell_Evaluation": "Yes",
        //     "AccountWrap": {
        //         "AccountId": sell!.salesforce_account_id
        //         // "Phone": req.user!.mobile
        //     },
        //     "OpportunityWrap": {
        //         "Name": "Product Name",
        //         "OpportunityId": sell!.salesforce_opportunity_id,
        //         "OpportunityLineItemWrap": {
        //         },
        //         "FilesToBeDeleted": [
        //             {
        //                 "FileName": req.body.doc_thumbnail
        //             }
        //         ]
        //     }
        // }
        // console.log(req.user!.mobile)
        // console.log(data)
        // return false
        if (doc_name === sell!.rc_registration_certificate) {
            fs.unlinkSync(SellCarCertificatePath + sell!.rc_registration_certificate);
            sell!.rc_registration_certificate = "";
            sell!.rc_registration_thumbnail = ""
        }
        if (doc_name === sell!.car_insurance) {
            fs.unlinkSync(SellCarInsurance + sell!.car_insurance);
            sell!.car_insurance = "";
            sell!.car_insurance_thumbnail = ""
        }

        // request(
        //     {
        //         url: url,
        //         method: "POST",
        //         json: true,
        //         body: data,
        //     },
        // async function (error: any, response: any, body: any) {
        //     console.log(response);
        //     if (error) throw new Error(error);
        //     if (response.body) {
        await sell!.save();
        res.json({ status: 1, messages: "Your document deleted successfully" });
        //         }
        //     }
        // );

    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
};

const userSellRequestAllList = async (req: Request, res: Response) => {
    try {
        const sellData: any = [];
        let buildQuery: any = {};
        const status: any = req.query.type;
        if (status === "" || status === undefined) {
            buildQuery = "";
        } else if (status === "requested") {
            buildQuery.status = 1;
        } else if (status === "completed") {
            buildQuery.status = 2;
        } else if (status === "cancelled") {
            buildQuery.status = 3;
        }

        const getSellData = await Sell.find({})
            .where({ user_id: req.user!._id })
            .where(buildQuery)
            .sort({ createdAt: -1 });
        if (!getSellData) {
            return res.status(404).json({ status: 0, message: "No data found!" });
        }

        getSellData.forEach((sellRequest) => {
            sellData.push({
                _id: sellRequest._id,
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
                car_insurance: sellRequest.car_insurance
                    ? SellCarInsuranceDIR + sellRequest.car_insurance
                    : "",
                rc_registration_certificate: sellRequest.rc_registration_certificate
                    ? SellCertDIR + sellRequest.rc_registration_certificate
                    : "",
                rc_registration_image_name: sellRequest.rc_registration_certificate,
                rc_registration_thumbnail: sellRequest.rc_registration_thumbnail,
                car_insurance_image_name: sellRequest.car_insurance,
                car_insurance_thumbnail: sellRequest.car_insurance_thumbnail,
                expected_sell_price: sellRequest.expected_sell_price,
                cancel_reason: sellRequest.cancel_reason,
                cancel_reason_description: sellRequest.cancel_reason_dscription,
                status: sellRequest.status,
                createdAt: sellRequest.createdAt,
                updatedAt: sellRequest.updatedAt,
            });
        });
        res.status(200).json({ status: 1, sellData: sellData });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
};

const sellRequestGetCallBack = async (req: Request, res: Response) => {
    try {
        const url = `${process.env.SALES_FORCE_URL}createOppAndAcc`;
        const _id = req.body.id;
        const sell = await Sell.findById({ _id });
        if (!_id) {
            return res.status(400).json({
                status: 0,
                message: "Something went wrong. Please refresh the page and try again!",
            });
        }
        // const data = {
        //     "Is_Sell_Evaluation": "Yes",
        //     "Evaluation_Stage": "6",
        //     "OpportunityWrap": {
        //         "OpportunityId": sell!.salesforce_opportunity_id,
        //         "RequestedCallBack": "Yes"
        //     }
        // }
        // request(
        //     {
        //         url: url,
        //         method: "POST",
        //         json: true,
        //         body: data,
        //     },
        // async function (error: any, response: any, body: any) {
        //     console.log(response.body);
        //     if (error) throw new Error(error);
        //     if (response.body) {
        sell!.requested_callBack = "Yes"
        await sell!.save();
        res.status(200).json({ status: 1, message: "Your call back requested send  successfully!", });
        //         }
        //     }
        // );
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

export {
    createSellData,
    editSellData,
    editSellRequestData,
    updateRequestData,
    updateSellData,
    rescheduleSellRequest,
    userSellRequestAllList,
    cancelSellRequestData,
    deleteEvaluationDocument,
    sellRequestGetCallBack
};
