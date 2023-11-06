import { Request, Response, NextFunction } from "express";
import Services from "../../service/models/services";
import ServicesSubCategory from "../../service/models/service-sub-category";
import { createSlug } from "../../../helpers/common_helper";

const createServicesSubCategory = async (req: Request, res: Response) => {
    try {
        const data = {
            service_category_id: req.body.service_category_id,
            service_sub_category_name: req.body.service_sub_category_name,
            service_sub_category_slug: await createSlug(req.body.service_sub_category_name),
            service_taken_hours: req.body.service_taken_hours,
            service_short_description: req.body.service_short_description,
            service_description: req.body.service_description,
            service_recommend: req.body.service_recommend,
            service_sorting: req.body.service_sorting
        }
        const services = new ServicesSubCategory(data)
        services.save()
        res.status(201).json({ status: 1, message: "Your service created successfully" })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const servicesSubCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;
        const getServices = await ServicesSubCategory.find({}).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                service_category: servicesData.service_category_id,
                service_sub_category_name: servicesData.service_sub_category_name,
                service_sub_category_slug: servicesData.service_sub_category_slug,
                service_taken_hours: servicesData.service_taken_hours,
                service_short_description: servicesData.service_short_description,
                service_description: servicesData.service_description,
                service_sorting: servicesData.service_sorting,
                service_recommend: servicesData.service_recommend,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: services });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewServicesSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getServices = await ServicesSubCategory.findById({ _id }).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateServiceSubCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const service = await ServicesSubCategory.findById({ _id })!
        service!.service_category_id = req.body.service_category_id ? req.body.service_category_id : service!.service_category_id
        service!.service_sub_category_name = req.body.service_sub_category_name ? req.body.service_sub_category_name : service!.service_sub_category_name
        service!.service_sub_category_slug = req.body.name ? await createSlug(req.body.service_sub_category_name) : service!.service_sub_category_slug
        service!.service_short_description = req.body.service_short_description ? req.body.service_short_description : service!.service_short_description
        service!.service_description = req.body.service_description ? req.body.service_description : service!.service_description
        service!.service_taken_hours = req.body.service_taken_hours ? req.body.service_taken_hours : service!.service_taken_hours
        service!.service_recommend = req.body.service_recommend ? req.body.service_recommend : service!.service_recommend
        service!.service_sorting = req.body.slug ? req.body.sorting : service!.service_sorting

        await service!.save()
        res.status(200).json({ status: 1, message: `${service!.service_sub_category_name} updated successfully!`, data: service })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveServiceSubCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const servicesSubCategory = await ServicesSubCategory.findById({ _id })

        if (!servicesSubCategory) {
            res.status(404).json({ status: 0, message: 'services not found!' });
        }

        servicesSubCategory!.status = status

        await servicesSubCategory!.save();
        res.status(200).json({ status: 1, message: `${servicesSubCategory!.service_sub_category_name} updated successfully!`, data: servicesSubCategory })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const selectSubCategoryByCatId = async (req: Request, res: Response) => {
    try {
        let id = req.query.id

        let subCategory = await ServicesSubCategory.where({ service_category_id: id }).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
        ])
        if (!subCategory) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: subCategory })

    } catch (error) {

    }

}

const importCsv = async () => {

}


export { createServicesSubCategory, servicesSubCategoryList, viewServicesSubCategory, updateServiceSubCategory, activeDeactiveServiceSubCategory, selectSubCategoryByCatId }