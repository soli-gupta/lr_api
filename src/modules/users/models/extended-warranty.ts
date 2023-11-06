import { Document, Schema, model } from "mongoose";


export interface IExtendedWarranty extends Document {
    user_first_name: string,
    user_last_name: string,
    user_contact: string,
    warranty_year: string,
    warranty_brand_name: string,
    warranty_model_name: string,
    warranty_variant_name: string,
    warranty_fuel_type: string,
    warranty_status: number,
    warranty_kms: string,
    createdAt: string,
    updatedAt: string
}


const bookExtendedWarranty = new Schema({
    user_first_name: {
        type: String
    },
    user_last_name: {
        type: String
    },
    user_contact: {
        type: String
    },
    warranty_year: {
        type: String
    },
    warranty_brand_name: {
        type: String
    },
    warranty_model_name: {
        type: String
    },
    warranty_variant_name: {
        type: String
    },
    warranty_fuel_type: {
        type: String
    },
    warranty_kms: {
        type: String
    },
    warranty_status: {
        type: Number,
        default: 2
    },
},
    { timestamps: true }
);


const BookExtendedWarranty = model<IExtendedWarranty>('user-extended-warranty', bookExtendedWarranty);

export default BookExtendedWarranty;