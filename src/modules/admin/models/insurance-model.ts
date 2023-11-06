import { Document, Schema, model } from "mongoose";


export interface IInsurance extends Document {
    insurance_name: string,
    insurance_status: number,
    insurance_image: string,
    createdAt: string,
    updatedAt: string,
    logo_sorting: string
}


const insuranceSchema = new Schema({
    insurance_name: {
        type: String,
    },
    insurance_status: {
        type: Number,
        default: 1,
    },
    insurance_image: {
        type: String
    },
    logo_sorting: {
        type: String
    }
},
    { timestamps: true }
);

const InsuranceSchema = model<IInsurance>("insurance", insuranceSchema);


export default InsuranceSchema