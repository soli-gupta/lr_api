import { model, Schema, Document } from "mongoose";

export interface ICarCareAddToCart extends Document {
    user_id: string,
    order_id: string,
    car_care_id: string,
    car_care_category_id: string,
    car_care_sub_category_id: string,
    car_care_price: Number,
    status: number,
    createdAt: string,
    updatedAt: string,
}

const carCareAddToCartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    car_care_id: {
        type: Schema.Types.ObjectId,
        ref: 'car-care'
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'car-care-lead'
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

carCareAddToCartSchema.methods.toJSON = function () {
    const carCareCart = this
    const carCareCartObj = carCareCart.toObject()
    delete carCareCartObj.__v;
    return carCareCartObj;
}

const CarCareAddToCart = model<ICarCareAddToCart>('car-care-add-to-cart', carCareAddToCartSchema)

export default CarCareAddToCart