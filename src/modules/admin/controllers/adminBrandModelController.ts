import { Request, Response, NextFunction } from "express";
import path from "path";
import BrandModel from "../../brand/model/brand-models";
import fs from 'fs';

const modelImagePath = path.join(process.cwd(), '/public/brands/model/');
const DIR = 'public/brands/model/';

const createBrandModel = async (req: Request, res: Response) => {
    try {
        const brandModelData = {
            brand_id: req.body.brand_id ?? '',
            model_name: req.body.name ?? '',
            model_slug: req.body.slug ?? '',
            page_title: req.body.page_title ?? '',
            model_meta_description: req.body.meta_dewscription ?? '',
            h1_tag: req.body.h1_tag ?? '',
        }

        const checkModelSlug = await BrandModel.findOne({ model_slug: brandModelData.model_slug });

        if (checkModelSlug) {
            return res.status(400).json({ status: 2, message: `${brandModelData.model_slug} slug already added. Please change slug.` });
        }





        const brandModel = new BrandModel(brandModelData);
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            brandModel.model_image = uploadFile;
        }
        await brandModel.save();

        const getBrandModel = await BrandModel.findById({ _id: brandModel._id }).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_slug"] }
            ]
        );


        const shareBrandModel = {
            _id: getBrandModel!._id,
            brand_id: getBrandModel!.brand_id,
            name: getBrandModel!.model_name,
            slug: getBrandModel!.model_slug,
            meta_description: getBrandModel!.model_meta_description,
            page_title: getBrandModel!.page_title,
            h1_tag: getBrandModel!.h1_tag,
            image: getBrandModel!.model_image ? DIR + getBrandModel!.model_image : '',
            status: getBrandModel!.model_status,
            createdAt: getBrandModel!.createdAt,
            updatedAt: getBrandModel!.updatedAt
        }

        res.status(201).json({ status: 1, message: `${getBrandModel!.model_name} created successfully!`, brand_model: shareBrandModel })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const getAllBrandModelsList = async (req: Request, res: Response) => {
    try {
        const brandModels: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const getBrandModels = await BrandModel.find({}).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_slug"] }
            ]
        ).skip(skip).limit(limit).sort({ 'createdAt': -1 });
        if (!getBrandModels) {
            return res.status(400).send({ status: 0, message: 'No brand models found!' });
        }

        getBrandModels.forEach((model) => {
            brandModels.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
                slug: model.model_slug,
                meta_description: model.model_meta_description,
                page_title: model.page_title,
                h1_tag: model.h1_tag,
                image: model.model_image ? DIR + model.model_image : '',
                status: model.model_status,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            })
        });

        res.status(200).json({ status: 1, brand_model: brandModels });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const viewBrandModel = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }

        const getBrandModel = await BrandModel.findById({ _id }).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_slug"] }
            ]
        );

        if (!getBrandModel) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        const brandModel = {
            _id: getBrandModel._id,
            brand_id: getBrandModel.brand_id,
            name: getBrandModel.model_name,
            slug: getBrandModel.model_slug,
            meta_description: getBrandModel.model_meta_description,
            page_title: getBrandModel.page_title,
            h1_tag: getBrandModel.h1_tag,
            image: getBrandModel.model_image ? DIR + getBrandModel.model_image : '',
            status: getBrandModel.model_status,
            createdAt: getBrandModel.createdAt,
            updatedAt: getBrandModel.updatedAt
        }
        res.status(200).json({ status: 1, brand_model: brandModel });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateBrandModel = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }
        const getBrandModel = await BrandModel.findById({ _id });

        if (!getBrandModel) {
            return res.status(404).json({ status: 0, message: 'Model not found!' });
        }

        getBrandModel.brand_id = req.body.brand_id ? req.body.brand_id : getBrandModel.brand_id;
        getBrandModel.model_name = req.body.name ? req.body.name : getBrandModel.model_name;
        getBrandModel.model_slug = req.body.slug ? req.body.slug : getBrandModel.model_slug;
        getBrandModel.page_title = req.body.page_title ? req.body.page_title : getBrandModel.page_title;
        getBrandModel.model_meta_description = req.body.meta_description ? req.body.meta_description : getBrandModel.model_meta_description;
        getBrandModel.page_title = req.body.page_title ? req.body.page_title : getBrandModel.page_title;
        getBrandModel.h1_tag = req.body.h1_tag ? req.body.h1_tag : getBrandModel.h1_tag;

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : getBrandModel.model_image;
            if (getBrandModel.model_image) {
                fs.unlinkSync(modelImagePath + getBrandModel.model_image);
            }
            getBrandModel.model_image = uploadFile;
        }
        await getBrandModel.save();

        const updatedBrandModel = await BrandModel.findById({ _id }).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_slug"] }
            ]
        )

        const brandModel = {
            _id: updatedBrandModel!._id,
            brand_id: updatedBrandModel!.brand_id,
            name: updatedBrandModel!.model_name,
            slug: updatedBrandModel!.model_slug,
            meta_description: updatedBrandModel!.model_meta_description,
            page_title: updatedBrandModel!.page_title,
            h1_tag: updatedBrandModel!.h1_tag,
            image: updatedBrandModel!.model_image ? DIR + updatedBrandModel!.model_image : '',
            status: updatedBrandModel!.model_status,
            createdAt: updatedBrandModel!.createdAt,
            updatedAt: updatedBrandModel!.updatedAt
        }
        res.status(200).json({ status: 1, message: `${updatedBrandModel!.model_name} updated successfully!`, brand_model: brandModel });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnblockBrandModel = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }

        const getBrandModel = await BrandModel.findById({ _id });
        if (!getBrandModel) {
            return res.status(404).json({ status: 0, message: 'Model not found!' });
        }

        getBrandModel.model_status = status;
        await getBrandModel.save();

        const brandModel = {
            _id: getBrandModel._id,
            brand_id: getBrandModel.brand_id,
            name: getBrandModel.model_name,
            slug: getBrandModel.model_slug,
            meta_description: getBrandModel.model_meta_description,
            page_title: getBrandModel.page_title,
            h1_tag: getBrandModel.h1_tag,
            image: getBrandModel.model_image ? DIR + getBrandModel.model_image : '',
            status: getBrandModel.model_status,
            createdAt: getBrandModel.createdAt,
            updatedAt: getBrandModel.updatedAt
        }
        res.status(200).json({ status: 1, message: `${getBrandModel.model_name} updated successfully!`, brand_model: brandModel })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



const getModelByBrand = async (req: Request, res: Response) => {
    try {
        const brandModels: any = [];
        const brand_id = req.query.id;
        if (!brand_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong!' });
        }

        const getModelsByBrand = await BrandModel.find({ brand_id }).where({ model_status: 1 })

        if (!getModelsByBrand || getModelsByBrand.length <= 0) {
            return res.status(404).json({ status: 0, message: 'No Models found!' });
        }

        getModelsByBrand.forEach((model) => {
            brandModels.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
                slug: model.model_slug,
                image: model.model_image ? DIR + model.model_image : '',
                status: model.model_status,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            })
        });

        res.status(200).json({ status: 1, brand_model: brandModels })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}


const getBrandModel = async (req: Request, res: Response) => {
    try {
        const brandModels: any = [];
        // const brand_id = req.query.id;
        // if (!brand_id) {
        //     return res.status(400).json({ status: 0, message: 'Something went wrong!' });
        // }

        const getModelsByBrand = await BrandModel.find({}).where({ model_status: 1 })

        if (!getModelsByBrand) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        getModelsByBrand.forEach((model) => {
            brandModels.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
                slug: model.model_slug,
                image: model.model_image ? DIR + model.model_image : '',
                status: model.model_status,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            })
        });

        res.status(200).json({ status: 1, brand_model: brandModels })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}
export { createBrandModel, getAllBrandModelsList, viewBrandModel, updateBrandModel, blockUnblockBrandModel, getModelByBrand, getBrandModel }