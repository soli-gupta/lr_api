import mongoose, { Schema, model, Document } from "mongoose";

export interface IExperienceCenter extends Document {
    center_title?: string,
    center_name: string,
    center_slug: string,
    center_state: string,
    center_city: string,
    center_full_address: string,
    short_description: string
    center_area?: string,
    center_car_bay?: string,
    center_daily_service?: string,
    center_sorting?: number,
    center_google_address_url?: string,
    center_types: Array<string>,
    center_day_and_time?: string,
    center_manager_name?: string,
    center_manager_mobile?: string,
    center_manager_email?: string,
    center_banner: string,
    service_center_banner: string,
    car_care_banner: string,
    center_status: number,
    createdAt: string,
    updatedAt: string
}

const experienceCenterSchema = new Schema({
    center_title: {
        type: String,
        trim: true
    },
    center_name: {
        type: String,
        required: true,
        trim: true
    },
    center_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    center_state: {
        type: String,
        // required: true,
        trim: true
    },
    center_city: {
        type: String,
        // required: true,
        trim: true
    },
    center_full_address: {
        type: String,
        trim: true
    },
    short_description: {
        type: String,
        trim: true,
        // required: false
    },
    center_area: {
        type: String,
        trim: true,
        // required:false
    },
    center_car_bay: {
        type: String,
        trim: true,
        // required:false
    },
    center_daily_service: {
        type: String,
        trim: true,
        // required:false
    },
    center_sorting: {
        type: Number,
        trim: true,
        // required:false
    },
    center_google_address_url: {
        type: String,
        trim: true,
        // required: false
    },
    center_types: [
        {
            type: String,
        }
    ],
    center_day_and_time: {
        type: String,
        // required: false
    },
    center_manager_name: {
        type: String,
        trim: true,
        // required: false
    },
    center_manager_mobile: {
        type: String,
        trim: true,
        // required: false
    },
    center_manager_email: {
        type: String,
        trim: true,
        // required: false
    },
    center_banner: {
        type: String
    },
    service_center_banner: {
        type: String
    },
    car_care_banner: {
        type: String,
    },
    center_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    }
}, {
    timestamps: true
}
);

experienceCenterSchema.methods.toJSON = function () {
    const center = this;
    const centerObj = center.toObject();
    delete centerObj.__v;
    return centerObj;
}


const ExperienceCenter = model<IExperienceCenter>("experice_center", experienceCenterSchema);

export default ExperienceCenter;