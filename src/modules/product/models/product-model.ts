import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
    brand_id: Types.ObjectId,
    model_id: Types.ObjectId,
    variant_id: Types.ObjectId,
    registration_year: string,
    registration_state: string,
    kms_driven: number,
    product_ownership: string,
    fuel_type: Types.ObjectId,
    price: Number,
    product_name: string,
    product_slug: string,
    short_description?: string,
    product_image?: string,
    product_status: string,
    manufacturing_year?: string,
    engine_cc?: string,
    body_type?: Types.ObjectId,
    insurance_type?: number,
    insurance_valid?: string,
    product_location: Types.ObjectId,
    page_title?: string,
    meta_keywords?: string,
    meta_description?: string,
    meta_other?: string,
    createdAt: string,
    updatedAt: string,
    product_type_status: number,
    product_color: string,
    product_banner: number,
    product_linked_from: Array<Schema.Types.ObjectId>,
    product_monthely_emi: string,
    product_booking_amount: string,
    sku_code: number,
    image_carousel: Array<String>
    sales_force_id: string,
    registration_number: string,
    image_360: string
}

const productSchema = new Schema({
    brand_id: {
        type: Types.ObjectId,
        ref: 'brands',
        required: true
    },
    model_id: {
        type: Types.ObjectId,
        ref: 'brand_model',
        required: true,
    },
    variant_id: {
        type: Types.ObjectId,
        ref: 'model_variants',
        required: true
    },
    registration_year: {
        type: String,
        required: true
    },
    registration_state: {
        type: String,
        trim: true,
        required: true
    },
    kms_driven: {
        type: Number,
        required: true
    },
    product_ownership: {
        type: String,
        required: true
    },
    fuel_type: {
        type: Types.ObjectId,
        required: true,
        ref: 'fuel_type'
    },
    price: {
        type: Number,
        required: true
    },
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    product_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    short_description: {
        type: String,
        trim: true
    },
    product_image: {
        type: String,
        trim: true
    },
    product_status: {
        type: String,
        default: 'live', // live, booked, sold
    },
    product_type_status: {
        type: Number,
        default: 2
    },
    manufacturing_year: {
        type: String,
        trim: true
    },
    engine_cc: {
        type: String
    },
    body_type: {
        type: Types.ObjectId,
        ref: 'body_type'
    },
    insurance_type: {
        type: String,
        trim: true
    },
    insurance_valid: {
        type: String,
        trim: true
    },
    product_location: {
        type: Types.ObjectId,
        ref: 'experice_center'
    },
    page_title: {
        type: String
    },
    meta_keywords: {
        type: String
    },
    meta_description: {
        type: String
    },
    meta_other: {
        type: String
    },
    // product_link: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'products'
    // },
    product_color: {
        type: String
    },
    product_banner: {
        type: Number,
        default: 2
    },
    product_linked_from: {
        type: [Schema.Types.ObjectId],
        ref: 'products'
    },
    product_monthely_emi: {
        type: String
    },
    product_booking_amount: {
        type: String
    },
    sku_code: {
        type: Number,
    },
    image_carousel: [
        {
            type: String
        }
    ],
    sales_force_id: {
        type: String
    },
    registration_number: {
        type: String
    },
    image_360: {
        type: String
    }
},
    {
        timestamps: true
    });


productSchema.methods.toJSON = function () {
    const prd = this;
    const prdObj = prd.toObject();
    delete prdObj.__v;
    return prdObj;
}

const Products = model<IProduct>('products', productSchema);

export default Products;

//bb_assurance-1688638984100-368684435-assurance-banner.png