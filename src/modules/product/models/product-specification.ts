import { Schema, model, Document } from "mongoose";

export interface IProductSpecification extends Document {
    fs_product_id: string,
    fs_category_id: string,
    fs_id: string,
    fs_value: string,
    fs_status: number,
    createdAt: string,
    updatedAt: string
}


const productFSSchema = new Schema({
    fs_product_id: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    fs_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'specification-category',
    },
    fs_id: {
        type: Schema.Types.ObjectId,
        ref: 'feature-specification',
    },
    fs_value: {
        type: String,
        trim: true
    },
    fs_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    }
},
    { timestamps: true });

productFSSchema.methods.toJSON = function () {
    const feature = this;
    const fsObject = feature.toObject();
    delete fsObject.__v;
    return fsObject;
}

const ProductFeatures = model<IProductSpecification>('product-specifications', productFSSchema);

export default ProductFeatures;