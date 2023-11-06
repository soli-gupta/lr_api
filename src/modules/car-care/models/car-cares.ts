import { model, Schema, Document } from "mongoose";

export interface ICarCares extends Document {
    brand_id: string,
    brand_name: string,
    model_id: string,
    model_name: string,
    car_care_color: string,
    car_care_category_id: string,
    car_care_sub_category_id: string,
    car_care_price: number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const carCaresSchema = new Schema({
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
    car_care_color: {
        type: String,
        trim: true
    },
    car_care_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car_care_category'
    },
    car_care_sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car-care-sub-category'
    },

    car_care_price: {
        type: Number,
        trim: true,
    },

    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

carCaresSchema.methods.toJSON = function () {
    const carCare = this
    const carCareObj = carCare.toObject()
    delete carCareObj.__v;
    return carCareObj;
}

const CarCares = model<ICarCares>('car-care', carCaresSchema)

export default CarCares