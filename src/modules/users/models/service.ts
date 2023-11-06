import { Document, model, Schema } from "mongoose";

export interface IService extends Document {
    user_id: string,
    first_name?: string,
    last_name?: string,
    mobile: string,
    email: string,
    year: string,
    brand_name: string,
    model_name: string,
    variant_name: string,
    fuel_type: string,
    sevice_category_id: string,
    step_form: number,
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
    updatedAt: string
}

const serviceSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    first_name: {
        type: String,
        required: false,
        trim: true
    },
    last_name: {
        type: String,
        required: false,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        trim: true
    },
    brand_name: {
        type: String,
        required: false,
        trim: true,
    },
    model_name: {
        type: String,
        required: true,
        trim: true,
    },
    variant_name: {
        type: String,
        required: true,
        trim: true
    },
    fuel_type: {
        type: String,
        required: true,
        trim: true,
    },
    sevice_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'service_category'
    },
    services_id: {
        type: Schema.Types.ObjectId,
        ref: 'service'
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

const Service = model<IService>('user_service_lead', serviceSchema);

export default Service

