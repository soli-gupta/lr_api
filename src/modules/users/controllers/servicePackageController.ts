import { Request, Response } from "express";
import Brands from "../../brand/model/brand";
import Fuel from "../../admin/models/fuel";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import BookServicePackage from "../models/service-package";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import Orders from "../models/orders";
import fs from "fs";
import path from "path";
import Faq from "../../faqs/models/faqs";

const insuranceDIR = 'public/service-package/insurance-copy/';
const rcDIR = '/public/service-package/rc-certificate/';
const insuranceImgPath = path.join(process.cwd(), '/public/service-package/insurance-copy/');
const rcImagePath = path.join(process.cwd(), '/public/service-package/rc-certificate/');

const fetchBrandList = async (req: Request, res: Response) => {
    try {
        const brandDIR = 'public/brands/';
        const brands: any = [];

        const brandList = await Brands.find({}).sort({ logo_sorting: 1 }).where({ brand_status: 1 });

        if (!brandList) {
            return res.status(400).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }

        brandList.forEach((brand) => {
            brands.push({
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
                logo: brand.brand_logo ? brandDIR + brand.brand_logo : '',
                status: brand.brand_status
            })
        });

        res.status(200).json({ status: 1, brands });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllFuelType = async (req: Request, res: Response) => {
    try {
        const fuelDIR = 'public/fuel-type/';
        const fuels: any = [];

        const fuelTypes = await Fuel.find({}).where({ fuel_status: 1 });
        if (!fuelTypes) {
            return res.status(400).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }
        fuelTypes.forEach((fuel) => {
            fuels.push({
                _id: fuel._id,
                fuel_name: fuel.fuel_name,
                fuel_slug: fuel.fuel_slug,
                suel_status: fuel.fuel_status,
                cratedAt: fuel.createdAt,
                updatedAt: fuel.updatedAt,
                fuel_image: fuel.fuel_image ? fuelDIR + fuel.fuel_image : ''
            })
        });
        res.status(200).json({ status: 1, fuels });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const bookServicePackage = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;

        const packageData = {
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
            form_step: body.form_step,
            order_id: 'LR-SP-' + Date.now() + '-' + Math.round(Math.random() * 1e9),
            order_type: body.order_type,
            order_user_id: req.user?._id,
            order_status: 4,
        }

        const servicePackage = new Orders(packageData);
        await servicePackage.save();

        res.status(201).json({ status: 1, message: `Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.`, orderId: servicePackage._id });
    } catch (e) {
        res.status(500).json({ status: 0, messsage: 'Somethig went wrong.' })
    }
}


const updateServicePackage = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const servicePackage = await Orders.findById({ _id });

        if (!servicePackage) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        if (body.form_step === 2) {
            servicePackage.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            servicePackage.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            servicePackage.user_email_id = req.user?.email ? req.user?.email : '';
            servicePackage.form_step = body.form_step;
            servicePackage.service_center_name = body.preferred_center_name;
            servicePackage.service_center_address = body.preferred_center_address;
        } else if (body.form_step === 3) {
            servicePackage.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            servicePackage.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            servicePackage.user_email_id = req.user?.email ? req.user?.email : '';
            servicePackage.form_step = body.form_step;
            servicePackage.user_address_type = body.user_address_type;
            servicePackage.user_full_address = body.user_full_address;



        } else if (body.form_step === 4) {
            // servicePackage.service_center_name = body.preferred_center_name;
            // servicePackage.service_center_address = body.preferred_center_address;


            servicePackage.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            servicePackage.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            servicePackage.user_email_id = req.user?.email ? req.user?.email : '';
            servicePackage.form_step = body.form_step;
            servicePackage.vehicle_inspaction_date = body.inspaction_date;
            servicePackage.vehicle_inspaction_time = body.inspaction_time;

        } else if (body.form_step === 5) {
            servicePackage.user_first_name = req.user?.first_name ? req.user?.first_name : '';
            servicePackage.user_last_name = req.user?.last_name ? req.user?.last_name : '';
            servicePackage.user_email_id = req.user?.email ? req.user?.email : '';
            servicePackage.order_payment_type = body.payment_type
            servicePackage.form_step = body.form_step;
            servicePackage.order_status = 1;

            servicePackage.vehicle_inspaction_date = body.inspaction_date;
            servicePackage.vehicle_inspaction_time = body.inspaction_time;

        }

        await servicePackage.save();

        res.status(201).json({ status: 1, message: `Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.`, orderId: servicePackage!._id });
    } catch (e) {
        res.status(500).json({ status: 0, messsage: 'Somethig went wrong.' })
    }
}

const fetchServiceCenters = async (req: Request, res: Response) => {
    try {
        const serviceCenterDIR = 'public/experience-center/';
        const serviceCenter: any = [];
        const getserviceCenters = await ExperienceCenter.find({ 'center_name': { $in: ["Karnal", "Delhi"] } }).limit(3).sort({ page_sorting: 1 }).where({ center_status: 1 });

        if (!getserviceCenters) {
            return res.status(404).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }

        getserviceCenters.forEach((center) => {
            serviceCenter.push({
                _id: center._id,
                name: center.center_name,
                slug: center.center_slug,
                state: center.center_state,
                city: center.center_city,
                address: center.center_full_address,
                address_google_url: center.center_google_address_url,
                banner: center.center_banner ? serviceCenterDIR + center.center_banner : '',
                service_center_banner: center.service_center_banner ? serviceCenterDIR + center.service_center_banner : '',
                car_care_banner: center.car_care_banner ? serviceCenterDIR + center.car_care_banner : '',
                short_description: center.short_description,
                center_area: center.center_area,
                center_car_bay: center.center_car_bay,
                center_daily_service: center.center_daily_service,
                status: center.center_status,
                createdAt: center.createdAt,
                updatedAt: center.updatedAt
            })
        });

        res.status(200).json({ status: 1, experience_center: serviceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllCarServiceCenters = async (req: Request, res: Response) => {
    try {
        const serviceCenterDIR = 'public/experience-center/';
        const serviceCenter: any = [];
        const getserviceCenters = await ExperienceCenter.find({ 'center_name': { $in: ["Gurugram", "Head Office", "Delhi", "Karnal"] } }).limit(4).sort({ page_sorting: 1 }).where({ center_status: 1 });

        if (!getserviceCenters) {
            return res.status(404).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }

        getserviceCenters.forEach((center) => {
            serviceCenter.push({
                _id: center._id,
                title: center.center_title,
                name: center.center_name,
                slug: center.center_slug,
                state: center.center_state,
                city: center.center_city,
                address: center.center_full_address,
                address_google_url: center.center_google_address_url,
                banner: center.center_banner ? serviceCenterDIR + center.center_banner : '',
                service_center_banner: center.service_center_banner ? serviceCenterDIR + center.service_center_banner : '',
                car_care_banner: center.car_care_banner ? serviceCenterDIR + center.car_care_banner : '',
                short_description: center.short_description,
                center_area: center.center_area,
                center_car_bay: center.center_car_bay,
                center_daily_service: center.center_daily_service,
                status: center.center_status,
                createdAt: center.createdAt,
                updatedAt: center.updatedAt
            })
        });

        res.status(200).json({ status: 1, experience_center: serviceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const uploadDocsAfterOrer = async (req: Request, res: Response) => {
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

const fetchAllFAQsByPage = async (req: Request, res: Response) => {
    try {
        const slug: any = req.params.slug;

        const faqs = await Faq.find({ faq_type: slug }).where({ faq_status: 1 }).sort({ createdAt: -1 });

        if (!faqs) {
            return res.status(400).json({ status: 2, message: `No FAQs data found.` });
        }

        res.status(200).json({ status: 1, faqs });

    } catch (e) {
        res.status(500).json({ status: 0, message: `Something went wrong.` });
    }
}



export { fetchBrandList, fetchAllCarServiceCenters, fetchAllFuelType, bookServicePackage, fetchServiceCenters, uploadDocsAfterOrer, updateServicePackage, fetchAllFAQsByPage }