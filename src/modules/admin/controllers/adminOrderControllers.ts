import { Request, Response } from "express";
import Orders from "../../users/models/orders";
import Products from "../../product/models/product-model";


const fetchAllOrders = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const order_type = req.query.orderType;

        const getOrders = await Orders.find({ order_type }).sort({ createdAt: -1 }).skip(skip).limit(limit);

        if (!getOrders) {
            return res.status(400).json({ status: 2, meesage: 'No orders found.' });
        }


        res.status(200).json({ status: 1, orders: getOrders })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const order_id: any = req.params.orderId;
        if (!order_id) {
            return res.status(400).json({ status: 2, message: `This car has been bought or booked by someone else. Please contact our Customer Service Representative.` });
        }

        const order = await Orders.findById({ _id: order_id });
        if (!order) {
            return res.status(400).json({ status: 2, message: `This car has been bought or booked by someone else. Please contact our Customer Service Representative.` })
        }
        res.status(200).json({ status: 1, order });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const completeOrderByAdmin = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        // const order_id: any = req.query.order_id;
        // const status: any = req.query.status;

        // if (!order_id) {
        //     return res.status(400).json({ status: 2, message: `This action is not allowed at this time. Please refresh the page and click again.` })
        // }
        // if (!status) {
        //     return res.status(400).json({ status: 2, message: `This action is not allowed at this time. Please refresh the page and click again.` })
        // }
        const order = await Orders.findById({ _id: body.order_id });
        if (!order) {
            return res.status(400).json({ status: 2, message: `This action is not allowed at this time. Please refresh the page and click again.` })
        }
        order!.order_status = body.order_status;
        order!.order_cancel_description = body.order_description;

        if (order!.order_type === "buy" && body.order_status !== "4") {
            order!.form_step = 4
        } else if (order!.order_type === "service-package" && body.order_status !== "4") {
            order!.form_step = 5
        } else if (order!.order_type === "extended-warranty" && body.order_status !== "4") {
            order!.form_step = 5
        }

        if (order!.order_type === "buy" && body.order_status === "4") {
            order!.form_step = 1
        } else if (order!.order_type === "service-package" && body.order_status === "4") {
            order!.form_step = 1
        } else if (order!.order_type === "extended-warranty" && body.order_status === "4") {
            order!.form_step = 1
        }

        await order.save();


        let orderStatus = '';
        if (order!.order_type === 'buy') {

            const product = await Products.findById({ _id: order!.order_product_id });

            if (body.order_status === "1") {
                orderStatus = 'Booked'
                product!.product_status = "booked"
            } else if (body.order_status === "2") {
                orderStatus = 'Completed'
                product!.product_status = "sold";
            } else if (body.order_status === "3") {
                orderStatus = 'Cancelled'
                product!.product_status = "live";
            }

            await product!.save();
        } else if (order!.order_type === "service-package") {
            if (body.order_status === "1") {
                orderStatus = 'Completed'
            } else if (body.order_status === "2") {
                orderStatus = ''
            } else if (body.order_status === "3") {
                orderStatus = 'Expired'
            }
        } else if (order!.order_type === "extended-warranty") {
            if (body.order_status === "1") {
                orderStatus = 'Completed'
            } else if (body.order_status === "2") {
                orderStatus = ''
            } else if (body.order_status === "3") {
                orderStatus = 'Expired'
            }
        }

        let carName = order.order_car_name === undefined ? order.order_brand_name + ' ' + order.order_model_name + ' ' + order.order_variant_name : order.order_car_name;

        res.status(200).json({ status: 1, message: `The order for  ${carName} by ${order.user_first_name ? order.user_first_name : ''} ${order.user_last_name ? order.user_last_name : ''} has been successfully ${orderStatus}.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



export { fetchAllOrders, getOrderDetails, completeOrderByAdmin };