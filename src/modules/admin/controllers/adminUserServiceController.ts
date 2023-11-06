import { Request, Response } from "express";
import Service from "../../users/models/service";

const userSeriveLeadList = async (req: Request, res: Response) => {
    try {
        const serviceData: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const getService = await Service.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getService) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        getService.forEach((service) => {
            serviceData.push({
                _id: service._id,
                first_name: service.first_name,
                last_name: service.last_name,
                mobile: service.mobile,
                brand_name: service.brand_name,
                model_name: service.model_name,
                variant_name: service.variant_name,
                fuel_Type: service.fuel_type,
                status: service.status,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: serviceData })
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const editServiceDetails = async (req: Request, res: Response) => {
    try {
        const order_id: any = req.params.id;
        if (!order_id) {
            return res.status(400).json({ status: 2, message: `Something went wrong. Please refresh the page and try again!` })
        }

        const order = await Service.findById({ _id: order_id });
        if (!order) {
            return res.status(400).json({ status: 2, message: `Service not available.` })
        }
        res.status(200).json({ status: 1, order });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateServiceDetail = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const _id = req.body.order_id
        const order = await Service.findById({ _id })

        order!.status = req.body.status ? req.body.status : order!.status
        order!.cancel_reason_dscription = req.body.cancel_reason_dscription ? req.body.cancel_reason_dscription : ''

        await order!.save()
        res.status(200).json({ status: 1, message: 'Service Update Successfully', order });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { userSeriveLeadList, editServiceDetails, updateServiceDetail }