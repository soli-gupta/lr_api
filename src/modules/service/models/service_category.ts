import { model, Schema, Document } from "mongoose";

export interface IServiceCategory extends Document {
    service_category_name: string,
    service_category_slug: string,
    service_category_description: string,
    service_category_image: string,
    service_category_sorting: number,
    service_category_status: number,
    createdAt: string,
    updatedAt: string
}

const serviceCategorySchema = new Schema({
    service_category_name: {
        type: String,
        required: true,
        trim: true
    },
    service_category_slug: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    service_category_image: {
        type: String,
        required: true
    },
    service_category_description: {
        type: String,
    },
    service_category_sorting: {
        type: Number
    },
    service_category_status: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

serviceCategorySchema.methods.toJSON = function () {
    const service_cate = this
    const serviceCateObj = service_cate.toObject()
    delete serviceCateObj.__v;
    return serviceCateObj;
}

const ServiceCategory = model<IServiceCategory>('service_category', serviceCategorySchema)

export default ServiceCategory