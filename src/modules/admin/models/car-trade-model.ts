import { Document, Schema, model } from "mongoose";


export interface ICarTradeLeads extends Document {
    product_id: string,
    lead_id: string,
    lead_date: string,
    car_trade_brand: string,
    car_trade_model: string,
    car_trade_variant: string,
    car_trade_color: string,
    car_trade_price: string,
    car_trade_kms_driven: number,
    car_trade_car_color: string,
    car_trade_transmission: string,
    car_trade_fuel_type: string,
    car_trade_user_first_name: string,
    car_trade_user_last_name: string,
    car_trade_user_contact: string,
    car_trade_user_city: string,
    car_trade_user_email: string,
    car_trade_lead_type: string,


    car_trade_registration_year: string,
    car_trade_car_ownership: string,
    car_trade_car_amount: string,
    car_trade_registration_state: string,
    car_trade_car_name: string,
    car_trade_car_engine: string,
    car_trade_body_type: string,
    car_trade_insurance_type: string,
    car_trade_insurance_valid: string,
    car_trade_car_location: string,
    car_trade_status: number
}

const carTradeSchema = new Schema({
    product_id: {
        type: String
    },
    lead_id: {
        type: String
    },
    lead_date: {
        type: String
    },
    car_trade_brand: {
        type: String
    },
    car_trade_model: {
        type: String
    },
    car_trade_variant: {
        type: String
    },
    car_trade_color: {
        type: String
    },
    car_trade_price: {
        type: String
    },
    car_trade_kms_driven: {
        type: Number
    },
    car_trade_car_color: {
        type: String
    },
    car_trade_transmission: {
        type: String
    },
    car_trade_fuel_type: {
        type: String
    },
    car_trade_user_first_name: {
        type: String
    },
    car_trade_user_last_name: {
        type: String
    },
    car_trade_user_contact: {
        type: String
    },
    car_trade_user_city: {
        type: String
    },
    car_trade_user_email: {
        type: String
    },
    car_trade_lead_type: {
        type: String
    },
    car_trade_registration_year: {
        type: String
    },
    car_trade_car_ownership: {
        type: String
    },
    car_trade_car_amount: {
        type: String
    },
    car_trade_registration_state: {
        type: String
    },
    car_trade_car_name: {
        type: String
    },
    car_trade_car_engine: {
        type: String
    },
    car_trade_body_type: {
        type: String
    },
    car_trade_insurance_type: {
        type: String
    },
    car_trade_insurance_valid: {
        type: String
    },
    car_trade_car_location: {
        type: String
    },
    car_listing_city: {
        type: String
    },
    car_trade_status: {
        type: Number,
        default: 1
    }
},
    { timestamps: true }
);


const CarTradeLeads = model<ICarTradeLeads>("car-trade-leads", carTradeSchema);


export default CarTradeLeads;