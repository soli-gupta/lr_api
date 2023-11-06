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
    logo_sorting: string,
    brand_year: number
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
    brand_year: {
        type: Number,
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
    }
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

const XLBrands = model<IBrand>('xl_brands', brandSchema);

export default XLBrands;