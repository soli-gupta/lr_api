import { model, Schema, Document } from "mongoose";

export interface ICarCareSubCategory extends Document {
    car_care_category_id: string,
    car_care_sub_category_name: string,
    car_care_sub_category_slug: string,
    car_care_taken_hours: string,
    car_care_short_description: string,
    car_care_description: string,
    car_care_recommend: string,
    car_care_sorting: number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const carCareSubCategorySchema = new Schema({
    car_care_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car_care_category'
    },
    car_care_sub_category_name: {
        type: String,
        trim: true,
        required: true
    },
    car_care_sub_category_slug: {
        type: String,
        unique: false,
    },
    car_care_taken_hours: {
        type: String,
        trim: true,
    },
    car_care_short_description: {
        type: String,
        trim: true,
        required: true
    },
    car_care_description: {
        type: String,
        trim: true,
        required: true
    },
    car_care_recommend: {
        type: String,
        trim: true,
        default: 'no'
    },
    car_care_sorting: {
        type: Number,
        trim: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

carCareSubCategorySchema.methods.toJSON = function () {
    const carcare = this
    const carcareObj = carcare.toObject()
    delete carcareObj.__v;
    return carcareObj;
}

const CarCareSubCategory = model<ICarCareSubCategory>('car-care-sub-category', carCareSubCategorySchema)

export default CarCareSubCategory