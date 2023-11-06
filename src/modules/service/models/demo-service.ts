import { model, Schema, Document } from "mongoose";

export interface IDemoServices extends Document {
    brand_id: string,
    brand_name: string,
    model_id: string,
    model_name: string,
    variant_id: string,
    variant_name: string,
    fuel_type: string,
    body_type: string,
    service_category_id: string,
    service_sub_category_id: string,
    service_price: number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const serviceDemoSchema = new Schema({
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'brands'
    },
    brand_name: {
        type: String,
        trim: true
    },
    model_id: {
        type: Schema.Types.ObjectId,
        ref: 'brand_model'
    },
    model_name: {
        type: String,
        trim: true
    },
    variant_id: {
        type: Schema.Types.ObjectId,
        ref: 'model_variants'
    },
    variant_name: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        trim: true
    },
    fuel_type: {
        type: String,
        trim: true
    },
    body_type: {
        type: String,
        trim: true
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
        // required: true
    },

    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

serviceDemoSchema.methods.toJSON = function () {
    const serviceDemo = this
    const serviceDemoObj = serviceDemo.toObject()
    delete serviceDemoObj.__v;
    return serviceDemoObj;
}

const ServicesDemo = model<IDemoServices>('demo-service', serviceDemoSchema)

export default ServicesDemo