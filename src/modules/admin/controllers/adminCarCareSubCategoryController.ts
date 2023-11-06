import { Request, Response, NextFunction } from "express";
import ServicesSubCategory from "../../service/models/service-sub-category";
import CarCareSubCategory from "../../car-care/models/car-care-sub-category";
import { createSlug } from "../../../helpers/common_helper";

const createCarCareSubCategory = async (req: Request, res: Response) => {
    try {
        const data = {
            car_care_category_id: req.body.car_care_category_id,
            car_care_sub_category_name: req.body.car_care_sub_category_name,
            car_care_sub_category_slug: await createSlug(req.body.car_care_sub_category_name),
            car_care_taken_hours: req.body.car_care_taken_hours,
            car_care_short_description: req.body.car_care_short_description,
            car_care_description: req.body.car_care_description,
            car_care_recommend: req.body.car_care_recommend,
            car_care_sorting: req.body.car_care_sorting
        }
        const carcare = new CarCareSubCategory(data)
        carcare.save()
        res.status(201).json({ status: 1, message: "Your car care package created successfully" })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const carCareSubCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carcare: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;
        const getServices = await CarCareSubCategory.find({}).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServices.forEach((servicesData) => {
            carcare.push({
                _id: servicesData._id,
                service_category: servicesData.car_care_category_id,
                car_care_sub_category_name: servicesData.car_care_sub_category_name,
                car_care_sub_category_slug: servicesData.car_care_sub_category_slug,
                car_care_taken_hours: servicesData.car_care_taken_hours,
                car_care_short_description: servicesData.car_care_short_description,
                car_care_description: servicesData.car_care_description,
                car_care_sorting: servicesData.car_care_sorting,
                car_care_recommend: servicesData.car_care_recommend,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: carcare });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewCarCareSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getServices = await CarCareSubCategory.findById({ _id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] }
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateCarCareSubCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const carcare = await CarCareSubCategory.findById({ _id })!
        carcare!.car_care_category_id = req.body.car_care_category_id ? req.body.car_care_category_id : carcare!.car_care_category_id
        carcare!.car_care_sub_category_name = req.body.car_care_sub_category_name ? req.body.car_care_sub_category_name : carcare!.car_care_sub_category_name
        carcare!.car_care_sub_category_slug = req.body.car_care_sub_category_slug ? await createSlug(req.body.car_care_sub_category_name) : carcare!.car_care_sub_category_slug
        carcare!.car_care_description = req.body.car_care_description ? req.body.car_care_description : carcare!.car_care_description
        carcare!.car_care_short_description = req.body.car_care_short_description ? req.body.car_care_short_description : carcare!.car_care_short_description
        carcare!.car_care_taken_hours = req.body.car_care_taken_hours ? req.body.car_care_taken_hours : carcare!.car_care_taken_hours
        carcare!.car_care_recommend = req.body.car_care_recommend ? req.body.car_care_recommend : carcare!.car_care_recommend
        carcare!.car_care_sorting = req.body.slug ? req.body.sorting : carcare!.car_care_sorting

        await carcare!.save()
        res.status(200).json({ status: 1, message: `${carcare!.car_care_sub_category_name} updated successfully!`, data: carcare })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveCarCareSubCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const carCareSubCategory = await CarCareSubCategory.findById({ _id })

        if (!carCareSubCategory) {
            res.status(404).json({ status: 0, message: 'car care package not found!' });
        }

        carCareSubCategory!.status = status

        await carCareSubCategory!.save();
        res.status(200).json({ status: 1, message: `${carCareSubCategory!.car_care_sub_category_name} updated successfully!`, data: carCareSubCategory })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const selectCarCareSubCategoryByCatId = async (req: Request, res: Response) => {
    try {
        let id = req.query.id

        let subCategory = await CarCareSubCategory.where({ car_care_category_id: id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] }
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


export { createCarCareSubCategory, carCareSubCategoryList, viewCarCareSubCategory, updateCarCareSubCategory, activeDeactiveCarCareSubCategory, selectCarCareSubCategoryByCatId }