import { number } from "joi";
import mongoose, { Schema, model, Document } from "mongoose";


export interface IBrandModel extends Document {
    brand_id: Schema.Types.ObjectId,
    model_name: string,
    model_slug: string,
    model_image?: string,
    model_status: number,
    createdAt: string,
    updatedAt: string,
    page_title?: string,
    h1_tag?: string,
    model_meta_description?: string
}

const brandModelSchema = new Schema({
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    model_name: {
        type: String,
        required: true,
        trim: true
    },
    model_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    model_image: {
        type: String,
    },
    model_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    },
    model_meta_description: {
        type: String
    },
    page_title: {
        type: String
    },
    h1_tag: {
        type: String
    },
},
    {
        timestamps: true
    });

brandModelSchema.methods.toJSON = function () {
    const model = this;
    const modelObj = model.toObject();
    delete modelObj.__v;
    return modelObj;
}

const BrandModel = model<IBrandModel>('brand_model', brandModelSchema);

export default BrandModel;
