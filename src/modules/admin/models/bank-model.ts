import { Document, Schema, model } from "mongoose";


export interface IBank extends Document {
    bank_name: string,
    bank_status: number,
    bank_image: string,
    createdAt: string,
    updatedAt: string,
    logo_sorting: string
}


const bankSchema = new Schema({
    bank_name: {
        type: String,
    },
    bank_status: {
        type: Number,
        default: 1,
    },
    bank_image: {
        type: String
    },
    logo_sorting: {
        type: String
    }
},
    { timestamps: true }
);

const BankSchema = model<IBank>("banks", bankSchema);


export default BankSchema