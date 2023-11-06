import { Schema, model, Document } from "mongoose";

export interface IBodyType extends Document {
    body_name: string,
    body_slug: string,
    body_image?: string,
    sorting: number,
    body_status: number,
    createdAt: string,
    updatedAt: string
}

const bodyTypeSchema = new Schema({
    body_name: {
        type: String,
        trim: true,
        required: true
    },
    body_slug: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    body_image: {
        type: String,

    },
    sorting: {
        type: Number
    },
    body_status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

const BodyType = model<IBodyType>('body_type', bodyTypeSchema)

export default BodyType