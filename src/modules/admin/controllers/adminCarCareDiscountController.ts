import { Request, Response, NextFunction } from "express";
import ServiceDiscount from "../../service/models/service-discount";
import { fetchCarCareSubCat } from "../../../helpers/users/commonHelper";
import { fetchCarCareDetailsByCarCareCategory } from "../../../helpers/admin/Helper";
import CarCareDiscount from "../../car-care/models/car-care-discount";

const createCarCareDiscount = async (req: Request, res: Response) => {
    try {
        let discount_car_care_category: any = ''
        let discount_car_care_sub_category: any = ''

        if (req.body.car_care_category_id) {
            discount_car_care_category = 1
        }

        if (req.body.service_sub_category_id) {
            discount_car_care_sub_category = 2
        }
        let mulSerdata: any = '';
        const data = {
            service: req.body.service,
            car_care_category_id: req.body.car_care_category_id,
            car_care_sub_category_id: req.body.car_care_sub_category_id ? req.body.car_care_sub_category_id : null,
            car_care_discount_price: req.body.car_care_discount_price,
            discount_car_care_category: discount_car_care_category,
            discount_car_care_sub_category: discount_car_care_sub_category,
            discount_type: req.body.discount_type,
            start_discount_date: req.body.start_discount_date,
            end_discount_date: req.body.end_discount_date,
        }
        if (req.body.car_care_category_id && !req.body.car_care_sub_category_id) {
            const serviceSubCat = await fetchCarCareSubCat(req.body.car_care_category_id)


            serviceSubCat.map((subCat: any, i: any) => {
                for (let i = 0; i < serviceSubCat.length; i++) {
                    mulSerdata = new CarCareDiscount({
                        service: req.body.service,
                        car_care_category_id: req.body.car_care_category_id,
                        car_care_sub_category_id: subCat.sub_cate_id,
                        car_care_discount_price: req.body.car_care_discount_price,
                        discount_car_care_category: discount_car_care_category,
                        discount_car_care_sub_category: discount_car_care_sub_category,
                        discount_type: req.body.discount_type,
                        start_discount_date: req.body.start_discount_date,
                        end_discount_date: req.body.end_discount_date,
                    })
                }
                mulSerdata.save()
            })

        } else {
            const carcare = new CarCareDiscount(data)
            carcare.save()
        }
        res.status(201).json({ status: 1, message: "Your car care discount created successfully" })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const carCareDiscountList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const servicesDiscount: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;

        const getServicesDiscount = await CarCareDiscount.find({}).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name"] }
        ]).skip(skip).limit(limit);


        if (!getServicesDiscount) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServicesDiscount.forEach((servicesDiscountData) => {
            servicesDiscount.push({
                _id: servicesDiscountData._id,
                service: servicesDiscountData.service,
                car_care_category: servicesDiscountData.car_care_category_id,
                car_care_sub_category: servicesDiscountData.car_care_sub_category_id,
                car_care_discount_price: servicesDiscountData.car_care_discount_price,
                discount_car_care_category: servicesDiscountData.discount_car_care_category,
                discount_car_care_sub_category: servicesDiscountData.discount_car_care_sub_category,
                start_discount_date: servicesDiscountData.start_discount_date,
                end_discount_date: servicesDiscountData.end_discount_date,
                discount_type: servicesDiscountData.discount_type,
                status: servicesDiscountData.status,
                createdAt: servicesDiscountData.createdAt,
                updatedAt: servicesDiscountData.updatedAt
            })
        });

        const getServicesByCategory = await fetchCarCareDetailsByCarCareCategory(servicesDiscount);
        const concatValue = servicesDiscount.concat(getServicesByCategory)
        // console.log('getServicesByCategory : ', getServicesByCategory);
        res.status(200).json({ status: 1, data: servicesDiscount, data1: getServicesByCategory });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewCarCareDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getServices = await CarCareDiscount.findById({ _id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name"] },
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateCarCareDiscount = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const service = await CarCareDiscount.findById({ _id })!

        service!.car_care_category_id = req.body.car_care_category_id ? req.body.car_care_category_id : service!.car_care_category_id
        service!.car_care_sub_category_id = req.body.car_care_sub_category_id ? req.body.car_care_sub_category_id : service!.car_care_sub_category_id
        service!.car_care_discount_price = req.body.car_care_discount_price ? req.body.car_care_discount_price : service!.car_care_discount_price
        service!.discount_car_care_category = req.body.discount_car_care_category ? req.body.discount_car_care_category : service!.discount_car_care_category
        service!.discount_car_care_sub_category = req.body.discount_car_care_sub_category ? req.body.discount_car_care_sub_category : service!.discount_car_care_sub_category
        service!.discount_type = req.body.discount_type ? req.body.discount_type : service!.discount_type
        service!.start_discount_date = req.body.slug ? req.body.start_discount_date : service!.start_discount_date
        service!.end_discount_date = req.body.end_discount_date ? req.body.end_discount_date : service!.end_discount_date

        await service!.save()
        res.status(200).json({ status: 1, message: `Discount updated successfully!`, data: service })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveCarCareDiscount = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const services = await CarCareDiscount.findById({ _id })

        if (!services) {
            res.status(404).json({ status: 0, message: 'car care package not found!' });
        }

        services!.status = status

        await services!.save();
        // res.status(200).json({ status: 1, message: `${services!.service_name} updated successfully!`, data: services })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


export { createCarCareDiscount, carCareDiscountList, viewCarCareDiscount, updateCarCareDiscount, activeDeactiveCarCareDiscount }