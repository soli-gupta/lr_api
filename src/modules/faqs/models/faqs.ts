import { Document, Schema, model } from "mongoose";


export interface IFaqs extends Document {
    faq_type: string,
    faq_question: string,
    faq_description: string,
    faq_status: number,
    createdAt: string,
    updatedAt: string
}

const faqsSchema = new Schema({
    faq_type: {
        type: String,
        trim: true
    },
    faq_question: {
        type: String,
        trim: true
    },
    faq_description: {
        type: String,
        trim: true
    },
    faq_status: {
        type: Number,
        default: 2
    }
},
    { timestamps: true }
);

const Faq = model<IFaqs>('faqs', faqsSchema);

export default Faq;