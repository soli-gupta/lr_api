import { Schema, Document, model } from "mongoose";

export interface ICreateBuyLead extends Document {
    brand_id: Schema.Types.ObjectId,
    model_id: Schema.Types.ObjectId,
    variant_id: Schema.Types.ObjectId,
    year: string,
    kms_driven: string,
    lead_contact: number,
    lead_status: number,
    createdAt: string,
    updatedAt: string,
    lead_type: string,
    first_name: string,
    last_name: string
}


const createBuyLeads = new Schema({
    brand_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'brands'
    },
    model_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'brand_model'
    },
    variant_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'model_variants'
    },
    kms_driven: {
        type: String
    },
    lead_contact: {
        type: Number,
        required: true
    },
    lead_status: {
        type: Number,
        default: 1
    },
    lead_type: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    }

},
    { timestamps: true }
)

const CreateBuyLead = model<ICreateBuyLead>('buy-leads', createBuyLeads)

export default CreateBuyLead;