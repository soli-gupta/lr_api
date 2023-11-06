import { Document, Schema, model } from "mongoose";


export interface IServicePackage extends Document {
    user_first_name: string,
    user_last_name: string,
    user_contact: number,
    service_year: string,
    service_brand_name: string,
    service_model_name: string,
    service_variant_name: string,
    service_fuel_type: string,
    service_kms: string
    service_status: number,
    createdAt: string,
    updatedAt: string
}


const servicePackageSchema = new Schema({
    user_first_name: {
        type: String
    },
    user_last_name: {
        type: String
    },
    user_contact: {
        type: Number
    },
    service_year: {
        type: String
    },
    service_brand_name: {
        type: String
    },
    service_model_name: {
        type: String
    },
    service_variant_name: {
        type: String
    },
    service_fuel_type: {
        type: String
    },
    service_kms: {
        type: String
    },
    service_status: {
        type: Number,
        default: 2
    }
},
    { timestamps: true }
);

const BookServicePackage = model<IServicePackage>('user-service-package', servicePackageSchema);

export default BookServicePackage;