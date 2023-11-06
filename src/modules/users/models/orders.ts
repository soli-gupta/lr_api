import { Document, Schema, model } from "mongoose";



export interface IOrders extends Document {
    user_first_name: string,
    user_last_name: string,
    user_email_id?: string,
    user_contact: number,
    user_address_type: string,
    user_full_address: string,
    user_booking_amount: string,
    order_brand_name: string,
    order_model_name: string,
    order_variant_name: string,
    order_car_registration_year: string,
    order_car_ownership: string,
    order_car_kms: string,
    order_car_amount: string,
    order_car_fuel_type: string,
    order_car_registration_state: string,
    order_car_name: string,
    order_car_manufacturing_year: string,
    order_car_engine: string,
    order_car_body_type: string,
    order_car_insurance_type: string,
    order_car_insurance_valid: string,
    order_car_location: string,
    order_balance_amount: string,
    order_status: number, // 1=> Success, 2=>Completed, 3=>Cancelled
    order_id: string,
    createdAt: string,
    updatedAt: string,
    payment_type: string,
    order_user_id: Schema.Types.ObjectId,
    order_product_id: Schema.Types.ObjectId,
    order_cancel_reason?: string,
    order_cancel_description?: string,
    order_car_color: string,
    user_optd_insurance: number

    order_type: string,


    service_center_name: string,
    service_center_address: string,
    vehicle_inspaction_date: string,
    vehicle_inspaction_time: string,
    vehicle_rc: string,
    vehicle_insurance: string,

    order_payment_type: string,

    form_step: number,

    salesforce_OpportunityId: string

}

const orderSchema = new Schema({
    user_first_name: {
        type: String,
        // required: true,
        trim: true
    },
    user_last_name: {
        type: String,
        // required: true,
        trim: true
    },
    user_email_id: {
        type: String,
        trim: true
    },
    user_contact: {
        type: Number,
        required: true
    },
    user_address_type: {
        type: String,
        trim: true
    },
    user_full_address: {
        type: String
    },
    user_booking_amount: {
        type: String
    },
    order_brand_name: {
        type: String,
        required: true
    },
    order_model_name: {
        type: String,
        required: true
    },
    order_variant_name: {
        type: String,
        required: true
    },
    order_car_registration_year: {
        type: String
    },
    order_car_year: {
        type: String
    },
    order_car_ownership: {
        type: String
    },
    order_car_kms: {
        type: String
    },
    order_car_amount: {
        type: String
    },
    order_car_fuel_type: {
        type: String
    },
    order_car_registration_state: {
        type: String
    },
    order_car_name: {
        type: String
    },
    order_car_manufacturing_year: {
        type: String
    },
    order_car_engine: {
        type: String
    },
    order_car_body_type: {
        type: String
    },
    order_car_insurance_type: {
        type: String
    },
    order_car_insurance_valid: {
        type: String
    },
    order_car_location: {
        type: String
    },
    order_balance_amount: {
        type: String
    },
    order_status: {
        type: Number,
        default: 1
    },
    order_id: {
        type: String
    },
    payment_type: {
        type: String
    },
    order_user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    order_product_id: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'products'
    },
    order_cancel_reason: {
        type: String
    },
    order_cancel_description: {
        type: String
    },
    order_car_color: {
        type: String
    },
    user_optd_insurance: {
        type: Number,
        default: 2,
    },
    order_type: {
        type: String,
        required: true,
        trim: true
    },
    service_center_name: {
        type: String,
        trim: true
    },
    service_center_address: {
        type: String,
        trim: true
    },
    vehicle_inspaction_date: {
        type: String,
        trim: true
    },
    vehicle_inspaction_time: {
        type: String
    },
    vehicle_rc: {
        type: String
    },
    vehicle_insurance: {
        type: String
    },
    order_payment_type: {
        type: String
    },
    form_step: {
        type: Number
    },
    salesforce_OpportunityId: {
        type: String
    }

},
    { timestamps: true }
);

const Orders = model<IOrders>('orders', orderSchema);


export default Orders;