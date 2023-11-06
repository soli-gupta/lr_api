import { Schema, model, Document } from "mongoose";

export interface ISpecificationCategory extends Document {
    name: string,
    slug: string,
    status: number,
    createdAt: string
    updatedAt: string
}

const specificationCategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

specificationCategorySchema.methods.toJSON = function () {
    const model = this;
    const modelObj = model.toObject();
    delete modelObj.__v;
    return modelObj;
}

const SpecificationCategory = model<ISpecificationCategory>('specification-category', specificationCategorySchema)

export default SpecificationCategory