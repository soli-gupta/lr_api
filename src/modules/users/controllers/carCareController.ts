import { Request, Response } from "express";
import CarCare from "../models/car-care";
import { generateRequestID } from "../../../helpers/common_helper";
import CarCareCategory from "../../car-care/models/car-care-category";
import { filterCarCarebyCarDetails } from "../../../helpers/users/commonHelper";
import CarCareSubCategory from "../../car-care/models/car-care-sub-category";
import { ObjectId } from "mongodb";
import CarCares from "../../car-care/models/car-cares";
import CarCareDiscount from "../../car-care/models/car-care-discount";
import CarCareAddToCart from "../models/car-care-add-to-cart";

const DIR = 'public/car-care-category/'

const saveCarCareDetails = async (req: Request, res: Response) => {

    try {
        const data = {
            user_id: req.user!._id,
            first_name: req.body.first_name ? req.body.first_name : req.user!.first_name,
            last_name: req.body.last_name ? req.body.last_name : req.user!.last_name,
            mobile: req.user!.mobile,
            email: req.user!.email,
            brand_name: req.body.brand_name,
            model_name: req.body.model_name,
            color: req.body.color,
            order_id: await generateRequestID(),
            step_form: 1,
            status: 5
        }

        const saveCarCare = new CarCare(data)
        await saveCarCare.save()

        res.status(201).json({ status: 1, message: 'Thank you for choosing car care service. We will contact you soon!', insertId: saveCarCare._id })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const editCarCareDetails = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const saveCarCare = await CarCare.findById({ _id })
        res.status(201).json({ status: 1, data: saveCarCare })
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateCarCareDetails = async (req: Request, res: Response) => {

    try {
        const _id = req.params.id
        const getCarCare = await CarCare.findById({ _id })

        if (req.body.step_form === 2) {

            getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
            getCarCare!.center_name = req.body.center_name ? req.body.center_name : getCarCare!.center_name
            getCarCare!.center_address = req.body.center_address ? req.body.center_address : getCarCare!.center_address
            getCarCare!.status = 5
        }

        if (req.body.step_form === 3) {

            getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
            getCarCare!.address_type = req.body.address_type ? req.body.address_type : getCarCare!.address_type
            getCarCare!.full_address = req.body.full_address ? req.body.full_address : getCarCare!.full_address
            getCarCare!.status = 5
        }

        if (req.body.step_form === 4) {
            getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
            getCarCare!.slot_day = req.body.slot_day ? req.body.slot_day : getCarCare!.slot_day
            getCarCare!.slot_time = req.body.slot_time ? req.body.slot_time : getCarCare!.slot_time
            getCarCare!.status = 5
        }

        if (req.body.step_form === 5) {
            // console.log(req.body)
            // return false
            if (req.body.pickup_car === 'yes') {
                getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
                getCarCare!.pickup_car = req.body.pickup_car ? req.body.pickup_car : getCarCare!.pickup_car
                getCarCare!.pickup_car_address_type = req.body.pickup_car_address_type ? req.body.pickup_car_address_type : getCarCare!.pickup_car_address_type
                getCarCare!.pickup_car_address = req.body.pickup_car_address ? req.body.pickup_car_address : getCarCare!.pickup_car_address
                getCarCare!.pickup_person_name = ''
                getCarCare!.pickup_person_mobile = ''
                getCarCare!.status = 5
            }

            if (req.body.pickup_car === 'no') {
                getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
                getCarCare!.pickup_car = req.body.pickup_car ? req.body.pickup_car : getCarCare!.pickup_car
                getCarCare!.pickup_person_name = req.body.pickup_person_name ? req.body.pickup_person_name : req.user!.first_name + ' ' + req.user!.last_name
                getCarCare!.pickup_person_mobile = req.body.pickup_person_mobile ? req.body.pickup_person_mobile : getCarCare!.pickup_person_mobile
                getCarCare!.pickup_car_address_type = ''
                getCarCare!.pickup_car_address = ''
                getCarCare!.status = 5
            }
        }

        if (req.body.step_form === 6) {
            getCarCare!.step_form = req.body.step_form ? req.body.step_form : getCarCare!.step_form
            getCarCare!.payment_type = "Pay at Worshop"
            getCarCare!.status = 1
        }

        await getCarCare!.save()
        res.status(200).json({ status: 1, data: getCarCare, })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const cancelCarCareRequestData = async (req: Request, res: Response) => {

    try {
        const _id = req.body.id
        const status = req.body.status

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const sell = await CarCare.findById({ _id });
        sell!.cancel_reason = req.body.cancel_reason
        sell!.cancel_reason_dscription = req.body.cancel_reason_dscription
        sell!.status = status
        await sell!.save()
        res.status(200).json({ status: 1, message: 'Your evaluation canceled successfully!' });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const rescheduleCarCareRequest = async (req: Request, res: Response) => {
    try {
        const _id = req.body.id
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const carcare = await CarCare.findById({ _id });
        carcare!.slot_day = req.body.slot_day
        carcare!.slot_time = req.body.slot_time
        carcare!.status = 1
        await carcare!.save()
        res.status(200).json({ status: 1, message: 'Your reschedule evaluation successfully!' });

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


const allUserCarCareList = async (req: Request, res: Response) => {
    try {
        const carCare: any = [];
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

        const getCarCareData = await CarCare.find({}).where({ user_id: req.user!._id }).where(buildQuery).sort({ createdAt: -1 });
        if (!getCarCareData) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        getCarCareData.forEach((carcare) => {
            carCare.push({
                _id: carcare._id,
                first_name: carcare.first_name,
                last_name: carcare.last_name,
                brand_name: carcare.brand_name,
                model_name: carcare.model_name,
                color: carcare.color,
                order_id: carcare.order_id,
                step_form: carcare.step_form,
                center_name: carcare.center_name,
                center_address: carcare.center_address,
                address_type: carcare.address_type,
                full_address: carcare.full_address,
                slot_day: carcare.slot_day,
                slot_time: carcare.slot_time,
                pickup_car: carcare.pickup_car,
                pickup_car_address: carcare.pickup_car_address,
                pickup_car_address_type: carcare.pickup_car_address_type,
                pickup_person_mobile: carcare.pickup_person_mobile,
                pickup_person_name: carcare.pickup_person_name,
                payment_type: carcare.payment_type,
                status: carcare.status,
                createdAt: carcare.createdAt,
                updatedAt: carcare.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: carCare });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const carCaresCategoryList = async (req: Request, res: Response) => {
    try {
        const serviceCategories: any = [];
        const getServiceCategory = await CarCareCategory.find({}).where({ car_care_category_status: 1 });

        if (!getServiceCategory) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        getServiceCategory.forEach((categories) => {
            serviceCategories.push({
                _id: categories._id,
                name: categories.car_care_category_name,
                slug: categories.car_care_category_slug,
                image: categories.car_care_category_image ? DIR + categories.car_care_category_image : '',
                description: categories!.car_care_category_description,
                sorting: categories!.car_care_category_sorting,
                status: categories.car_care_category_status,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: serviceCategories });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const fetchCarCareByCategoryId = async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        const services: any = [];
        const id = req.body.id
        const body: any = req.body;
        let queryBuilder: any = {}

        if (body.brandName && body.modelName && body.colorName) {
            const filterData = await filterCarCarebyCarDetails(body.id, body.brandName, body.modelName, body.colorName, res)
            res.status(200).json({ status: 1, data: filterData });
        } else {
            const getServices = await CarCareSubCategory.find({ car_care_category_id: id }).populate([
                { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] }
            ]);

            if (!getServices) {
                return res.status(400).send({ status: 0, message: 'Data not available!' });
            }
            getServices.forEach((servicesData) => {
                services.push({
                    _id: servicesData._id,
                    car_care_category: servicesData.car_care_category_id,
                    car_care_sub_category_name: servicesData.car_care_sub_category_name,
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
            res.status(200).json({ status: 1, data: services });
        }

    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}
const getCarCareById = async (req: Request, res: Response) => {
    try {
        const services: any = [];
        const _id = req.params.id
        const servicesData = await CarCares.findById({ _id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name", "car_care_category_slug"] }
        ]);

        if (!servicesData) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        const data = {
            _id: servicesData._id,
            brand_id: servicesData.brand_id,
            model_id: servicesData.model_id,
            color: servicesData.car_care_color,
            car_care_category: servicesData.car_care_category_id,
            status: servicesData.status,
            createdAt: servicesData.createdAt,
            updatedAt: servicesData.updatedAt
        }
        res.status(200).json({ status: 1, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const fetchCarCarebyCarDetails = async (req: Request, res: Response) => {
    try {
        const services: any = [];
        const queryData = req.query
        // console.log(queryData);
        const responseData = [];
        let grossAmount = 0
        let discountAmount = 0
        let getServices = await CarCares.find({ car_care_category_id: queryData.id, brand_name: queryData.brandId, model_name: queryData.modelId, car_care_color: queryData.color }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_category_slug", "car_care_category_slug", "car_care_taken_hours", "car_care_short_description", "car_care_description"] }
        ]);

        for (const getServicess of getServices) {
            let catId = new ObjectId(getServicess.car_care_category_id).toString()
            let subCatId = new ObjectId(getServicess.car_care_sub_category_id).toString()
            // console.log(subCatId)
            let discount = await CarCareDiscount.find({ car_care_category_id: catId, car_care_sub_category_id: subCatId })

            if (discount && discount.length > 0) {
                discount.map((dis) => {
                    if (dis.discount_type === '1') {
                        discountAmount = dis.car_care_discount_price
                        grossAmount = getServicess.car_care_price - dis.car_care_discount_price
                        // console.log(grossAmount)
                    }
                    if (dis.discount_type === '2') {
                        // (getServicess.service_price * dis.service_discount_price) / 100;
                        let disAmount = (dis.car_care_discount_price / 100) * getServicess.car_care_price;
                        discountAmount = disAmount
                        grossAmount = getServicess.car_care_price - disAmount
                        // console.log(grossAmount)
                    }

                    responseData.push({
                        ...getServicess.toJSON(),
                        car_care_price: getServicess.car_care_price,
                        discount: discountAmount,
                        grossAmount: grossAmount,
                    });
                })
            } else {
                responseData.push({
                    ...getServicess.toJSON(),
                    car_care_price: getServicess.car_care_price,
                    discount: 0,
                    grossAmount: 0,
                });
            }
            // let discount = await ServiceDiscount.find({getServicess})
        }

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }

        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                brand_id: servicesData.brand_name,
                model_id: servicesData.model_name,
                color: servicesData.car_care_color,
                car_care_category: servicesData.car_care_category_id,
                car_care_sub_category: servicesData.car_care_sub_category_id,
                car_care_price: servicesData.car_care_price,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });

        res.status(200).json({ status: 1, data: services, datas: responseData });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const addToCartCarCare = async (req: Request, res: Response) => {
    try {

        const allServiceAddToCart: any = [];
        let total_price = 0
        let gst_price = 0
        let grand_price = 0

        const data = {
            user_id: req.user!._id,
            car_care_id: req.body._id,
            car_care_category_id: req.body.car_care_category_id._id,
            car_care_sub_category_id: req.body.car_care_sub_category_id._id,
            car_care_price: req.body.grossAmount != 0 ? req.body.grossAmount : req.body.car_care_price,
            order_id: req.body.orderId ? req.body.orderId : ''
        }

        const serviceAddToCart = new CarCareAddToCart(data)
        await serviceAddToCart.save()

        const service = await CarCareAddToCart.find({ user_id: req.user?._id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_category_slug", "car_care_category_slug", "car_care_taken_hours", "car_care_short_description"] },
        ]).sort({ createdAt: -1 })

        const totalPrice = await CarCareAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$car_care_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst
        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                car_care_category: orderData.car_care_category_id,
                car_care_sub_category: orderData.car_care_sub_category_id,
                car_care_price: orderData.car_care_price,
                car_care_id: orderData.car_care_id,
                order_id: orderData.order_id
            })
        });
        res.status(200).json({ status: 1, message: 'Your Car care package add to cart successfully', data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })
    } catch (error) {

    }

}

const removeToCartCarCare = async (req: Request, res: Response) => {
    try {
        const allServiceAddToCart: any = [];
        let total_price = 0
        let grand_price = 0
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const contact = await CarCareAddToCart.findById({ _id })

        if (!contact) {
            res.status(404).json({ status: 0, message: 'Data not found!' });
        }
        await CarCareAddToCart.deleteOne({ _id })


        const service = await CarCareAddToCart.find({ user_id: req.user?._id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_category_slug", "car_care_category_slug", "car_care_taken_hours", "car_care_short_description"] },
        ])

        const totalPrice = await CarCareAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$car_care_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst

        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                car_care_category: orderData.car_care_category_id,
                car_care_sub_category: orderData.car_care_sub_category_id,
                car_care_id: orderData.car_care_id,
                car_care_price: orderData.car_care_price,
                order_id: orderData.order_id
            })
        });

        res.status(200).json({ status: 1, message: `Car Care package remove to cart`, data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const selectCarCareAddTOCartByOrderId = async (req: Request, res: Response) => {
    try {
        const allServiceAddToCart: any = [];
        let total_price = 0
        let grand_price = 0
        const service = await CarCareAddToCart.find({ user_id: req.user?._id, order_id: req.params.id }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_category_slug", "car_care_category_slug", "car_care_taken_hours", "car_care_short_description"] },
        ]).sort({ createdAt: -1 })

        const totalPrice = await CarCareAddToCart.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPrice: { "$sum": "$car_care_price" }
                }
            }
        ])

        total_price = totalPrice[0].totalPrice
        let gst = (totalPrice[0].totalPrice * 18) / 100
        grand_price = totalPrice[0].totalPrice + gst
        service.forEach((orderData) => {
            allServiceAddToCart.push({
                _id: orderData._id,
                car_care_category: orderData.car_care_category_id,
                car_care_sub_category: orderData.car_care_sub_category_id,
                car_care_price: orderData.car_care_price
            })
        });
        res.status(200).json({ status: 1, message: 'Your Car Care add to cart successfully', data: allServiceAddToCart, total_price: total_price, gst: gst, grand_price: grand_price })
    } catch (error) {

    }
}

export { saveCarCareDetails, editCarCareDetails, updateCarCareDetails, allUserCarCareList, rescheduleCarCareRequest, cancelCarCareRequestData, carCaresCategoryList, fetchCarCareByCategoryId, getCarCareById, fetchCarCarebyCarDetails, addToCartCarCare, removeToCartCarCare, selectCarCareAddTOCartByOrderId }