import mongoose, { Schema, model, Document } from "mongoose";

export interface IBrand extends Document {
    brand_name: string,
    brand_slug: string,
    brand_status: number,
    brand_logo?: string,
    createdAt: string,
    updatedAt: string,
    brand_meta_keywords?: string,
    brand_meta_description?: string,
    logo_sorting: string
    page_title: string
    h1_tag: string
    meta_description: string
}

const brandSchema = new Schema({
    brand_name: {
        type: String,
        requried: true,
        trim: true
    },
    brand_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    brand_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    },
    brand_logo: {
        type: String,
        trim: true
    },
    brand_meta_keywords: {
        type: String,
        trim: true
    },
    brand_meta_description: {
        type: String,
        trim: true
    },
    logo_sorting: {
        type: String
    },
    page_title: {
        type: String
    },
    h1_tag: {
        type: String
    },
    meta_description: {
        type: String
    },
},
    {
        timestamps: true
    });

brandSchema.methods.toJSON = function () {
    const brand = this;
    const brandObj = brand.toObject();
    delete brandObj.__v;
    return brandObj;
}

const Brands = model<IBrand>('brands', brandSchema);

export default Brands;