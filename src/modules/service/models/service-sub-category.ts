import { model, Schema, Document } from "mongoose";

export interface IServiceSubCategory extends Document {
    service_category_id: string,
    service_sub_category_name: string,
    service_sub_category_slug: string,
    service_taken_hours: string,
    service_short_description: string,
    service_description: string,
    service_recommend: string,
    service_sorting: number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const serviceSubCategorySchema = new Schema({
    service_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service_category'
    },
    service_sub_category_name: {
        type: String,
        trim: true,
        required: true
    },
    service_sub_category_slug: {
        type: String,
        unique: false,
    },
    service_taken_hours: {
        type: String,
        trim: true,
    },
    service_short_description: {
        type: String,
        trim: true,
        required: true
    },
    service_description: {
        type: String,
        trim: true,
        required: true
    },
    service_recommend: {
        type: String,
        trim: true,
        default: 'no'
    },
    service_sorting: {
        type: Number,
        trim: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

serviceSubCategorySchema.methods.toJSON = function () {
    const service = this
    const serviceObj = service.toObject()
    delete serviceObj.__v;
    return serviceObj;
}

const ServicesSubCategory = model<IServiceSubCategory>('service-sub-category', serviceSubCategorySchema)

export default ServicesSubCategory