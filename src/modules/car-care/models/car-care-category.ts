import { model, Schema, Document } from "mongoose";

export interface ICarCareCategory extends Document {
    car_care_category_name: string,
    car_care_category_slug: string,
    car_care_category_description: string,
    car_care_category_image: string,
    car_care_category_sorting: number,
    car_care_category_status: number,
    createdAt: string,
    updatedAt: string
}

const carCareCategorySchema = new Schema({
    car_care_category_name: {
        type: String,
        required: true,
        trim: true
    },
    car_care_category_slug: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    car_care_category_image: {
        type: String,
        required: true
    },
    car_care_category_description: {
        type: String,
    },
    car_care_category_sorting: {
        type: Number
    },
    car_care_category_status: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

carCareCategorySchema.methods.toJSON = function () {
    const car_care_cate = this
    const carCareCateObj = car_care_cate.toObject()
    delete carCareCateObj.__v;
    return carCareCateObj;
}

const CarCareCategory = model<ICarCareCategory>('car_care_category', carCareCategorySchema)

export default CarCareCategory