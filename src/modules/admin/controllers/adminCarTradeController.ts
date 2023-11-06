import { Request, Response } from "express";
import Products from "../../product/models/product-model";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import Fuel from "../models/fuel";
import BodyType from "../models/body-type";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import CarTradeLeads from "../models/car-trade-model";
import axios from "axios";
import { LSQ_ACCESS_KEY, LSQ_SECRET_KEY, LSQ_URL } from "../../../config";

const CarTradeBuyLeadCreate = async (req: Request, res: Response) => {
    try {
        const token = `Luxury Ride eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5Mjc5MDE3MiwiaWF0IjoxNjkyNzkwMTcyfQ.-RPncsQKFFMD0EO7lINFjWZD-0JImN2XQ_sBi40IHPQ`;



        if (token === req.header("Auth-Token")) {
            const body: any = req.body;


            const product = await Products.findById({ _id: body.client_listing_id });

            if (!product) {
                return res.status(400).json({ status: 3, message: 'This action is not allowed at this time. Please create this request again.' })
            }

            const brandName = await Brands.findById({ _id: product.brand_id._id }).select('brand_name');


            const modelName = await BrandModel.findById({ _id: product.model_id._id }).select("model_name");

            const variantName = await ModelVariant.findById({ _id: product.variant_id._id }).select("variant_name");

            const fuelType = await Fuel.findById({ _id: product.fuel_type._id })


            const bodyType = await BodyType.findById({ _id: product.body_type!._id }).select("body_name");

            const productLocation = await ExperienceCenter.findById({ _id: product.product_location._id }).select("center_name");

            // let getLSQBrandName: any = '';
            // if (brandName!.brand_name == 'Mercedes Benz') {
            //     getLSQBrandName = 'Mercedes-Benz';
            // } else if (brandName!.brand_name == 'Mini') {
            //     getLSQBrandName = 'Mini Cooper';
            // }


            // let carTradeData: any = {}

            const carTradeData = {
                product_id: product._id,
                lead_id: body.lead_id,
                lead_date: body.lead_date,
                car_trade_brand: brandName!.brand_name,
                car_trade_model: modelName!.model_name,
                car_trade_variant: variantName!.variant_name,
                car_trade_fuel_type: fuelType!.fuel_name,
                car_trade_registration_year: product.registration_year,
                car_trade_car_ownership: product.product_ownership,
                car_trade_car_amount: product.price,
                car_trade_registration_state: product.registration_state,
                car_trade_car_name: product.product_name,
                car_trade_car_engine: product.engine_cc,
                car_trade_body_type: bodyType!.body_name,
                car_trade_insurance_type: product.insurance_type,
                car_trade_insurance_valid: product.insurance_valid,
                car_trade_car_location: productLocation!.center_name,
                car_trade_user_first_name: body.buyer_first_name,
                car_trade_user_last_name: body.buyer_last_name,
                car_trade_user_contact: body.buyer_contact,
                car_trade_user_city: body.user_city,
                car_trade_lead_type: "Car Trade Buy",
                car_listing_city: body.car_listing_city,
                car_trade_user_email: body.buyer_email,
                car_trade_kms_driven: product.kms_driven,
                car_trade_car_color: product.product_color,
            }

            const createLead = new CarTradeLeads(carTradeData);
            await createLead.save();

            res.status(201).json({ status: 1, message: `Lead addedd successfully.` });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' });
        }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchAllCarTradeBuyLeads = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const LeadType: any = req.query.leadType ? req.query.leadType : '';
        const getLeads: any = [];

        const fetchLeads = await CarTradeLeads.find({ car_trade_lead_type: LeadType }).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!fetchLeads) {
            return res.status(400).json({ status: 0, message: `Not found.` });
        }

        res.status(200).json({ status: 1, leads: fetchLeads });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const updateCarTradeLeadStatus = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const lead = await CarTradeLeads.findById({ _id });
        if (!lead) {
            return res.status(404).json({ status: 0, message: 'Brand not found!' });
        }

        lead.car_trade_status = status;
        await lead.save();
        res.status(200).json({ status: 1, message: `Car Trade Lead updated for ${lead.car_trade_user_first_name} ${lead.car_trade_user_last_name}`, leads: lead })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const viewCarTradeCarDetails = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 2, message: `Something went wrong. Please refresh the page and try again.` });
        }

        const lead = await CarTradeLeads.findById({ _id });
        if (!lead) {
            return res.status(400).json({ status: 2, message: `Order not found.` })
        }
        res.status(200).json({ status: 1, lead });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const getCarTradeLeadsForSell = async (req: Request, res: Response) => {
    try {

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}




export { CarTradeBuyLeadCreate, fetchAllCarTradeBuyLeads, updateCarTradeLeadStatus, viewCarTradeCarDetails }





            // let createLead: any = '';
            // let LSQ_URL_TYPE = 'Update';
            // let lsqLeadData = {};

            // createLead = await CarTradeLeads.findOne({ car_trade_user_contact: body.user_contact }).sort({ createdAt: -1 });


            // lsqLeadData = {
            //     "ProspectOpportunityId": `${carTradeData.lead_id}`,
            //     "OpportunityNote": "Update Lead",
            //     "Fields": [
            //         {
            //             "SchemaName": "mx_Custom_13",
            //             "Fields": [
            //                 {
            //                     "SchemaName": "mx_CustomObject_91",
            //                     "Value": `${carTradeData.car_trade_brand}`
            //                 },
            //                 {
            //                     "SchemaName": "mx_CustomObject_92",
            //                     "Value": `${carTradeData.car_trade_model}`
            //                 },
            //                 {
            //                     "SchemaName": "mx_CustomObject_93",
            //                     "Value": `${carTradeData.car_trade_variant}`
            //                 }
            //             ]
            //         }
            //     ]
            // }

            // if (!createLead) {

            //     LSQ_URL_TYPE = 'Capture';

            //     lsqLeadData = `{
            //         "LeadDetails": [
            //             {
            //                 "Attribute": "EmailAddress",
            //                 "Value": "${createLead.car_trade_user_email ? createLead.car_trade_user_email : ''}"
            //             },
            //             {
            //                 "Attribute": "Phone",
            //                 "Value": "${createLead.car_trade_user_contact}"
            //             },
            //             {
            //                 "Attribute": "SearchBy",
            //                 "Value": "ProspectId"
            //             },
            //             {
            //                 "Attribute": "Notes",
            //                 "Value": ""
            //             },
            //             {
            //                 "Attribute": "Source",
            //                 "Value": "Cartrade/Carwale"
            //             },
            //             {
            //                 "Attribute": "__UseUserDefinedGuid__",
            //                 "Value": "true"
            //             }
            //         ],
            //         "Opportunity": {
            //             "OpportunityEventCode": "12002",
            //             "OpportunityNote": "CarTradeAPI",
            //             "UpdateEmptyFields": "true",
            //             "DoNotPostDuplicateActivity": "true",
            //             "DoNotChangeOwner": "true",
            //             "Fields": [
            //                 {
            //                     "SchemaName": "mx_Custom_1",
            //                     "Value": "${carTradeData.car_trade_user_name}"
            //                 },
            //                 {
            //                     "SchemaName": "mx_Custom_2",
            //                     "Value": "Fresh Lead"
            //                 },
            //                 {
            //                     "SchemaName": "mx_Custom_5",
            //                     "Value": "Fresh Lead"
            //                 },
            //                 {
            //                     "SchemaName": "Status",
            //                     "Value": "Open"
            //                 },
            //                 {
            //                     "SchemaName": "Owner",
            //                     "Value": "kamlesh.kumar@luxuryride.in"
            //                 },
            //                 {
            //                     "SchemaName": "mx_Custom_13",
            //                     "Fields": [
            //                         {
            //                             "SchemaName": "mx_CustomObject_91",
            //                             "Value": "${carTradeData.car_trade_brand}"
            //                         },
            //                         {
            //                             "SchemaName": "mx_CustomObject_92",
            //                             "Value": "${carTradeData.car_trade_model}"
            //                         },
            //                         {
            //                             "SchemaName": "mx_CustomObject_93",
            //                             "Value": "${carTradeData.car_trade_variant}"
            //                         }
            //                     ],
            //                 }
            //             ]
            //         }
            //     }`
            // }


            // console.log('lsqLeadData : ', lsqLeadData);
            // console.log('lsqLeadData URL : ', `${LSQ_URL}OpportunityManagement.svc/${LSQ_URL_TYPE}?accessKey=${LSQ_ACCESS_KEY}&secretKey=${LSQ_SECRET_KEY}`);
            // await axios.post(`${LSQ_URL}OpportunityManagement.svc/${LSQ_URL_TYPE}?accessKey=${LSQ_ACCESS_KEY}&secretKey=${LSQ_SECRET_KEY}`, lsqLeadData, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // }).then((res) => {
            //     console.log('res.data : ', res.data);
            // }).catch(async (e) => {
            //     console.log('E : ', e && e.response && e.response.data ? e.response.data : e.response);
            //     console.log('E : ', e && e.response && e.response.data ? e.response : e.response);
            //     await CarTradeLeads.deleteOne({ _id: createLead._id });
            // })