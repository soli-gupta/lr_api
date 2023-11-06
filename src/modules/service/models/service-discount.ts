import { model, Schema, Document } from "mongoose";

export interface IServices extends Document {
    service: string,
    service_category_id: string,
    service_sub_category_id: string,
    service_discount_price: number,
    discount_service_category: number, // 1 => all Category, 2 => category and service 
    discount_service_sub_category: number, // 2 => 
    start_discount_date: string,
    end_discount_date: string,
    discount_type: string,  // 1 => amount, 2 => percentage
    status: number,
    createdAt: string,
    updatedAt: string,
}

const serviceDiscountSchema = new Schema({
    service: {
        type: String
    },
    service_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service_category'
    },
    service_sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service-sub-category',
    },
    service_discount_price: {
        type: Number,
        trim: true,
        required: true
    },
    discount_service_category: {
        type: Number,
        trim: true,
    },
    discount_service_sub_category: {
        type: Number,
        trim: true,
    },
    start_discount_date: {
        type: String
    },
    end_discount_date: {
        type: String
    },
    discount_type: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

serviceDiscountSchema.methods.toJSON = function () {
    const service = this
    const serviceObj = service.toObject()
    delete serviceObj.__v;
    return serviceObj;
}

const ServiceDiscount = model<IServices>('service_discount', serviceDiscountSchema)

export default ServiceDiscount