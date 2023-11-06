import { Request, Response, NextFunction } from "express";
import BodyType from "../models/body-type";
import path from 'path'
import fs from 'fs'

const bodyTypeImagePath = path.join(process.cwd(), '/public/body-type/');
const DIR = 'public/body-type/'


const createBodyType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bodyTypeData = {
            body_name: req.body.body_name ?? '',
            body_slug: req.body.body_slug ?? '',
            sorting: req.body.sorting ?? ''
        }

        const bodyType = new BodyType(bodyTypeData)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            bodyType.body_image = uploadFile;
        }
        await bodyType.save()
        const data = {
            id: bodyType._id,
            name: bodyType.body_name,
            slug: bodyType.body_slug,
            sorting: bodyType.sorting,
            status: bodyType.body_status,
            logo: DIR + bodyType.body_image ?? '',
            createdAt: bodyType.createdAt,
            updatedAt: bodyType.updatedAt
        }

        res.status(201).json({ status: 1, message: `${bodyType.body_name} created successfully`, data: data })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const bodyTypeList = async (req: Request, res: Response) => {

    try {
        const bodyTypes: any = []
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 100;
        const skip = (page - 1) * limit;
        const getBodyType = await BodyType.find({}).skip(skip).limit(limit);

        if (!getBodyType) {
            return res.status(400).json({ status: 0, message: 'Data not available' });
        }

        getBodyType.forEach((body) => {
            bodyTypes.push({
                _id: body._id,
                body_name: body.body_name,
                body_slug: body.body_slug,
                body_status: body.body_status,
                sorting: body.sorting,
                body_image: body.body_image ? DIR + body.body_image : '',
                createdAt: body.createdAt,
                updatedAt: body.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: bodyTypes })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const viewBodyType = async (req: Request, res: Response) => {

    try {
        const _id = req.params.id

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const getBodyType = await BodyType.findById({ _id })

        if (!getBodyType) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }
        getBodyType!.body_image = DIR + getBodyType!.body_image ?? ''
        res.status(200).json({ status: 1, data: getBodyType });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateBodyType = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const getBodyType = await BodyType.findById({ _id })
        if (!getBodyType) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }
        getBodyType.body_name = req.body.body_name ? req.body.body_name : getBodyType.body_name
        getBodyType.body_slug = req.body.body_slug ? req.body.body_slug : getBodyType.body_slug
        getBodyType.sorting = req.body.sorting ? req.body.sorting : getBodyType.sorting

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : getBodyType.body_image;
            if (getBodyType.body_image) {
                fs.unlinkSync(bodyTypeImagePath + getBodyType.body_image);
            }
            getBodyType.body_image = uploadFile;
        }

        await getBodyType.save();
        const data = {
            id: getBodyType._id,
            name: getBodyType.body_name,
            slug: getBodyType.body_slug,
            sorting: getBodyType.sorting,
            status: getBodyType.body_status,
            logo: DIR + getBodyType.body_image ?? '',
            createdAt: getBodyType.createdAt,
            updatedAt: getBodyType.updatedAt
        }
        res.status(200).json({ status: 1, message: `${getBodyType.body_name} updated successfully!`, data: data });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const activeDeactiveBodyType = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id || !status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const getBodyType = await BodyType.findById({ _id });
        if (!getBodyType) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }

        getBodyType.body_status = status;
        await getBodyType.save();

        const data = {
            id: getBodyType._id,
            name: getBodyType.body_name,
            slug: getBodyType.body_slug,
            sorting: getBodyType.sorting,
            status: getBodyType.body_status,
            logo: DIR + getBodyType.body_image ?? '',
            createdAt: getBodyType.createdAt,
            updatedAt: getBodyType.updatedAt
        }
        res.status(200).json({ status: 1, message: `${getBodyType.body_name} status updated successfully!`, data: data });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const fetchBodyType = async (req: Request, res: Response) => {
    try {
        const bodyTypes: any = []

        const getBodyType = await BodyType.find({}).where({ body_status: 1 });

        if (!getBodyType) {
            return res.status(400).json({ status: 0, message: 'Data not available' });
        }

        getBodyType.forEach((body) => {
            bodyTypes.push({
                _id: body._id,
                body_name: body.body_name,
                body_slug: body.body_slug,
                sorting: body.sorting,
            })
        })
        res.status(200).json({ status: 1, body_type: bodyTypes })
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

export { createBodyType, bodyTypeList, viewBodyType, updateBodyType, activeDeactiveBodyType, fetchBodyType }