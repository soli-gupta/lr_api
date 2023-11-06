import { Request, Response, NextFunction } from "express";
import path from 'path'
import CarCares from "../../car-care/models/car-cares";
const serviceFilePath = path.join(process.cwd(), '/public/upload_car_care_file/');

let csv = require('csvtojson')
// let XLSX = require('xlsx')


const createCarCarePackage = async (req: Request, res: Response) => {
    try {
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
                        car_care_color: response[x].Color,
                        car_care_price: Number(response[x].Price.replaceAll(',', '')),
                        car_care_category_id: req.body.car_care_category_id,
                        car_care_sub_category_id: req.body.car_care_sub_category_id
                    });
                }
                await CarCares.insertMany(carData)
                res.status(201).json({ status: 1, message: "Your Car Care Package created successfully" })
            });

    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const carCarePackageList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services: any = [];
        const carData: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;


        const getServices = await CarCares.find({}).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_price"] }
        ]).skip(skip).limit(limit);

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                brand_name: servicesData.brand_name,
                model_name: servicesData.model_name,
                car_care_category: servicesData.car_care_category_id,
                car_care_sub_category: servicesData.car_care_sub_category_id,
                car_care_color: servicesData.car_care_color,
                car_care_price: servicesData.car_care_price,
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

const viewCarCarePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const getServices = await CarCares.findById({ _id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_price"] }
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateCarCarePackage = async (req: Request, res: Response) => {
    try {

        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const carcare = await CarCares.findById({ _id })!
        carcare!.car_care_category_id = req.body.car_care_category_id ? req.body.car_care_category_id : carcare!.car_care_category_id
        carcare!.car_care_price = req.body.car_care_price ? req.body.car_care_price : carcare!.car_care_price

        carcare!.car_care_sub_category_id = req.body.car_care_sub_category_id ? req.body.car_care_sub_category_id : carcare!.car_care_sub_category_id
        await carcare!.save()
        res.status(200).json({ status: 1, message: `Car Car Package updated successfully!`, data: carcare })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveCarCarePackage = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const services = await CarCares.findById({ _id })

        if (!services) {
            res.status(404).json({ status: 0, message: 'Car care package not found!' });
        }

        services!.status = status

        await services!.save();
        res.status(200).json({ status: 1, message: `Car Care Package status updated successfully!`, data: services })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


export { createCarCarePackage, carCarePackageList, viewCarCarePackage, updateCarCarePackage, activeDeactiveCarCarePackage }