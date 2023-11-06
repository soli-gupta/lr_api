import { model, Schema, Document } from "mongoose";

export interface INewsMedia extends Document {
    title: string,
    slug: string,
    short_description: string,
    description: string,
    image: string,
    news_url: string,
    posted_date: string,
    status: number,
    page_title: string,
    meta_keywords: string,
    meta_description: string,
    meta_other: string,
    createdAt: string,
    updatedAt: string

}

const NewMediaSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    short_description: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
    },
    news_url: {
        type: String
    },
    posted_date: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    },
    page_title: {
        type: String,
        trim: true,
    },
    meta_keywords: {
        type: String,
        trim: true
    },
    meta_description: {
        type: String,
        trim: true
    },
    meta_other: {
        type: String,
        trim: true
    }

}, { timestamps: true })

const NewsMedia = model<INewsMedia>('news-and-media', NewMediaSchema)

export default NewsMedia