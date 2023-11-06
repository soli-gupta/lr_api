import { Schema, Document, model } from "mongoose";

export interface ICarCare extends Document {
    user_id: string,
    first_name?: string,
    last_name?: string,
    step_form?: number,
    email: string,
    mobile: string,
    brand_name: string,
    model_name: string,
    color: string,
    center_name?: string,
    center_address?: string,
    address_type?: string,
    full_address?: string,
    slot_day?: string,
    slot_time?: string,
    pickup_car?: string,
    pickup_car_address_type?: string,
    pickup_car_address?: string,
    pickup_person_name?: string,
    pickup_person_mobile?: string,
    payment_type: string,
    cancel_reason?: string,
    cancel_reason_dscription?: string,
    status: number,
    order_id: string,
    createdAt: string,
    updatedAt: string,
}

const carCareSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    first_name: {
        type: String,
        trim: true,
        required: false,
    },
    last_name: {
        type: String,
        trim: true,
        required: false
    },
    mobile: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
    },
    brand_name: {
        type: String,
        trim: true,
        required: true
    },
    model_name: {
        type: String,
        trim: true,
        required: true,
    },
    color: {
        type: String,
        trim: true,
        required: true
    },
    car_care_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'car_care_category'
    },
    car_care_id: {
        type: Schema.Types.ObjectId,
        ref: 'car_care'
    },
    center_name: {
        type: String,
        trim: true,
    },
    center_address: {
        type: String,
        trim: true
    },
    step_form: {
        type: Number
    },
    address_type: {
        type: String,
        trim: true,
    },
    full_address: {
        type: String,
        trim: true,
    },
    slot_day: {
        type: String,
        trim: true,
    },
    slot_time: {
        type: String,
        trim: true,
    },
    pickup_car: {
        type: String,
        trim: true,
    },
    pickup_car_address_type: {
        type: String,
        trim: true,
    },
    pickup_car_address: {
        type: String,
        trim: true,
    },
    pickup_person_name: {
        type: String,
        trim: true,
    },
    pickup_person_mobile: {
        type: String,
        trim: true,
    },
    payment_type: {
        type: String,
        trim: true,
    },
    order_id: {
        type: String,
        trim: true
    },
    cancel_reason: {
        type: String,
        trim: true
    },
    cancel_reason_dscription: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

const CarCare = model<ICarCare>('car-care-lead', carCareSchema)

export default CarCare