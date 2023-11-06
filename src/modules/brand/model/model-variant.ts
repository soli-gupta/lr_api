import mongoose, { Schema, model, Document } from "mongoose";

export interface IModelVariant extends Document {
    brand_id: Schema.Types.ObjectId,
    model_id: Schema.Types.ObjectId,
    variant_name: string,
    variant_slug: string,
    variant_image: string,
    variant_status: number,
    createdAt: string,
    updatedAt: string
}

const modelVariantSchema = new Schema({
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    model_id: {
        type: Schema.Types.ObjectId,
        ref: 'brand_model',
        required: true
    },
    variant_name: {
        type: String,
        required: true,
        trim: true
    },
    variant_slug: {
        type: String,
        required: true,
    },
    variant_image: {
        type: String,
    },
    variant_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    }
},
    {
        timestamps: true
    });

modelVariantSchema.methods.toJSON = function () {
    const variant = this;
    const variantObj = variant.toObject();
    delete variantObj.__v;
    return variantObj;
}

const ModelVariant = model<IModelVariant>('model_variants', modelVariantSchema);

export default ModelVariant;