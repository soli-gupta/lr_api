import { Request, Response, NextFunction } from "express";
import ServiceDiscount from "../../service/models/service-discount";
import { fetchServiceSubCat } from "../../../helpers/users/commonHelper";
import { fetchServiceDetailsByServiceCategory } from "../../../helpers/admin/Helper";

const createServicesDiscount = async (req: Request, res: Response) => {
    try {
        let discount_service_category: any = ''
        let discount_service_sub_category: any = ''

        if (req.body.service_category_id) {
            discount_service_category = 1
        }



        if (req.body.service_sub_category_id) {
            discount_service_sub_category = 2
        }
        let mulservices: any = '';
        const data = {
            service: req.body.service,
            service_category_id: req.body.service_category_id,
            service_sub_category_id: req.body.service_sub_category_id ? req.body.service_sub_category_id : null,
            service_discount_price: req.body.service_discount_price,
            discount_service_category: discount_service_category,
            discount_service_sub_category: discount_service_sub_category,
            discount_type: req.body.discount_type,
            start_discount_date: req.body.start_discount_date,
            end_discount_date: req.body.end_discount_date,
        }
        if (req.body.service_category_id && !req.body.service_sub_category_id) {
            const serviceSubCat = await fetchServiceSubCat(req.body.service_category_id)
            // return false  
            serviceSubCat.map((subCat: any, i: any) => {
                for (let i = 0; i < serviceSubCat.length; i++) {
                    mulservices = new ServiceDiscount({
                        service: req.body.service,
                        service_category_id: req.body.service_category_id,
                        service_sub_category_id: subCat.sub_cate_id,
                        service_discount_price: req.body.service_discount_price,
                        discount_service_category: discount_service_category,
                        discount_service_sub_category: discount_service_sub_category,
                        discount_type: req.body.discount_type,
                        start_discount_date: req.body.start_discount_date,
                        end_discount_date: req.body.end_discount_date,
                    })
                }
                mulservices.save()
            })

        } else {
            const services = new ServiceDiscount(data)
            services.save()
        }
        res.status(201).json({ status: 1, message: "Your service discount created successfully" })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const servicesDiscountList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const servicesDiscount: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 100;
        const skip = (page - 1) * limit;

        // let subCategory = await ServiceDiscount.find({})
        // subCategory.forEach((subcate) => {
        //     // console.log(subcate)
        //     if (subcate.service_sub_category_id === null) {
        //         const getServicesDiscount = ServicesSubCategory.where({ service_category_id: subcate.service_category_id })!
        //         console.log(getServicesDiscount)
        //     }
        // })
        // return false
        const getServicesDiscount = await ServiceDiscount.find({}).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name"] }
        ]).skip(skip).limit(limit);


        if (!getServicesDiscount) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServicesDiscount.forEach((servicesDiscountData) => {
            servicesDiscount.push({
                _id: servicesDiscountData._id,
                service: servicesDiscountData.service,
                service_category: servicesDiscountData.service_category_id,
                service_sub_category: servicesDiscountData.service_sub_category_id,
                service_discount_price: servicesDiscountData.service_discount_price,
                discount_service_category: servicesDiscountData.discount_service_category,
                discount_service_sub_category: servicesDiscountData.discount_service_sub_category,
                start_discount_date: servicesDiscountData.start_discount_date,
                end_discount_date: servicesDiscountData.end_discount_date,
                discount_type: servicesDiscountData.discount_type,
                status: servicesDiscountData.status,
                createdAt: servicesDiscountData.createdAt,
                updatedAt: servicesDiscountData.updatedAt
            })
        });

        const getServicesByCategory = await fetchServiceDetailsByServiceCategory(servicesDiscount);
        const concatValue = servicesDiscount.concat(getServicesByCategory)
        // console.log('getServicesByCategory : ', getServicesByCategory);
        res.status(200).json({ status: 1, data: servicesDiscount, data1: getServicesByCategory });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const viewServicesDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id

        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const getServices = await ServiceDiscount.findById({ _id }).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name"] },
        ])

        if (!getServices) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        res.status(200).json({ status: 1, data: getServices })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }

}

const updateServiceDiscount = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const service = await ServiceDiscount.findById({ _id })!

        service!.service_category_id = req.body.service_category_id ? req.body.service_category_id : service!.service_category_id
        service!.service_sub_category_id = req.body.service_sub_category_id ? req.body.service_sub_category_id : service!.service_sub_category_id
        service!.service_discount_price = req.body.service_discount_price ? req.body.service_discount_price : service!.service_discount_price
        service!.discount_service_category = req.body.discount_service_category ? req.body.discount_service_category : service!.discount_service_category
        service!.discount_service_sub_category = req.body.discount_service_sub_category ? req.body.discount_service_sub_category : service!.discount_service_sub_category
        service!.discount_type = req.body.discount_type ? req.body.discount_type : service!.discount_type
        service!.start_discount_date = req.body.slug ? req.body.start_discount_date : service!.start_discount_date
        service!.end_discount_date = req.body.end_discount_date ? req.body.end_discount_date : service!.end_discount_date

        await service!.save()
        res.status(200).json({ status: 1, message: `Discount updated successfully!`, data: service })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const activeDeactiveServiceDiscount = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const services = await ServiceDiscount.findById({ _id })

        if (!services) {
            res.status(404).json({ status: 0, message: 'services not found!' });
        }

        services!.status = status

        await services!.save();
        // res.status(200).json({ status: 1, message: `${services!.service_name} updated successfully!`, data: services })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


export { createServicesDiscount, servicesDiscountList, viewServicesDiscount, updateServiceDiscount, activeDeactiveServiceDiscount }