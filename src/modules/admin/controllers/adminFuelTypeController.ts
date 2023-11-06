import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { createSlug } from "../../../helpers/common_helper";
import Fuel from "../models/fuel";
import path from 'path'
import fs from 'fs'

const bodyTypeImagePath = path.join(process.cwd(), '/public/fuel-type/');
const DIR = 'public/fuel-type/'

const createFuelType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fuelData = {
            fuel_name: req.body.name ?? '',
            fuel_slug: req.body.slug ? req.body.slug : await createSlug(req.body.name),
            sorting: req.body.sorting ?? req.body.sorting
        }
        const slug = req.body.slug
        const getFuelType = await Fuel.findOne({ fuel_slug: slug })

        if (getFuelType) {
            throw createHttpError(500, "Already exits slug. Please try another.");
        }
        const fuel = new Fuel(fuelData)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            fuel.fuel_image = uploadFile;
        }
        await fuel.save()
        const fuelDatas = {
            _id: fuel!._id,
            fuel_name: fuel.fuel_name,
            fuel_slug: fuel.fuel_slug,
            fuel_image: fuel!.fuel_image ? DIR + fuel!.fuel_image : '',
            sorting: fuel!.sorting,
            fuel_status: fuel!.fuel_status,
            createAt: fuel!.createdAt,
            lastUpdated: fuel!.updatedAt,
        }
        res.status(201).json({ status: 1, message: `${fuel.fuel_name} created successfully!`, data: fuelDatas })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const fuelTypeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fuels: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 10;
        const skip = (page - 1) * limit;
        const getFuelType = await Fuel.find({}).skip(skip).limit(limit);

        if (!getFuelType) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getFuelType.forEach((fuelData) => {
            fuels.push({
                _id: fuelData._id,
                fuel_name: fuelData.fuel_name,
                fuel_slug: fuelData.fuel_slug,
                fuel_image: fuelData.fuel_image ? DIR + fuelData.fuel_image : '',
                sorting: fuelData.sorting,
                fuel_status: fuelData.fuel_status,
                createdAt: fuelData.createdAt,
                updatedAt: fuelData.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: fuels });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewFuelType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getFuelType = await Fuel.findById({ _id })

        if (!getFuelType) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getFuelType })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateFuelType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const fuel = await Fuel.findById({ _id })!

        fuel!.fuel_name = req.body.name ? req.body.name : fuel!.fuel_name
        fuel!.fuel_slug = req.body.slug ? req.body.slug : fuel!.fuel_slug
        fuel!.sorting = req.body.slug ? req.body.sorting : fuel!.sorting
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : fuel!.fuel_image;
            // if (fuel!.fuel_image) {
            //     fs.unlinkSync(bodyTypeImagePath + fuel!.fuel_image);
            // }
            fuel!.fuel_image = uploadFile;
        }
        await fuel!.save()
        res.status(200).json({ status: 1, message: `${fuel!.fuel_name} updated successfully!`, data: fuel })
    } catch (error) {

    }

}

const activDeactiveFuel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const fuel = await Fuel.findById({ _id })

        if (!fuel) {
            res.status(404).json({ status: 0, message: 'Fuel not found!' });
        }

        fuel!.fuel_status = status

        await fuel!.save();
        res.status(200).json({ status: 1, message: `${fuel!.fuel_name} updated successfully!`, data: fuel })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const checkSlugDuplicate = async (req: Request, res: Response, next: NextFunction) => {

    const slug = req.query.slug
    const getFuelType = await Fuel.find({ fuel_slug: slug })
    if (getFuelType) {
        res.status(200).json({ status: 1, message: 'Already exits slug. Please try another', data: getFuelType })
    }
}

const fetchFuelType = async (req: Request, res: Response) => {
    try {
        const fuel_type: any = [];
        const fetchFuelType = await Fuel.find({}).where({ fuel_status: 1 });
        if (!fetchFuelType) {
            return res.status(404).json({ status: 0, message: 'Something went wrong!' });
        }

        fetchFuelType.forEach((fuel) => {
            fuel_type.push({
                _id: fuel._id,
                name: fuel.fuel_name
            })
        })


        res.status(200).json({ status: 1, fuel_type });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

export { createFuelType, fuelTypeList, viewFuelType, updateFuelType, activDeactiveFuel, checkSlugDuplicate, fetchFuelType }