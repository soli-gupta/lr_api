import { model, Schema, Document } from "mongoose";

export interface ISell extends Document {
    brand_id: string,
    salesforce_account_id: string,
    salesforce_opportunity_id: string,
    brand_name: string,
    brand_slug: string,
    year: string,
    model_id: string,
    model_name: string,
    model_slug: string,
    variant_id: string,
    variant_name: string,
    variant_slug: string,
    ownership: string,
    kms: string,
    user_id: string,
    user_name: string,
    user_email: string,
    user_mobile: string,
    address_type: string,
    full_address: string,
    state: string,
    city: string,
    pincode: number,
    slot_time: string,
    slot_date: string,
    expected_sell_price: string,
    rc_registration_certificate: string,
    rc_registration_thumbnail: string,
    car_insurance: string,
    car_insurance_thumbnail: string,
    cancel_reason: string,
    cancel_reason_dscription: string,
    requested_callBack: string,
    status: number,
    step_form: number,
    request_id: string,
    createdAt: string,
    updatedAt: string
}

const sellSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    salesforce_account_id: {
        type: String,
        trim: true
    },
    salesforce_opportunity_id: {
        type: String
    },
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'brands'
    },
    brand_name: {
        type: String,
        trim: true
    },
    brand_slug: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        required: true,
    },
    model_id: {
        type: Schema.Types.ObjectId,
        ref: 'brand_model'
    },
    model_name: {
        type: String,
        trim: true
    },
    model_slug: {
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
    variant_slug: {
        type: String,
        trim: true
    },
    ownership: {
        type: String,
        trim: true,
        required: true
    },
    kms: {
        type: String,
        trim: true,
        required: true
    },
    user_name: {
        type: String,
        trim: true,
        // required:true,
    },
    user_email: {
        type: String,
        trim: true,
        // required:true
    },
    user_mobile: {
        type: String,
        trim: true,
        // required:true
    },
    address_type: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    pincode: {
        type: Number,
        trim: true
    },
    full_address: {
        type: String,
        trim: true
    },
    slot_time: {
        type: String,
        trim: true
    },
    slot_date: {
        type: String,
        trim: true
    },
    expected_sell_price: {
        type: String,
        trim: true
    },
    rc_registration_certificate: {
        type: String,
    },
    rc_registration_thumbnail: {
        type: String
    },
    car_insurance: {
        type: String,
    },
    car_insurance_thumbnail: {
        type: String
    },
    cancel_reason: {
        type: String,
        trim: true
    },
    cancel_reason_dscription: {
        type: String,
        trim: true
    },
    step_form: {
        type: Number
    },
    requested_callBack: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        default: 1,    // Request => 1, Completed => 2, Cancel => 3, Pending => 4
    },
    request_id: {
        type: String,
        trim: true
    }

}, { timestamps: true })

const Sell = model<ISell>('sell_data', sellSchema);

export default Sell