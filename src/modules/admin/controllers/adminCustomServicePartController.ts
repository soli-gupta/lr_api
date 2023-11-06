import { Request, Response } from "express";
import CustomServicePart from "../../service/models/custom-service-parts";
import { createSlug } from "../../../helpers/common_helper";
import createHttpError from "http-errors";
import path from 'path'
import fs from 'fs'


const customServicePartImagePath = path.join(process.cwd(), '/public/custom-service-part/');
const DIR = 'public/custom-service-part/'

const createCustomServicePart = async (req: Request, res: Response) => {

    try {

        const data = {
            custom_service_part_name: req.body.custom_service_part_name,
            custom_service_part_slug: req.body.custom_service_part_slug ? req.body.custom_service_part_slug : await createSlug(req.body.custom_service_part_name),
        }
        const slug = req.body.custom_service_part_slug
        const getCustomServicePart = await CustomServicePart.findOne({ custom_service_part_slug: slug })

        if (getCustomServicePart) {
            throw createHttpError(500, "Already exits slug. Please try another.");
        }
        const serviceCategory = new CustomServicePart(data)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            serviceCategory.custom_service_part_image = uploadFile;
        }
        await serviceCategory.save()
        const serviceCategoryData = {
            _id: serviceCategory!._id,
            name: serviceCategory.custom_service_part_name,
            slug: serviceCategory.custom_service_part_slug,
            image: serviceCategory!.custom_service_part_image ? DIR + serviceCategory!.custom_service_part_image : '',
            status: serviceCategory!.custom_service_part_status,
            createdAt: serviceCategory!.createdAt,
            updatedAt: serviceCategory!.updatedAt,
        }
        res.status(201).json({ status: 1, message: `${serviceCategory.custom_service_part_name} created successfully!`, data: serviceCategoryData })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const customServicePartList = async (req: Request, res: Response) => {
    try {
        const customServiceParts: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 10;
        const skip = (page - 1) * limit;
        const getcustomServicePart = await CustomServicePart.find({}).skip(skip).limit(limit);

        if (!getcustomServicePart) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getcustomServicePart.forEach((categories) => {
            customServiceParts.push({
                _id: categories._id,
                name: categories.custom_service_part_name,
                slug: categories.custom_service_part_slug,
                image: categories.custom_service_part_image ? DIR + categories.custom_service_part_image : '',
                status: categories.custom_service_part_status,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: customServiceParts });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const viewCustomServicePart = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const customServicePart = await CustomServicePart.findById({ _id })

        if (!customServicePart) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }

        const data = {
            _id: customServicePart!._id,
            name: customServicePart!.custom_service_part_name,
            slug: customServicePart!.custom_service_part_slug,
            image: customServicePart!.custom_service_part_image ? DIR + customServicePart!.custom_service_part_image : '',
            status: customServicePart!.custom_service_part_status,
            createdAt: customServicePart!.createdAt,
            updatedAt: customServicePart!.updatedAt
        }
        res.status(200).json({ status: 1, data: data })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateCustomServicePart = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const customServicePart = await CustomServicePart.findById({ _id });

        if (!customServicePart) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        customServicePart.custom_service_part_name = req.body.custom_service_part_name;
        customServicePart.custom_service_part_slug = req.body.custom_service_part_slug ? req.body.custom_service_part_slug : customServicePart.custom_service_part_slug

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : customServicePart.custom_service_part_image;
            if (customServicePart.custom_service_part_image) {
                fs.unlinkSync(customServicePartImagePath + customServicePart.custom_service_part_image);
            }
            customServicePart.custom_service_part_image = uploadFile;
        }

        await customServicePart.save();

        res.status(200).json({ status: 1, message: `${customServicePart.custom_service_part_name} updated successfully.` });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


const activeDeactiveCustomServicePart = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const customServicePart = await CustomServicePart.findById({ _id })

        if (!customServicePart) {
            res.status(404).json({ status: 0, message: 'Data not found!' });
        }

        customServicePart!.custom_service_part_status = status
        await customServicePart!.save();

        const data = {
            _id: customServicePart!._id,
            name: customServicePart!.custom_service_part_name,
            slug: customServicePart!.custom_service_part_slug,
            image: customServicePart!.custom_service_part_image ? DIR + customServicePart!.custom_service_part_image : '',
            status: customServicePart!.custom_service_part_status,
            createdAt: customServicePart!.createdAt,
            updatedAt: customServicePart!.updatedAt
        }

        res.status(200).json({ status: 1, message: `${customServicePart!.custom_service_part_name} status updated successfully!`, data: data })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export { createCustomServicePart, customServicePartList, viewCustomServicePart, updateCustomServicePart, activeDeactiveCustomServicePart }
