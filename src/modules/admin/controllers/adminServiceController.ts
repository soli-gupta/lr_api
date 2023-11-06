import { Request, Response, NextFunction } from "express";
import Services from "../../service/models/services";
import { createSlug } from "../../../helpers/common_helper";
import path from 'path'
import fs from 'fs'
import ServicesDemo from "../../service/models/demo-service";
import ServiceDiscount from "../../service/models/service-discount";

const serviceFilePath = path.join(process.cwd(), '/public/upload_service_file/');
const DIR = 'public/fuel-type/'
let csv = require('csvtojson')
// let XLSX = require('xlsx')


const createServices = async (req: Request, res: Response) => {
    try {
        // var workbook = XLSX.readFile(req.file?.path)
        // var sheet_namelist = workbook.SheetNames
        // var x = 0;
        // sheet_namelist.forEach(ele => {
        //     var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
        //     ServicesDemo.insertMany(xlData)
        // })
        // console.log(req.body)
        // return false
        let carData: any = []
        csv()
            .fromFile(req.file?.path)
            .then(async (response: any) => {
                for (var x = 1; x < response.length; x++) {
                    console.log(typeof Number(response[x].Price.replaceAll(',', '')))
                    console.log(Number(response[x].Price.replaceAll(',', '')))
                    carData.push({
                        brand_name: response[x].Make,
                        model_name: response[x].Model,
                        variant_name: response[x].Variant,
                        Year: response[x].Year,
                        fuel_type: response[x].Fuel_Type,
                        service_price: Number(response[x].Price.replaceAll(',', '')),
                        service_category_id: req.body.service_category_id,
                        service_sub_category_id: req.body.service_sub_category_id
                    });
                }
                await ServicesDemo.insertMany(carData)
                res.status(201).json({ status: 1, message: "Your service created successfully" })
            });

        return false
        const data = {
            brand_id: req.body.brand_id,
            brand_name: req.body.brand_name,
            model_id: req.body.model_id,
            model_name: req.body.model_name,
            variant_id: req.body.variant_id,
            variant_name: req.body.variant_name,
            fuel_type: req.body.fuel_type,
            // body_type: req.body.body_type,
            service_category_id: req.body.service_category_id,
            service_sub_category_id: req.body.service_sub_category_id,
            // service_name: req.body.service_name,
            // service_slug: await createSlug(req.body.service_name),
            service_price: req.body.service_price,
            // service_taken_hours: req.body.service_taken_hours,
            // service_short_description: req.body.service_short_description,
            // service_description: req.body.service_description,
            // service_recommend: req.body.service_recommend,
            // service_sorting: req.body.service_sorting
        }
        const services = new Services(data)
        services.save()
        res.status(201).json({ status: 1, message: "Your service created successfully" })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const servicesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services: any = [];
        const carData: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;

        var dbcourse: any = [];
        var discountData: any = [];

        // Finding courses of category Database


        // const array = await ServicesDemo.find()
        // const output: any = []
        // const promises = array.map(async (item) => {
        //     const it = await ServiceDiscount.find({}).where({ service_category_id: item.service_category_id }).populate([
        //         { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
        //         // { path: "service_sub_category_id", select: ["service_sub_category_name", "service_price"] }
        //     ])
        //     // item.service_category_id = it.service_category_id
        //     console.log(it)
        //     output.push(item)
        // })
        // await Promise.all(promises)
        // return res.json({ data: output })


        const getServices = await ServicesDemo.find({}).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_price"] }
        ]).skip(skip).limit(limit);

        // ServicesDemo.find({}).populate([
        //     { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
        //     { path: "service_sub_category_id", select: ["service_sub_category_name", "service_price"] }
        // ]).skip(skip).limit(limit)
        //     .then(data => {
        //         console.log("Database Courses:")
        //         // console.log(data);
        //         data.map((d, k) => {
        //             dbcourse.push(d.service_category_id);
        //         })
        //         ServiceDiscount.find({ service_category_id: { $in: dbcourse } })
        //             .then(disdata => {
        //                 console.log("Students in Database Courses:")
        //                 // console.log(disdata);
        //                 disdata.map((value, k) => {
        //                     discountData.push(value);
        //                 })
        //                 return res.status(400).send({ status: 1, data: discountData });
        //             })
        //             .catch(error => {
        //                 console.log(error);
        //             })

        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
        // return false
        // const getServices = await Services.find({}).populate([
        //     { path: "brand_id", select: ["brand_name", "brand_slug"] },
        //     { path: "model_id", select: ["model_name", "model_slug"] },
        //     { path: "variant_id", select: ["variant_name", "variant_slug"] },
        //     { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
        //     { path: "service_sub_category_id", select: ["service_sub_category_name", "service_price"] }
        // ]).skip(skip).limit(limit);

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                // brand_id: servicesData.brand_id,
                // model_id: servicesData.model_id,
                // variant_id: servicesData.variant_id,
                brand_name: servicesData.brand_name,
                model_name: servicesData.model_name,
                variant_name: servicesData.variant_name,
                fuel_type: servicesData.fuel_type,
                body_type: servicesData.body_type,
                service_category: servicesData.service_category_id,
                service_sub_category: servicesData.service_sub_category_id,
                // service_name: servicesData.service_name,
                service_price: servicesData.service_price,
                // service_taken_hours: servicesData.service_taken_hours,
                // service_short_description: servicesData.service_short_description,
                // service_description: servicesData.service_description,
                // service_sorting: servicesData.service_sorting,
                // service_recommend: servicesData.service_recommend,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: services, countService: services.length });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        // const getServices = await Services.findById({ _id }).populate([
        //     { path: "brand_id", select: ["brand_name", "brand_slug"] },
        //     { path: "model_id", select: ["model_name", "model_slug"] },
        //     { path: "variant_id", select: ["variant_name", "variant_slug"] },
        //     { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
        // ])
        const getServices = await ServicesDemo.findById({ _id }).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_price"] }
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateService = async (req: Request, res: Response) => {
    try {

        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const service = await ServicesDemo.findById({ _id })!
        // service!.brand_id = req.body.brand_id ? req.body.brand_id : service!.brand_id
        // service!.brand_name = req.body.brand_name ? req.body.brand_name : service!.brand_name
        // service!.model_id = req.body.model_id ? req.body.model_id : service!.model_id
        // service!.model_name = req.body.model_name ? req.body.model_name : service!.model_name
        // service!.variant_id = req.body.variant_id ? req.body.variant_id : service!.variant_id
        // service!.variant_name = req.body.variant_name ? req.body.variant_name : service!.variant_name
        // service!.fuel_type = req.body.fuel_type ? req.body.fuel_type : service!.fuel_type
        // service!.body_type = req.body.body_type ? req.body.body_type : service!.body_type
        service!.service_category_id = req.body.service_category_id ? req.body.service_category_id : service!.service_category_id
        service!.service_price = req.body.service_price ? req.body.service_price : service!.service_price

        service!.service_sub_category_id = req.body.service_sub_category_id ? req.body.service_sub_category_id : service!.service_sub_category_id
        // service!.service_name = req.body.name ? req.body.name : service!.service_name
        // service!.service_slug = req.body.name ? await createSlug(req.body.slug) : service!.service_slug
        // service!.service_price = req.body.service_price ? req.body.service_price : service!.service_price
        // service!.service_taken_hours = req.body.service_taken_hours ? req.body.service_taken_hours : service!.service_taken_hours
        // service!.service_recommend = req.body.service_recommend ? req.body.service_recommend : service!.service_recommend
        // service!.service_sorting = req.body.slug ? req.body.sorting : service!.service_sorting
        await service!.save()
        res.status(200).json({ status: 1, message: `service updated successfully!`, data: service })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveService = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const services = await Services.findById({ _id })

        if (!services) {
            res.status(404).json({ status: 0, message: 'services not found!' });
        }

        services!.status = status

        await services!.save();
        res.status(200).json({ status: 1, message: `Service status updated successfully!`, data: services })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


export { createServices, servicesList, viewServices, updateService, activeDeactiveService }