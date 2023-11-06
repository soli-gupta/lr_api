import { Request, Response } from "express";
import ModelVariant from "../../brand/model/model-variant";
import BrandModel from "../../brand/model/brand-models";
import path from "path";
import fs from 'fs';

const modelVariantImagePath = path.join(process.cwd(), '/public/brands/variant/');
const DIR = 'public/brands/variant/';

const createModelVariant = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const modelVariantData = {
            brand_id: body.brand_id ?? '',
            model_id: body.model_id ?? '',
            variant_name: body.name ?? '',
            variant_slug: body.slug ?? '',
        }


        const checkBrandSlug = await ModelVariant.findOne({ variant_slug: modelVariantData.variant_slug, model_id: body.model_id });

        if (checkBrandSlug) {
            return res.status(400).json({ status: 2, message: `${modelVariantData.variant_slug} slug already added. Please change slug.` });
        }

        const modelVariant = new ModelVariant(modelVariantData);

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            modelVariant.variant_image = uploadFile;
        }

        await modelVariant.save();

        const shareModelVariant = {
            _id: modelVariant._id,
            name: modelVariant.variant_name,
            slug: modelVariant.variant_slug,
            brand_id: modelVariant.brand_id,
            model_id: modelVariant.model_id,
            image: modelVariant.variant_image ? DIR + modelVariant.variant_image : '',
            status: modelVariant.variant_status,
            createdAt: modelVariant.createdAt,
            updatedAt: modelVariant.updatedAt
        }
        res.status(201).json({ status: 1, message: `${modelVariant.variant_name} created successfully!`, model_variant: shareModelVariant });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const manageAllModelVariantList = async (req: Request, res: Response) => {
    try {
        const modelVariants: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const getModelVariants = await ModelVariant.find({}).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_slug"] },
                { path: "model_id", select: ["model_name", "model_slug"] }
            ]
        ).skip(skip).limit(limit).sort({ 'createdAt': -1 });
        if (!getModelVariants) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }
        getModelVariants.forEach((variant) => {
            modelVariants.push({
                _id: variant._id,
                name: variant.variant_name,
                slug: variant.variant_slug,
                brand_id: variant.brand_id,
                model_id: variant.model_id,
                image: variant.variant_image ? DIR + variant.variant_image : '',
                status: variant.variant_status,
                createdAt: variant.createdAt,
                updatedAt: variant.updatedAt
            })
        });
        res.status(200).json({ status: 1, model_variant: modelVariants });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewModelVariant = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const brandModels: any = [];
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const modelVariant = await ModelVariant.findById({ _id }).populate(
            [
                { path: "brand_id", select: ["brand_name", "brand_dlug"] },
                { path: "model_id", select: ["model_name", "model_slug"] }
            ]
        );
        if (!modelVariant) {
            return res.status(404).json({ status: 0, message: 'Not foound!' });
        }

        const fetchModelsByBrand = await BrandModel.find({ brand_id: modelVariant.brand_id }).where({ model_status: 1 });


        const shareModelVariant = {
            _id: modelVariant._id,
            name: modelVariant.variant_name,
            slug: modelVariant.variant_slug,
            brand_id: modelVariant.brand_id,
            model_id: modelVariant.model_id,
            image: modelVariant.variant_image ? DIR + modelVariant.variant_image : '',
            status: modelVariant.variant_status,
            createdAt: modelVariant.createdAt,
            updatedAt: modelVariant.updatedAt
        }



        fetchModelsByBrand.forEach((model) => {
            brandModels.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
            })
        });

        res.status(200).json({ status: 1, model_variant: shareModelVariant, brand_model: brandModels });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateModelVariant = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const body = req.body;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const modelVariant = await ModelVariant.findById({ _id });

        if (!modelVariant) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        modelVariant.brand_id = body.brand_id ? body.brand_id : modelVariant.brand_id;
        modelVariant.model_id = body.model_id ? body.model_id : modelVariant.model_id;
        modelVariant.variant_name = body.name ? body.name : modelVariant.variant_name;
        modelVariant.variant_slug = body.slug ? body.slug : modelVariant.variant_slug;
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : modelVariant.variant_image;
            if (modelVariant.variant_image) {
                fs.unlinkSync(modelVariantImagePath + modelVariant.variant_image);
            }
            modelVariant.variant_image = uploadFile;
        }

        await modelVariant.save();

        const shareModelVariant = {
            _id: modelVariant._id,
            name: modelVariant.variant_name,
            slug: modelVariant.variant_slug,
            brand_id: modelVariant.brand_id,
            model_id: modelVariant.model_id,
            image: modelVariant.variant_image ? DIR + modelVariant.variant_image : '',
            status: modelVariant.variant_status,
            createdAt: modelVariant.createdAt,
            updatedAt: modelVariant.updatedAt
        }

        res.status(200).json({ status: 1, message: `${modelVariant.variant_name} updated successfully!`, model_variant: shareModelVariant });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnblockModelVariant = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const modelVariant = await ModelVariant.findById({ _id });
        if (!modelVariant) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        modelVariant.variant_status = status;

        await modelVariant.save();

        const shareModelVariant = {
            _id: modelVariant._id,
            name: modelVariant.variant_name,
            slug: modelVariant.variant_slug,
            brand_id: modelVariant.brand_id,
            model_id: modelVariant.model_id,
            image: modelVariant.variant_image ? DIR + modelVariant.variant_image : '',
            status: modelVariant.variant_status,
            createdAt: modelVariant.createdAt,
            updatedAt: modelVariant.updatedAt
        }

        res.status(200).json({ status: 1, message: `${modelVariant.variant_name} updated successfully!`, model_variant: shareModelVariant });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getVariantsByModel = async (req: Request, res: Response) => {
    try {
        const modelVariants: any = [];
        const model_id = req.query.id;
        if (!model_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong!' });
        }

        const getVariants = await ModelVariant.find({ model_id: model_id }).where({ variant_status: 1 });

        if (!getVariants || getVariants.length <= 0) {
            return res.status(404).json({ status: 0, message: `No Variants found!` });
        }
        // || getVariants.length <= 0
        getVariants.forEach((variant) => {
            modelVariants.push({
                _id: variant._id,
                name: variant.variant_name,
                slug: variant.variant_slug,
            })
        });
        res.status(200).json({ status: 1, model_variant: modelVariants });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



export { createModelVariant, manageAllModelVariantList, viewModelVariant, updateModelVariant, blockUnblockModelVariant, getVariantsByModel }