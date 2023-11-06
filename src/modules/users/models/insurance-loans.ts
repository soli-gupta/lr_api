import { Document, Schema, model } from "mongoose";


export interface ILoanInsurance extends Document {
    user_first_name: string,
    user_last_name: string,
    user_mobile_number: string,
    user_email: string,
    car_number: string,
    form_type: string,
    status: number,
    createdAt: string,
    updatedAt: string
}

const insuranceLoadSchema = new Schema({
    user_first_name: {
        type: String,
        trim: true
    },
    user_last_name: {
        type: String,
        trim: true
    },
    user_mobile_number: {
        type: String,
        trim: true,
        required: true
    },
    user_email: {
        type: String,
        trim: true
    },
    car_number: {
        type: String,
        trim: true,
        required: true
    },
    form_type: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        default: 2
    }
},
    { timestamps: true }
);

const InsuranceLoans = model<ILoanInsurance>("loan_insurance", insuranceLoadSchema);

export default InsuranceLoans;