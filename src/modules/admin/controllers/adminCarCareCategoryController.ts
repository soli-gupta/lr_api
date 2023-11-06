import { Request, Response } from "express";
import ServiceCategory from "../../service/models/service_category";
import CarCareCategory from "../../car-care/models/car-care-category";
import { createSlug } from "../../../helpers/common_helper";
import createHttpError from "http-errors";
import path from 'path'
import fs from 'fs'

const carCareCategoryImagePath = path.join(process.cwd(), '/public/car-care-category/');
const DIR = 'public/car-care-category/'

const createCarCareCategory = async (req: Request, res: Response) => {

    try {

        const data = {
            car_care_category_name: req.body.car_care_category_name,
            car_care_category_slug: req.body.car_care_category_slug ? req.body.car_care_category_slug : await createSlug(req.body.car_care_category_name),
            car_care_category_description: req.body.car_care_category_description ? req.body.car_care_category_description : '',
            car_care_category_sorting: req.body.car_care_category_sorting ? req.body.car_care_category_sorting : ''
        }
        const slug = req.body.car_care_category_slug
        const getCarCareCategory = await CarCareCategory.findOne({ car_care_category_slug: slug })

        if (getCarCareCategory) {
            throw createHttpError(500, "Already exits slug. Please try another.");
        }
        const carCareCategory = new CarCareCategory(data)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            carCareCategory.car_care_category_image = uploadFile;
        }
        await carCareCategory.save()
        const carCareCategoryData = {
            _id: carCareCategory!._id,
            name: carCareCategory.car_care_category_name,
            slug: carCareCategory.car_care_category_slug,
            image: carCareCategory!.car_care_category_image ? DIR + carCareCategory!.car_care_category_image : '',
            description: carCareCategory!.car_care_category_description,
            sorting: carCareCategory!.car_care_category_sorting,
            status: carCareCategory!.car_care_category_status,
            createdAt: carCareCategory!.createdAt,
            updatedAt: carCareCategory!.updatedAt,
        }
        res.status(201).json({ status: 1, message: `${carCareCategory.car_care_category_name} created successfully!`, data: carCareCategoryData })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const carCareCategoryList = async (req: Request, res: Response) => {
    try {
        const carCareCategories: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 10;
        const skip = (page - 1) * limit;
        const getCarCareCategory = await CarCareCategory.find({}).skip(skip).limit(limit);

        if (!getCarCareCategory) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getCarCareCategory.forEach((categories) => {
            carCareCategories.push({
                _id: categories._id,
                name: categories.car_care_category_name,
                slug: categories.car_care_category_slug,
                image: categories.car_care_category_image ? DIR + categories.car_care_category_image : '',
                description: categories.car_care_category_description,
                sorting: categories.car_care_category_sorting,
                status: categories.car_care_category_status,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: carCareCategories });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const viewCarCareCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getCarCareCategory = await CarCareCategory.findById({ _id })

        if (!getCarCareCategory) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }

        const data = {
            _id: getCarCareCategory!._id,
            name: getCarCareCategory!.car_care_category_name,
            slug: getCarCareCategory!.car_care_category_slug,
            image: getCarCareCategory!.car_care_category_image ? DIR + getCarCareCategory!.car_care_category_image : '',
            description: getCarCareCategory!.car_care_category_description,
            sorting: getCarCareCategory!.car_care_category_sorting,
            status: getCarCareCategory!.car_care_category_status,
            createdAt: getCarCareCategory!.createdAt,
            updatedAt: getCarCareCategory!.updatedAt
        }
        res.status(200).json({ status: 1, data: data })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateCarCareCategory = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const carCareCategory = await CarCareCategory.findById({ _id });

        if (!carCareCategory) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        carCareCategory.car_care_category_name = req.body.car_care_category_name;
        carCareCategory.car_care_category_slug = req.body.service_category_slug ? req.body.service_category_slug : carCareCategory.car_care_category_slug
        carCareCategory.car_care_category_description = req.body.car_care_category_description ? req.body.car_care_category_description : carCareCategory.car_care_category_description
        carCareCategory.car_care_category_sorting = req.body.service_category_sorting ? req.body.car_care_category_sorting : carCareCategory.car_care_category_sorting

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : carCareCategory.car_care_category_image;
            if (carCareCategory.car_care_category_image) {
                fs.unlinkSync(carCareCategoryImagePath + carCareCategory.car_care_category_image);
            }
            carCareCategory.car_care_category_image = uploadFile;
        }

        await carCareCategory.save();

        res.status(200).json({ status: 1, message: `${carCareCategory.car_care_category_name} updated successfully.` });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


const activeDeactiveCarCareCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status
        const allCarCareCategory: any = [];
        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const carCareCategory = await CarCareCategory.findById({ _id })

        if (!carCareCategory) {
            res.status(404).json({ status: 0, message: 'Data not found!' });
        }

        carCareCategory!.car_care_category_status = status
        await carCareCategory!.save();
        const service = await CarCareCategory.find().sort({ createdAt: -1 })
        service.forEach((carcare) => {
            allCarCareCategory.push({
                _id: carcare!._id,
                name: carcare!.car_care_category_name,
                slug: carcare!.car_care_category_slug,
                image: carcare!.car_care_category_image ? DIR + carcare!.car_care_category_image : '',
                description: carcare!.car_care_category_description,
                sorting: carcare!.car_care_category_sorting,
                status: carcare!.car_care_category_status,
                createdAt: carcare!.createdAt,
                updatedAt: carcare!.updatedAt
            })
        });
        res.status(200).json({ status: 1, message: `${carCareCategory!.car_care_category_name} status updated successfully!`, data: allCarCareCategory })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export { createCarCareCategory, carCareCategoryList, viewCarCareCategory, updateCarCareCategory, activeDeactiveCarCareCategory }
