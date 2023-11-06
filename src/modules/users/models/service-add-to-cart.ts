import { model, Schema, Document } from "mongoose";

export interface IServiceAddToCart extends Document {
    user_id: string,
    order_id: string,
    service_id: string,
    service_category_id: string,
    service_sub_category_id: string,
    service_price: Number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const serviceAddToCartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'brands'
    },
    service_id: {
        type: Schema.Types.ObjectId,
        ref: 'demo-service'
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'user_service_lead'
    },
    service_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service_category'
    },
    service_sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service-sub-category'
    },
    service_price: {
        type: Number,
        trim: true,
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

serviceAddToCartSchema.methods.toJSON = function () {
    const serviceDemo = this
    const serviceDemoObj = serviceDemo.toObject()
    delete serviceDemoObj.__v;
    return serviceDemoObj;
}

const ServiceAddToCart = model<IServiceAddToCart>('service-add-to-cart', serviceAddToCartSchema)

export default ServiceAddToCart