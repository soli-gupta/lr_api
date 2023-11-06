import { Request, Response } from "express";
import CarCare from "../../users/models/car-care";

const userCarCareLeadList = async (req: Request, res: Response) => {
    try {
        const carCareData: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const getCarCare = await CarCare.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getCarCare) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        getCarCare.forEach((car_care) => {
            carCareData.push({
                _id: car_care._id,
                first_name: car_care.first_name,
                last_name: car_care.last_name,
                mobile: car_care.mobile,
                brand_name: car_care.brand_name,
                model_name: car_care.model_name,
                color: car_care.color,
                status: car_care.status,
                createdAt: car_care.createdAt,
                updatedAt: car_care.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: carCareData })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const editCarCareDetailsByAdmin = async (req: Request, res: Response) => {
    try {
        const order_id: any = req.params.id;
        if (!order_id) {
            return res.status(400).json({ status: 2, message: `Something went wrong. Please refresh the page and try again.` })
        }

        const order = await CarCare.findById({ _id: order_id });
        if (!order) {
            return res.status(400).json({ status: 2, message: `Service not available.` })
        }
        res.status(200).json({ status: 1, order });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateCarCareDetailByAdmin = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const _id = req.body.order_id
        const order = await CarCare.findById({ _id })

        order!.status = req.body.status ? req.body.status : order!.status
        order!.cancel_reason_dscription = req.body.cancel_reason_dscription ? req.body.cancel_reason_dscription : ''

        await order!.save()
        res.status(200).json({ status: 1, message: 'Car Care Data Update Successfully', order });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { userCarCareLeadList, editCarCareDetailsByAdmin, updateCarCareDetailByAdmin }