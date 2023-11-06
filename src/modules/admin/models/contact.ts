import { model, Schema, Document } from "mongoose";

export interface IContact extends Document {
    first_name: string,
    last_name: string,
    mobile: string,
    email?: string,
    query_type: string,
    description: string
    status: number,
    createdAt: string,
    updatedAt: string
}

const contactSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    mobile: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        // required:true
    },
    query_type: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    description: {
        type: String,
        trim: true,
        // required: true
    }
}, { timestamps: true })

const Contact = model<IContact>('contact', contactSchema)

export default Contact