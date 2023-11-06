import { model, Schema, Document } from "mongoose";

export interface ICarCareDiscount extends Document {
    service: string,
    car_care_category_id: string,
    car_care_sub_category_id: string,
    car_care_discount_price: number,
    discount_car_care_category: number, // 1 => all Category, 2 => category and service 
    discount_car_care_sub_category: number, // 2 => 
    start_discount_date: string,
    end_discount_date: string,
    discount_type: string,  // 1 => amount, 2 => percentage
    status: number,
    createdAt: string,
    updatedAt: string,
}

const carCareDiscountSchema = new Schema({
    service: {
        type: String
    },
    car_care_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car_care_category'
    },
    car_care_sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car-care-sub-category',
    },
    car_care_discount_price: {
        type: Number,
        trim: true,
        required: true
    },
    discount_car_care_category: {
        type: Number,
        trim: true,
    },
    discount_car_care_sub_category: {
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

carCareDiscountSchema.methods.toJSON = function () {
    const carCare = this
    const carCareObj = carCare.toObject()
    delete carCareObj.__v;
    return carCareObj;
}

const CarCareDiscount = model<ICarCareDiscount>('car_care_discount', carCareDiscountSchema)

export default CarCareDiscount