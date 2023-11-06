import { Request, Response, NextFunction } from "express";
import City from "../../admin/models/city";
import State from "../../admin/models/state";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";

const DIR_BRAND = 'public/brands/';
const DIR_MODEL = 'public/brands/model/';
const DIR_VARIANT = 'public/brands/variant/';
const brandsList = async (req: Request, res: Response) => {
    try {
        const brands: any = [];
        const getBrands = await Brands.find({}).sort({ 'createdAt': -1 }).where({ brand_status: 1 });
        if (!getBrands) {
            return res.status(400).json({ status: 0, message: 'No brands found!' });
        }

        getBrands.forEach((brand) => {
            brands.push({
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
                image: DIR_BRAND + brand.brand_logo,
            })
        });
        res.status(200).json({ status: 1, brands })
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
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
                image: model.model_image ? DIR_MODEL + model.model_image : '',
            })
        });

        res.status(200).json({ status: 1, brand_model: brandModels })
    } catch (e) {
        res.status(500).json({ status: 0, message: e })
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
                image: DIR_VARIANT + variant.variant_image
            })
        });
        res.status(200).json({ status: 1, model_variant: modelVariants });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const arrayOfYears = (req: Request, res: Response) => {
    var max = new Date().getFullYear()
    var min = max - 9
    const years: any = []
    for (var i = max; i >= min; i--) {
        years.push(i)
    }
    res.status(200).json({ status: 1, year: years });
}

const getStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const state = await State.find({});
        res.status(200).json({ status: 1, data: state });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const getCityByState = async (req: Request, res: Response) => {
    try {
        const city = await City.find({ state_id: req.query.state_id });
        if (city.length > 0) {
            res.status(200).json({ status: 1, data: city });
        } else {
            res.status(200).json({ status: 1, mesaage: 'data not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}
export { brandsList, getModelByBrand, getVariantsByModel, arrayOfYears, getStates, getCityByState }