import { model, Schema, Document } from "mongoose";

export interface IServices extends Document {
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
    // service_name: string,
    // service_slug: string,
    service_price: string,
    // service_taken_hours: string,
    // service_short_description: string,
    // service_description: string,
    // service_recommend: string,
    // service_sorting: number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const serviceSchema = new Schema({
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
    // service_name: {
    //     type: String,
    //     trim: true,
    // },
    // service_slug: {
    //     type: String,
    //     unique: false,
    // },
    service_price: {
        type: String,
        trim: true,
        // required: true
    },
    // service_taken_hours: {
    //     type: String,
    //     trim: true,
    // },
    // service_short_description: {
    // type: String,
    // trim: true,
    // required: true
    // },
    // service_description: {
    //     type: String,
    //     trim: true,
    // required: true
    // },
    // service_recommend: {
    //     type: String,
    //     trim: true,
    //     default: 'no'
    // },
    // service_sorting: {
    //     type: Number,
    //     trim: true
    // },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

serviceSchema.methods.toJSON = function () {
    const service = this
    const serviceObj = service.toObject()
    delete serviceObj.__v;
    return serviceObj;
}

const Services = model<IServices>('service', serviceSchema)

export default Services