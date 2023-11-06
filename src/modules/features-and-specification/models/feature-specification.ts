import { Schema, model, Document } from "mongoose";


export interface IFeatureSpecification extends Document {
    feature_id: string,
    feature_name: string,
    feature_status: number,
    feature_icon?: string,
    createdAt: string,
    updatedAt: string
}


const featureSpecificationSchema = new Schema({
    feature_id: {
        type: Schema.Types.ObjectId,
        ref: 'specification-category',
        required: true
    },
    feature_name: {
        type: String,
        required: true,
        trim: true
    },
    feature_icon: {
        type: String,
        trim: true
    },
    feature_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    }
},
    {
        timestamps: true
    });

featureSpecificationSchema.methods.toJSON = function () {
    const feature = this;
    // console.log(feature);
    const featureObj = feature.toObject();

    delete featureObj.__v;
    return featureObj;
}

const FeatureSpecification = model<IFeatureSpecification>('feature-specification', featureSpecificationSchema);

export default FeatureSpecification;