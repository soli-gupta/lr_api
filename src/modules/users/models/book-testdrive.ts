import { Schema, model, Document } from "mongoose";

export interface IBookTestDrive extends Document {
    user_first_name: string,
    user_last_name: string,
    user_contact: string,
    user_address?: string,
    user_landmark?: string,
    user_state?: string,
    user_city?: string,
    test_drive_date: string,
    test_drive_time: string,
    createdAt: string,
    updatedAt: string,
    test_status: number,
    experience_center: Schema.Types.ObjectId,
    user_lat?: string,
    user_long?: string,
    product_id: string,
    pin_code?: string,
    user_id: Schema.Types.ObjectId;

    car_name: string,
    car_brand_name: string,
    car_model_name: string,
    car_variant_name: string,
    car_registration_year: string,
    car_resgistration_state: string,
    car_kms: number,
    car_ownership: string,
    car_fuel_type: string,
    car_manufacturing_year: string,
    car_engine_cc: string,
    car_body_type: string,
    car_insurance_type: string,
    car_insurance_valid: string,
    car_location: string,
    car_cancel_reason?: string,
    car_cancel_description?: string,
    car_color: string,
    test_drive_order_id: string,

    test_drive_OpportunityId: string,
}

const bookTestDriveSchema = new Schema({
    user_first_name: {
        type: String,
        // required: true
    },
    user_last_name: {
        type: String,
        // required: true,
    },
    user_contact: {
        type: String,
        required: true
    },
    user_address: {
        type: String,
    },
    user_landmark: {
        type: String
    },
    user_state: {
        type: String
    },
    user_city: {
        type: String
    },
    test_drive_date: {
        type: String,
        required: true
    },
    test_drive_time: {
        type: String,
        required: true
    },
    test_status: {
        type: Number,
        default: 1
    },
    experience_center: {
        type: Schema.Types.ObjectId,
        ref: 'experice_center'
    },
    user_lat: {
        type: String
    },
    user_long: {
        type: String
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    pin_code: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    car_name: {
        type: String
    },
    car_brand_name: {
        type: String
    },
    car_model_name: {
        type: String
    },
    car_variant_name: {
        type: String
    },
    car_registration_year: {
        type: String
    },
    car_registration_state: {
        type: String
    },
    car_kms: {
        type: Number
    },
    car_ownership: {
        type: String
    },
    car_fuel_type: {
        type: String
    },
    car_manufacturing_year: {
        type: String
    },
    car_engine_cc: {
        type: String
    },
    car_body_type: {
        type: String
    },
    car_insurance_type: {
        type: String
    },
    car_insurance_valid: {
        type: String
    },
    car_location: {
        type: String
    },
    car_cancel_reason: {
        type: String
    },
    car_cancel_description: {
        type: String
    },
    car_color: {
        type: String
    },
    test_drive_order_id: {
        type: String
    },
    car_resgistration_state: {
        type: String
    }
    ,
    test_drive_OpportunityId: {
        type: String
    }
},
    {
        timestamps: true
    });

bookTestDriveSchema.methods.toJSON = function () {
    const book = this;
    const bookObj = book.toObject();
    delete bookObj.__v;
    return bookObj;
}


const BookTestDrive = model<IBookTestDrive>('book_user_test_drive', bookTestDriveSchema);


export default BookTestDrive;