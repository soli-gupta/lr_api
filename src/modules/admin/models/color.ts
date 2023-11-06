import { model, Document, Schema } from "mongoose";

export interface IColor extends Document {
    color_name: string,
    color_slug: string,
    color_code: string,
    color_sorting: number,
    status: number,
    createdAt: string,
    updatedAt: string

}

const colorSchema = new Schema({
    color_name: {
        type: String,
        required: true,
        trim: true
    },
    color_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    color_code: {
        type: String,
        trim: true,
        required: true
    },
    color_sorting: {
        type: Number,
        require: true,
        trim: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

const Color = model<IColor>('colors', colorSchema)

export default Color