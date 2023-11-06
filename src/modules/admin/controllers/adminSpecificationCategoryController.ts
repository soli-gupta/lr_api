import { Request, Response, NextFunction } from "express";
import SpecificationCategory from "../../features-and-specification/models/specifications-category";

const createSpecificationCategory = async (req: Request, res: Response) => {

    try {
        const specificationCategoryData = {
            name: req.body.name ?? '',
            slug: req.body.slug ?? ''
        }

        const specificationCategory = new SpecificationCategory(specificationCategoryData)

        await specificationCategory.save();

        const data = {
            _id: specificationCategory._id,
            name: specificationCategory.name,
            slug: specificationCategory.slug,
            status: specificationCategory.status,
            createdAt: specificationCategory.createdAt,
            updatedAt: specificationCategory.updatedAt
        }
        res.status(201).json({ status: 1, message: `${specificationCategory.name} Category created successfully!`, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }

}

const specificationCategoryList = async (req: Request, res: Response) => {
    try {
        const categories: any = []
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const getSpecificationCategory = await SpecificationCategory.find({}).skip(skip).limit(limit).sort({ "createdAt": -1 });
        if (!getSpecificationCategory) {
            return res.status(400).json({ status: 0, message: 'Data not available' });
        }

        getSpecificationCategory.forEach((category) => {
            categories.push({
                _id: category._id,
                name: category.name,
                slug: category.slug,
                status: category.status,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            })
        })
        res.status(200).json({ status: 1, data: categories });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const viewSpecificationCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Please refresh the page and click again!' });
        }
        const specificationCategory = await SpecificationCategory.findById({ _id });
        if (!specificationCategory) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }
        const data = {
            _id: specificationCategory._id,
            name: specificationCategory.name,
            slug: specificationCategory.slug,
            status: specificationCategory.status,
            createdAt: specificationCategory.createdAt,
            updatedAt: specificationCategory.updatedAt
        }
        res.status(200).json({ status: 1, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const updateSpecificationCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const specificationCategory = await SpecificationCategory.findById({ _id });
        if (!specificationCategory) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }

        specificationCategory.name = req.body.name ? req.body.name : specificationCategory.name;
        specificationCategory.slug = req.body.slug ? req.body.slug : specificationCategory.slug;

        await specificationCategory.save();

        const data = {
            name: specificationCategory.name,
            slug: specificationCategory.slug,
            status: specificationCategory.status,
            createdAt: specificationCategory.createdAt,
            updatedAt: specificationCategory.updatedAt
        }

        res.status(200).json({ status: 1, message: `${specificationCategory.name} updated successfully!`, data: data })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const activeDeactiveSpecificationCategoryStatus = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id || !status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const specificationCategory = await SpecificationCategory.findById({ _id });
        if (!specificationCategory) {
            return res.status(404).json({ status: 0, message: 'Data Not found!' });
        }

        specificationCategory.status = status;
        await specificationCategory.save();

        const data = {
            _id: specificationCategory._id,
            name: specificationCategory.name,
            slug: specificationCategory.slug,
            status: specificationCategory.status,
            createdAt: specificationCategory.createdAt,
            updatedAt: specificationCategory.updatedAt
        }
        res.status(200).json({ status: 1, message: `${specificationCategory.name} status updated successfully!`, data: data });

    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const fetchSpecificationCategory = async (req: Request, res: Response) => {
    try {
        const categories: any = [];
        const getSpecificationCategory = await SpecificationCategory.find({}).where({ status: 1 }).sort({ "createdAt": -1 });
        if (!getSpecificationCategory) {
            return res.status(400).json({ status: 0, message: 'Data not available' });
        }

        getSpecificationCategory.forEach((category) => {
            categories.push({
                _id: category._id,
                name: category.name
            })
        })
        res.status(200).json({ status: 1, categories });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { createSpecificationCategory, specificationCategoryList, viewSpecificationCategory, updateSpecificationCategory, activeDeactiveSpecificationCategoryStatus, fetchSpecificationCategory }