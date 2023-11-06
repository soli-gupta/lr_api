import { Request, Response } from "express";
import Service from "../models/service";
import { generateRequestID } from "../../../helpers/common_helper";
import ServiceCategory from "../../service/models/service_category";
import Services from "../../service/models/services";
import ServicesSubCategory from "../../service/models/service-sub-category";
import ServicesDemo from "../../service/models/demo-service";
import ServiceAddToCart from "../models/service-add-to-cart";
import ServiceDiscount from "../../service/models/service-discount";
import { ObjectId } from "mongodb";
import { filterServicebyCarDetails } from "../../../helpers/users/commonHelper";
const DIR = 'public/service-category/'
const saveUserService = async (req: Request, res: Response) => {
    try {

        const data = {
            user_id: req.user!._id,
            first_name: req.user!.first_name,
            last_name: req.user!.last_name,
            mobile: req.user!.mobile,
            email: req.user!.email,
            year: req.body.year ? req.body.year : '',
            brand_name: req.body.brand_name,
            model_name: req.body.model_name,
            variant_name: req.body.variant_name,
            fuel_type: req.body.fuel_type,
            sevice_category_id: req.body.sevice_category_id ? req.body.sevice_category_id : '',
            order_id: await generateRequestID(),
            step_form: 1,
            status: 5
        }

        const service = new Service(data)
        await service.save()

        res.status(200).json({ status: 1, message: 'Thank you for choosing car car service. We will contact you soon.', insertId: service._id })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const editServiceDetails = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const getService = await Service.findById({ _id })
        res.status(201).json({ status: 1, data: getService })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateServiceDetails = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        const updateService = await Service.findById({ _id })

        if (updateService!.step_form === 1) {
            updateService!.brand_name = req.body.brand_name ? req.body.brand_name : updateService!.brand_name
            updateService!.model_name = req.body.model_name ? req.body.model_name : updateService!.model_name
            updateService!.variant_name = req.body.variant_name ? req.body.variant_name : updateService!.variant_name
            updateService!.fuel_type = req.body.fuel_type ? req.body.fuel_type : updateService!.fuel_type
            updateService!.sevice_category_id = req.body.sevice_category_id ? req.body.sevice_category_id : updateService!.sevice_category_id
        }

        if (req.body.step_form === 2) {
            updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
            updateService!.status = 5
        }

        if (req.body.step_form === 3) {

            updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
            updateService!.center_name = req.body.center_name ? req.body.center_name : updateService!.center_name
            updateService!.center_address = req.body.center_address ? req.body.center_address : updateService!.center_address
            updateService!.status = 5
        }

        if (req.body.step_form === 4) {
            updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
            updateService!.address_type = req.body.address_type ? req.body.address_type : updateService!.address_type
            updateService!.full_address = req.body.full_address ? req.body.full_address : updateService!.full_address
            updateService!.status = 5
        }

        if (req.body.step_form === 5) {
            updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
            updateService!.slot_day = req.body.slot_day ? req.body.slot_day : updateService!.slot_day
            updateService!.slot_time = req.body.slot_time ? req.body.slot_time : updateService!.slot_time
            updateService!.status = 5
        }

        if (req.body.step_form === 6) {
            if (req.body.pickup_car === 'yes') {
                // console.log(req.body)
                updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
                updateService!.pickup_car = req.body.pickup_car ? req.body.pickup_car : updateService!.pickup_car
                updateService!.pickup_car_address_type = req.body.pickup_car_address_type ? req.body.pickup_car_address_type : updateService!.pickup_car_address_type
                updateService!.pickup_car_address = req.body.pickup_car_address ? req.body.pickup_car_address : updateService!.pickup_car_address
                updateService!.pickup_person_name = ''
                updateService!.pickup_person_mobile = ''
                updateService!.status = 5
            }

            if (req.body.pickup_car === 'no') {
                updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
                updateService!.pickup_car = req.body.pickup_car ? req.body.pickup_car : updateService!.pickup_car
                updateService!.pickup_person_name = req.body.pickup_person_name ? req.body.pickup_person_name : updateService!.pickup_person_name
                updateService!.pickup_person_mobile = req.body.pickup_person_mobile ? req.body.pickup_person_mobile : updateService!.pickup_person_mobile
                updateService!.pickup_car_address_type = ''
                updateService!.pickup_car_address = ''
                updateService!.status = 5
            }
        }

        if (req.body.step_form === 7) {
            updateService!.step_form = req.body.step_form ? req.body.step_form : updateService!.step_form
            updateService!.payment_type = "Pay at Worshop"
            updateService!.status = 1
        }

        await updateService!.save()
        res.status(200).json({ status: 1, data: updateService, })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const cancelServiceRequestData = async (req: Request, res: Response) => {

    try {
        const _id = req.body.id
        const status = req.body.status

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const serivce = await Service.findById({ _id });
        serivce!.cancel_reason = req.body.cancel_reason
        serivce!.cancel_reason_dscription = req.body.cancel_reason_dscription
        serivce!.status = status
        await serivce!.save()
        res.status(200).json({
            status: 1, message: 'Your evaluation has been cancelled.'
        });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const rescheduleServiceRequest = async (req: Request, res: Response) => {
    try {
        const _id = req.body.id
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const service = await Service.findById({ _id });
        service!.slot_day = req.body.slot_day
        service!.slot_time = req.body.slot_time
        service!.status = 1
        await service!.save()
        res.status(200).json({ status: 1, message: 'Your reschedule evaluation successfully!' });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


const allUserServiceList = async (req: Request, res: Response) => {
    try {
        const service: any = [];
        let buildQuery: any = {};
        const status: any = req.query.type;
        if (status === '' || status === undefined) {
            buildQuery = ''
        } else if (status === 'requested') {
            buildQuery.status = 1;
        } else if (status === 'completed') {
            buildQuery.status = 2;
        } else if (status === 'cancelled') {
            buildQuery.status = 3;
        }

        const getServiceData = await Service.find({}).where({ user_id: req.user!._id }).where(buildQuery).sort({ createdAt: -1 });
        if (!getServiceData) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        getServiceData.forEach((services) => {
            service.push({
                _id: services._id,
                first_name: services.first_name,
                last_name: services.last_name,
                year: services.year,
                brand_name: services.brand_name,
                model_name: services.model_name,
                variant_name: services.variant_name,
                order_id: services.order_id,
                step_form: services.step_form,
                center_name: services.center_name,
                center_address: services.center_address,
                address_type: services.address_type,
                full_address: services.full_address,
                slot_day: services.slot_day,
                slot_time: services.slot_time,
                pickup_car: services.pickup_car,
                pickup_car_address: services.pickup_car_address,
                pickup_car_address_type: services.pickup_car_address_type,
                pickup_person_mobile: services.pickup_person_mobile,
                pickup_person_name: services.pickup_person_name,
                payment_type: services.payment_type,
                status: services.status,
                createdAt: services.createdAt,
                updatedAt: services.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: service });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const servicesCategoryList = async (req: Request, res: Response) => {
    try {
        const serviceCategories: any = [];
        const getServiceCategory = await ServiceCategory.find({}).where({ service_category_status: 1 });

        if (!getServiceCategory) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServiceCategory.forEach((categories) => {
            serviceCategories.push({
                _id: categories._id,
                name: categories.service_category_name,
                slug: categories.service_category_slug,
                image: categories.service_category_image ? DIR + categories.service_category_image : '',
                description: categories!.service_category_description,
                sorting: categories!.service_category_sorting,
                status: categories.service_category_status,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: serviceCategories });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const fetchServicesByCategoryId = async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        const services: any = [];
        const id = req.body.id
        const body: any = req.body;
        let queryBuilder: any = {}

        if (body.brandName && body.modelName && body.variantName && body.fuelName) {
            const filterData = await filterServicebyCarDetails(body.id, body.brandName, body.modelName, body.variantName, body.fuelName, res)
            res.status(200).json({ status: 1, data: filterData });
        } else {
            const getServices = await ServicesSubCategory.find({ service_category_id: id }).populate([
                { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
            ]);

            if (!getServices) {
                return res.status(400).send({ status: 0, message: 'Data not available!' });
            }
            getServices.forEach((servicesData) => {
                services.push({
                    _id: servicesData._id,
                    service_category: servicesData.service_category_id,
                    service_sub_category_name: servicesData.service_sub_category_name,
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
        }

    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}
const getServiceById = async (req: Request, res: Response) => {
    try {
        const services: any = [];
        const _id = req.params.id
        const servicesData = await Services.findById({ _id }).populate([
            { path: "service_category_id", select: ["service_category_name", "service_category_slug"] }
        ]);

        if (!servicesData) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        const data = {
            _id: servicesData._id,
            brand_id: servicesData.brand_id,
            model_id: servicesData.model_id,
            variant_id: servicesData.variant_id,
            fuel_type: servicesData.fuel_type,
            body_type: servicesData.body_type,
            service_category: servicesData.service_category_id,
            status: servicesData.status,
            createdAt: servicesData.createdAt,
            updatedAt: servicesData.updatedAt
        }
        res.status(200).json({ status: 1, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const fetchServicebyCarDetails = async (req: Request, res: Response) => {
    try {
        const services: any = [];
        const queryData = req.query
        // console.log(queryData);
        const responseData = [];
        let grossAmount = 0
        let discountAmount = 0
        let getServices = await ServicesDemo.find({ service_category_id: queryData.id, brand_name: queryData.brandId, model_name: queryData.modelId, variant_name: queryData.variantId, fuel_type: queryData.fuel }).populate([
            { path: "service_category_id", select: ["service_category_name"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug", "service_category_slug", "service_taken_hours", "service_short_description", "service_description"] }
        ]);

        for (const getServicess of getServices) {
            let catId = new ObjectId(getServicess.service_category_id).toString()
            let subCatId = new ObjectId(getServicess.service_sub_category_id).toString()
            // console.log(subCatId)
            let discount = await ServiceDiscount.find({ service_category_id: catId, service_sub_category_id: subCatId })

            if (discount && discount.length > 0) {
                discount.map((dis) => {
                    if (dis.discount_type === '1') {
                        discountAmount = dis.service_discount_price
                        grossAmount = getServicess.service_price - dis.service_discount_price
                        // console.log(grossAmount)
                    }
                    if (dis.discount_type === '2') {
                        // (getServicess.service_price * dis.service_discount_price) / 100;
                        let disAmount = (dis.service_discount_price / 100) * getServicess.service_price;
                        discountAmount = disAmount
                        grossAmount = getServicess.service_price - disAmount
                        // console.log(grossAmount)
                    }

                    responseData.push({
                        ...getServicess.toJSON(),
                        service_price: getServicess.service_price,
                        discount: discountAmount,
                        grossAmount: grossAmount,
                    });
                })
            } else {
                responseData.push({
                    ...getServicess.toJSON(),
                    service_price: getServicess.service_price,
                    discount: 0,
                    grossAmount: 0,
                });
            }
            // let discount = await ServiceDiscount.find({getServicess})
        }

        // const getServices = await Services.find({ service_category_id: queryData.id, brand_id: queryData.brand_name, model_id: queryData.model_name, variant_id: queryData.variant_name, fuel_type: queryData.fuel }).populate([
        //     { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
        //     { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug"] }
        // ]);

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }

        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                brand_id: servicesData.brand_name,
                model_id: servicesData.model_name,
                variant_id: servicesData.variant_name,
                fuel_type: servicesData.fuel_type,
                // body_type: servicesData.body_type,
                service_category: servicesData.service_category_id,
                service_sub_category: servicesData.service_sub_category_id,
                // service_name: servicesData.service_name,
                service_price: servicesData.service_price,
                // service_taken_hours: servicesData.service_taken_hours,
                // service_short_description: servicesData.service_short_description,
                // service_description: servicesData.service_description,
                // service_sorting: servicesData.service_sorting,
                // service_recommend: servicesData.service_recommend,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });
        // console.log(services)
        // return false
        res.status(200).json({ status: 1, data: services, datas: responseData });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const addToCartService = async (req: Request, res: Response) => {
    try {

        const allServiceAddToCart: any = [];
        let total_price = 0
        let gst_price = 0
        let grand_price = 0

        const data = {
            user_id: req.user!._id,
            service_id: req.body._id,
            service_category_id: req.body.service_category_id._id,
            service_sub_category_id: req.body.service_sub_category_id._id,
            service_price: req.body.grossAmount != 0 ? req.body.grossAmount : req.body.service_price,
            order_id: req.body.orderId ? req.body.orderId : ''
        }

        const serviceAddToCart = new ServiceAddToCart(data)
        await serviceAddToCart.save()

        const service = await ServiceAddToCart.find({ user_id: req.user?._id }).populate([
            { path: "service_category_id", select: ["service_category_name"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug", "service_category_slug", "service_taken_hours", "service_short_description"] },
        ]).sort({ createdAt: -1 })

        const totalPrice = await ServiceAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$service_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst
        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                service_category: orderData.service_category_id,
                service_sub_category: orderData.service_sub_category_id,
                service_price: orderData.service_price,
                service_id: orderData.service_id,
                order_id: orderData.order_id
            })
        });
        res.status(200).json({ status: 1, message: 'Your Service add to cart successfully', data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })
    } catch (error) {

    }

}

const removeToCartService = async (req: Request, res: Response) => {
    try {
        const allServiceAddToCart: any = [];
        let total_price = 0
        let grand_price = 0
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const contact = await ServiceAddToCart.findById({ _id })

        if (!contact) {
            res.status(404).json({ status: 0, message: 'Data not found!' });
        }
        await ServiceAddToCart.deleteOne({ _id })


        const service = await ServiceAddToCart.find({ user_id: req.user?._id }).populate([
            { path: "service_category_id", select: ["service_category_name"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug", "service_category_slug", "service_taken_hours", "service_short_description"] },
        ])

        const totalPrice = await ServiceAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$service_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst

        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                service_category: orderData.service_category_id,
                service_sub_category: orderData.service_sub_category_id,
                service_id: orderData.service_id,
                service_price: orderData.service_price,
                order_id: orderData.order_id
            })
        });

        res.status(200).json({ status: 1, message: `Service remove to cart`, data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const selectAddTOCartByOrderId = async (req: Request, res: Response) => {
    try {
        const allServiceAddToCart: any = [];
        let total_price = 0
        let grand_price = 0
        const service = await ServiceAddToCart.find({ user_id: req.user?._id, order_id: req.params.id }).populate([
            { path: "service_category_id", select: ["service_category_name"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug", "service_category_slug", "service_taken_hours", "service_short_description"] },
        ]).sort({ createdAt: -1 })

        const totalPrice = await ServiceAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$service_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst
        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                service_category: orderData.service_category_id,
                service_sub_category: orderData.service_sub_category_id,
                service_price: orderData.service_price
            })
        });
        res.status(200).json({ status: 1, message: 'Your Service add to cart successfully', data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })
    } catch (error) {

    }
}


export { saveUserService, editServiceDetails, updateServiceDetails, cancelServiceRequestData, rescheduleServiceRequest, allUserServiceList, servicesCategoryList, fetchServicesByCategoryId, getServiceById, fetchServicebyCarDetails, addToCartService, removeToCartService, selectAddTOCartByOrderId }