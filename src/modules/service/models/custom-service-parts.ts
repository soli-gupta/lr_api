import { model, Schema, Document } from "mongoose";

export interface ICustomServicePart extends Document {
    custom_service_part_name: string,
    custom_service_part_slug: string,
    custom_service_part_image: string,
    custom_service_part_status: number,
    createdAt: string,
    updatedAt: string
}

const customServiceSchema = new Schema({
    custom_service_part_name: {
        type: String,
        required: true,
        trim: true
    },
    custom_service_part_slug: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    custom_service_part_image: {
        type: String,
        required: true
    },
    custom_service_part_status: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

customServiceSchema.methods.toJSON = function () {
    const custom_service = this
    const customServiceObj = custom_service.toObject()
    delete customServiceObj.__v;
    return customServiceObj;
}

const CustomServicePart = model<ICustomServicePart>('custom_service_parts', customServiceSchema)

export default CustomServicePart