import { Request, Response } from "express";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import path from "path";
import fs from 'fs';
import { createSlug } from "../../../helpers/common_helper";

const experienceCenterImagePath = path.join(process.cwd(), '/public/experience-center/');
const DIR = 'public/experience-center/';

const createExperienceCenter = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        // console.log('Req Body:', body)
        // return false
        const experienceCenterData = {
            center_title: body.center_title,
            center_name: body.name,
            center_slug: await createSlug(body.name),
            center_state: body.state,
            center_city: body.city,
            center_full_address: body.address,
            short_decription: body.short_description,
            center_area: body.area ?? '',
            center_car_bay: body.car_bay ?? '',
            center_daily_service: body.daily_service ?? '',
            center_sorting: body.sorting ?? '',
            center_google_address_url: body.address_google_url ?? '',
            center_types: body.center_type
            // center_day_and_time: body.day_time ?? '',
            // center_manager_name : body.manager_name,
            // center_manager_mobile : body.manager_mobile,
            // center_manager_email : body.manager_email, 
        }
        const experienceCenter = new ExperienceCenter(experienceCenterData);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {
            // const uploadFile = req.file.filename ? req.file.filename : '';
            // experienceCenter.center_banner = uploadFile;

            if (files.center_banner && files.center_banner[0].fieldname === 'center_banner') {
                const uploadFile = files.center_banner[0].filename ? files.center_banner[0].filename : '';

                experienceCenter.center_banner = uploadFile;
            }
            if (files.service_center_banner && files.service_center_banner[0].fieldname === 'service_center_banner') {
                const serviceCenterBanner = files.service_center_banner[0].filename ? files.service_center_banner[0].filename : '';

                experienceCenter.service_center_banner = serviceCenterBanner;
            }

            if (files.car_care_banner && files.car_care_banner[0].fieldname === 'car_care_banner') {
                const carCareCenterBanner = files.car_care_banner[0].filename ? files.car_care_banner[0].filename : '';

                experienceCenter.car_care_banner = carCareCenterBanner;
            }
        }
        await experienceCenter.save();

        const shareExperienceCenter = {
            _id: experienceCenter._id,
            title: experienceCenter.center_title,
            name: experienceCenter.center_name,
            slug: experienceCenter.center_slug,
            state: experienceCenter.center_state,
            city: experienceCenter.center_city,
            address: experienceCenter.center_full_address,
            banner: experienceCenter.center_banner ? DIR + experienceCenter.center_banner : '',
            service_center_banner: experienceCenter.service_center_banner ? DIR + experienceCenter.service_center_banner : '',
            car_care_banner: experienceCenter.car_care_banner ? DIR + experienceCenter.car_care_banner : '',
            short_description: experienceCenter.short_description,
            address_google_url: experienceCenter.center_google_address_url,
            center_type: experienceCenter.center_types,
            // day_time: experienceCenter.center_day_and_time,
            // manager_name: experienceCenter.center_manager_name,
            // manager_mobile: experienceCenter.center_manager_mobile,
            // manager_email: experienceCenter.center_manager_email,
            status: experienceCenter.center_status,
            createdAt: experienceCenter.createdAt,
            updatedAt: experienceCenter.updatedAt
        }
        res.status(201).json({ status: 1, message: `${experienceCenter.center_name} created successfully!`, experience_center: shareExperienceCenter });



    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }

}

const manageAllExperienceCenter = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const experienceCenter: any = [];
        const getExperienceCenters = await ExperienceCenter.find({}).sort({ _id: -1 }).skip(skip).limit(limit);
        if (!getExperienceCenters) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }
        getExperienceCenters.forEach((center) => {
            experienceCenter.push({
                _id: center._id,
                title: center.center_title,
                name: center.center_name,
                slug: center.center_slug,
                state: center.center_state,
                city: center.center_city,
                address: center.center_full_address,
                address_google_url: center.center_google_address_url,
                // day_time: center.center_day_and_time,
                // manager_name: center.center_manager_name,
                // manager_mobile: center.center_manager_mobile,
                // manager_email: center.center_manager_email,
                banner: center.center_banner ? DIR + center.center_banner : '',
                service_center_banner: center.service_center_banner ? DIR + center.service_center_banner : '',
                car_care_banner: center.car_care_banner ? DIR + center.car_care_banner : '',
                short_description: center.short_description,
                area: center.center_area,
                car_bay: center.center_car_bay,
                daily_service: center.center_daily_service,
                sorting: center.center_sorting,
                status: center.center_status,
                createdAt: center.createdAt,
                updatedAt: center.updatedAt
            })
        });
        res.status(200).json({ status: 1, experience_center: experienceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


const viewExperienceCenter = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const experienceCenter = await ExperienceCenter.findById({ _id });
        if (!experienceCenter) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }
        const shareExperienceCenter = {
            _id: experienceCenter._id,
            title: experienceCenter.center_title,
            name: experienceCenter.center_name,
            slug: experienceCenter.center_slug,
            state: experienceCenter.center_state,
            city: experienceCenter.center_city,
            address: experienceCenter.center_full_address,
            banner: experienceCenter.center_banner ? DIR + experienceCenter.center_banner : '',
            service_center_banner: experienceCenter.service_center_banner ? DIR + experienceCenter.service_center_banner : '',
            car_care_banner: experienceCenter.car_care_banner ? DIR + experienceCenter.car_care_banner : '',
            short_description: experienceCenter.short_description,
            area: experienceCenter.center_area,
            car_bay: experienceCenter.center_car_bay,
            daily_service: experienceCenter.center_daily_service,
            sorting: experienceCenter.center_sorting,
            address_google_url: experienceCenter.center_google_address_url,
            center_type: experienceCenter.center_types,
            // day_time: experienceCenter.center_day_and_time,
            // manager_name: experienceCenter.center_manager_name,
            // manager_mobile: experienceCenter.center_manager_mobile,
            // manager_email: experienceCenter.center_manager_email,
            status: experienceCenter.center_status,
            createdAt: experienceCenter.createdAt,
            updatedAt: experienceCenter.updatedAt
        }
        res.status(200).json({ status: 1, experience_center: shareExperienceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


const updateExperienceCenter = async (req: Request, res: Response) => {
    try {

        const body: any = req.body;
        // console.log(body)
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const experienceCenter = await ExperienceCenter.findById({ _id });

        if (!experienceCenter) {
            return res.status(400).json({ status: 0, message: 'Not found!' });
        }
        experienceCenter.center_title = body.center_title ? body.center_title : experienceCenter.center_title
        experienceCenter.center_name = body.name ? body.name : experienceCenter.center_name;
        experienceCenter.center_slug = body.slug ? body.slug : experienceCenter.center_slug;
        experienceCenter.center_state = body.state ? body.state : experienceCenter.center_state;
        experienceCenter.center_city = body.city ? body.city : experienceCenter.center_city;
        experienceCenter.center_full_address = body.address ? body.address : experienceCenter.center_full_address;
        experienceCenter.short_description = body.short_description ? body.short_description : experienceCenter.short_description;
        experienceCenter.center_area = body.area ? body.area : experienceCenter.center_area;
        experienceCenter.center_car_bay = body.car_bay ? body.car_bay : experienceCenter.center_car_bay;
        experienceCenter.center_daily_service = body.daily_service ? body.daily_service : experienceCenter.center_daily_service;
        experienceCenter.center_sorting = body.sorting ? body.sorting : experienceCenter.center_sorting;
        experienceCenter.center_status = body.status ? body.status : experienceCenter.center_status;
        experienceCenter.center_types = body.center_type ? body.center_type : experienceCenter.center_types;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {
            if (files.center_banner && files.center_banner[0].fieldname === 'center_banner') {
                const uploadFile = files.center_banner[0].filename;
                // if (experienceCenter.center_banner != undefined) {
                //     fs.unlinkSync(experienceCenterImagePath + experienceCenter.center_banner);
                // }
                experienceCenter.center_banner = uploadFile;
            }
            if (files.service_center_banner && files.service_center_banner[0].fieldname === 'service_center_banner') {
                const serviceCenter = files.service_center_banner[0].filename ? files.service_center_banner[0].filename : experienceCenter.service_center_banner;
                if (experienceCenter.service_center_banner != undefined) {
                    fs.unlinkSync(experienceCenterImagePath + experienceCenter.service_center_banner);
                }
                experienceCenter.service_center_banner = serviceCenter;
            }

            // if (files.service_center_banner && files.service_center_banner[0].fieldname === 'service_center_banner') {
            //     const serviceCenter = files.service_center_banner[0].filename ? files.service_center_banner[0].filename : experienceCenter.service_center_banner;
            //     if (experienceCenter.service_center_banner != undefined) {
            //         fs.unlinkSync(experienceCenterImagePath + experienceCenter.service_center_banner);
            //     }
            //     experienceCenter.service_center_banner = serviceCenter;
            // }

            if (files.car_care_banner && files.car_care_banner[0].fieldname === 'car_care_banner') {
                const carCareCenter = files.car_care_banner[0].filename ? files.car_care_banner[0].filename : experienceCenter.car_care_banner;
                if (experienceCenter.car_care_banner != undefined) {
                    fs.unlinkSync(experienceCenterImagePath + experienceCenter.car_care_banner);
                }
                experienceCenter.car_care_banner = carCareCenter;
            }

            // car_care_banner
            // const uploadFile = req.file.filename ? req.file.filename : experienceCenter.center_banner;
            // if (experienceCenter.center_banner) {
            //     fs.unlinkSync(experienceCenterImagePath + experienceCenter.center_banner);
            // }
            // experienceCenter.center_banner = uploadFile;
        }

        await experienceCenter.save();
        const shareExperienceCenter = {
            _id: experienceCenter._id,
            title: experienceCenter.center_title,
            name: experienceCenter.center_name,
            slug: experienceCenter.center_slug,
            state: experienceCenter.center_state,
            city: experienceCenter.center_city,
            address: experienceCenter.center_full_address,
            banner: experienceCenter.center_banner ? DIR + experienceCenter.center_banner : '',
            service_center_banner: experienceCenter.service_center_banner ? DIR + experienceCenter.service_center_banner : '',
            car_care_banner: experienceCenter.car_care_banner ? DIR + experienceCenter.car_care_banner : '',
            short_description: experienceCenter.short_description,
            area: experienceCenter.center_area,
            car_bay: experienceCenter.center_car_bay,
            daily_service: experienceCenter.center_daily_service,
            sorting: experienceCenter.center_sorting,
            address_google_url: experienceCenter.center_google_address_url,
            center_type: experienceCenter.center_types,
            // day_time: experienceCenter.center_day_and_time,
            // manager_name: experienceCenter.center_manager_name,
            // manager_mobile: experienceCenter.center_manager_mobile,
            // manager_email: experienceCenter.center_manager_email,
            status: experienceCenter.center_status,
            createdAt: experienceCenter.createdAt,
            updatedAt: experienceCenter.updatedAt
        }

        res.status(200).json({ status: 1, message: `${experienceCenter.center_name} updated successfully!`, experience_center: shareExperienceCenter });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const blockUnblockExperienceCenter = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: "Something went wrong. Please refresh the page and try again!" });
        }

        const experienceCenter = await ExperienceCenter.findById({ _id });

        experienceCenter!.center_status = status;

        experienceCenter?.save();
        const shareExperienceCenter = {
            _id: experienceCenter!._id,
            title: experienceCenter!.center_title,
            name: experienceCenter!.center_name,
            slug: experienceCenter!.center_slug,
            state: experienceCenter!.center_state,
            city: experienceCenter!.center_city,
            address: experienceCenter!.center_full_address,
            banner: experienceCenter!.center_banner ? DIR + experienceCenter!.center_banner : '',
            service_center_banner: experienceCenter!.service_center_banner ? DIR + experienceCenter!.service_center_banner : '',
            car_care_banner: experienceCenter!.car_care_banner ? DIR + experienceCenter!.car_care_banner : '',
            short_description: experienceCenter!.short_description,
            status: experienceCenter!.center_status,
            createdAt: experienceCenter!.createdAt,
            updatedAt: experienceCenter!.updatedAt
        }
        res.status(200).json({ status: 1, message: `${experienceCenter!.center_name} updated successfully!`, experience_center: shareExperienceCenter });

    } catch (e) {
        res.status(500).json({ status: 0, message: "e" });
    }
}

const fetchExperienceCenter = async (req: Request, res: Response) => {
    try {
        const experienceCenter: any = [];
        const getExperienceCenters = await ExperienceCenter.find({ center_types: 'service' }).where({ center_status: 1 });
        if (!getExperienceCenters) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        getExperienceCenters.forEach((center) => {
            center.center_types.filter((cType) => {
                if (cType === 'showroom') {
                    experienceCenter.push({
                        _id: center._id,
                        title: center.center_title,
                        name: center.center_name,
                        slug: center.center_slug,
                        state: center.center_state,
                        city: center.center_city,
                        address: center.center_full_address,
                        address_google_url: center.center_google_address_url,
                    })
                }
            })
        });

        res.status(200).json({ status: 1, experience_center: experienceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

export { createExperienceCenter, manageAllExperienceCenter, viewExperienceCenter, updateExperienceCenter, blockUnblockExperienceCenter, fetchExperienceCenter }