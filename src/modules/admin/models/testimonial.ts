import { model, Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
    first_name: string,
    last_name: string,
    product_name: string,
    testimonial_type: string,
    service_name: string,
    video_url: string,
    select_home: string,
    user_image: string,
    description: string,
    rating: string,
    status: number,
    createdAt: string,
    updatedAt: string
}

const testimonialSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    product_name: {
        type: String,
        required: true,
        trim: true,
    },
    testimonial_type: {
        type: String,

    },
    service_name: {
        type: String,
        trim: true
    },
    rating: {
        type: String,
        required: true,
        trim: true,
    },
    video_url: {
        type: String
    },
    user_image: {
        type: String
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    select_home: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }

}, { timestamps: true })

const Testimonial = model<ITestimonial>('testimonial', testimonialSchema)

export default Testimonial