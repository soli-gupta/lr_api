import { Request, Response } from "express";
import ServiceCategory from "../../service/models/service_category";
import { createSlug } from "../../../helpers/common_helper";
import createHttpError from "http-errors";
import path from 'path'
import fs from 'fs'

const serviceCategoryImagePath = path.join(process.cwd(), '/public/service-category/');
const DIR = 'public/service-category/'

const createServiceCategory = async (req: Request, res: Response) => {

    try {

        const data = {
            service_category_name: req.body.service_category_name,
            service_category_slug: req.body.service_category_slug ? req.body.service_category_slug : await createSlug(req.body.service_category_name),
            service_category_description: req.body.service_category_description ? req.body.service_category_description : '',
            service_category_sorting: req.body.service_category_sorting ? req.body.service_category_sorting : ''
        }
        const slug = req.body.service_category_slug
        const getServiceCategory = await ServiceCategory.findOne({ service_category_slug: slug })

        if (getServiceCategory) {
            throw createHttpError(500, "Already exits slug. Please try another.");
        }
        const serviceCategory = new ServiceCategory(data)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            serviceCategory.service_category_image = uploadFile;
        }
        await serviceCategory.save()
        const serviceCategoryData = {
            _id: serviceCategory!._id,
            name: serviceCategory.service_category_name,
            slug: serviceCategory.service_category_slug,
            image: serviceCategory!.service_category_image ? DIR + serviceCategory!.service_category_image : '',
            description: serviceCategory!.service_category_description,
            sorting: serviceCategory!.service_category_sorting,
            status: serviceCategory!.service_category_status,
            createdAt: serviceCategory!.createdAt,
            updatedAt: serviceCategory!.updatedAt,
        }
        res.status(201).json({ status: 1, message: `${serviceCategory.service_category_name} created successfully!`, data: serviceCategoryData })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const serviceCategoryList = async (req: Request, res: Response) => {
    try {
        const serviceCategories: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 10;
        const skip = (page - 1) * limit;
        const getServiceCategory = await ServiceCategory.find({}).skip(skip).limit(limit);

        if (!getServiceCategory) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServiceCategory.forEach((categories) => {
            serviceCategories.push({
                _id: categories._id,
                name: categories.service_category_name,
                slug: categories.service_category_slug,
                image: categories.service_category_image ? DIR + categories.service_category_image : '',
                description: categories.service_category_description,
                sorting: categories.service_category_sorting,
                status: categories.service_category_status,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: serviceCategories });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const viewServiceCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getServiceCategory = await ServiceCategory.findById({ _id })

        if (!getServiceCategory) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }

        const data = {
            _id: getServiceCategory!._id,
            name: getServiceCategory!.service_category_name,
            slug: getServiceCategory!.service_category_slug,
            image: getServiceCategory!.service_category_image ? DIR + getServiceCategory!.service_category_image : '',
            description: getServiceCategory!.service_category_description,
            sorting: getServiceCategory!.service_category_sorting,
            status: getServiceCategory!.service_category_status,
            createdAt: getServiceCategory!.createdAt,
            updatedAt: getServiceCategory!.updatedAt
        }
        res.status(200).json({ status: 1, data: data })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateServiceCategory = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const serviceCategory = await ServiceCategory.findById({ _id });

        if (!serviceCategory) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        serviceCategory.service_category_name = req.body.service_category_name;
        serviceCategory.service_category_slug = req.body.service_category_slug ? req.body.service_category_slug : serviceCategory.service_category_slug
        serviceCategory.service_category_description = req.body.service_category_description ? req.body.service_category_description : serviceCategory.service_category_description
        serviceCategory.service_category_sorting = req.body.service_category_sorting ? req.body.service_category_sorting : serviceCategory.service_category_sorting

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : serviceCategory.service_category_image;
            if (serviceCategory.service_category_image) {
                fs.unlinkSync(serviceCategoryImagePath + serviceCategory.service_category_image);
            }
            serviceCategory.service_category_image = uploadFile;
        }

        await serviceCategory.save();

        res.status(200).json({ status: 1, message: `${serviceCategory.service_category_name} updated successfully.` });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


const activeDeactiveServiceCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status
        const allServiceCategory: any = [];
        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const serviceCategory = await ServiceCategory.findById({ _id })

        if (!serviceCategory) {
            res.status(404).json({ status: 0, message: 'Data not found!' });
        }

        serviceCategory!.service_category_status = status
        await serviceCategory!.save();
        const service = await ServiceCategory.find().sort({ createdAt: -1 })
        service.forEach((service) => {
            allServiceCategory.push({
                _id: service!._id,
                name: service!.service_category_name,
                slug: service!.service_category_slug,
                image: service!.service_category_image ? DIR + service!.service_category_image : '',
                description: service!.service_category_description,
                sorting: service!.service_category_sorting,
                status: service!.service_category_status,
                createdAt: service!.createdAt,
                updatedAt: service!.updatedAt
            })
        });
        res.status(200).json({ status: 1, message: `${serviceCategory!.service_category_name} status updated successfully!`, data: allServiceCategory })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export { createServiceCategory, serviceCategoryList, viewServiceCategory, updateServiceCategory, activeDeactiveServiceCategory }
