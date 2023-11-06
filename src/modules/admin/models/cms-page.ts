import { any } from "joi";
import mongoose, { Schema, model, Document } from "mongoose";


export interface ICmsPage extends Document {
    page_name: string,
    page_slug: string,
    sub_text?: string,
    content_one?: string,
    content_two?: string,
    content_three?: string,
    content_four?: string,
    page_banner?: any,
    banner_image_alt?: string,
    page_status: number,
    cms_page_title: string,
    page_meta_keyword?: string,
    page_meta_description?: string,
    page_meta_other?: string,
    createdAt: string,
    updatedAt: string
    why_choose_luxury: any
    selling_your_car: any
    page_logo: any
    page_newly_launched: number,
    our_service_centers: any,
    mobile_banner: any,
    sell_book_car_inspaction: any,
    sell_selling_your_car: any,
    page_short_description: any,
    page_sorting: number,
    benefits_like: string,
    on_the_safe_side: string,
    bb_assurance: string,

    // Mobile
    why_choose_luxury_mobile: string,

    selling_your_car_mobile: string,
    our_service_centers_mobile: string,
}

const cmspageSchema = new Schema({
    page_name: {
        type: String,
        trim: true,
        required: true
    },
    page_slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    sub_text: {
        type: String,
        trim: true
    },
    content_one: {
        type: String,
        trim: true
    },
    content_two: {
        type: String,
        trim: true
    },
    content_three: {
        type: String,
        trim: true
    },
    content_four: {
        type: String,
        trim: true
    },
    page_banner: {
        type: String,
        trim: true
    },
    banner_image_alt: {
        type: String,
    },
    page_status: {
        type: Number,
        default: 1 // 1=>Active, 2=>De-active
    },
    cms_page_title: {
        type: String,
        required: true
    },
    page_meta_keywords: {
        type: String,
    },
    page_meta_description: {
        type: String
    },
    page_meta_other: {
        type: String
    },
    why_choose_luxury: {
        type: String
    },
    selling_your_car: {
        type: String
    },
    page_logo: {
        type: String
    },
    page_newly_launched: {
        type: Number,
        default: 2
    },
    our_service_centers: {
        type: String
    },
    mobile_banner: {
        type: String
    },
    sell_book_car_inspaction: {
        type: String
    },
    sell_selling_your_car: {
        type: String
    },
    page_short_description: {
        type: String
    },
    page_sorting: {
        type: Number
    },
    benefits_like: {
        type: String
    },
    on_the_safe_side: {
        type: String
    },
    bb_assurance: {
        type: String
    },
    why_choose_luxury_mobile: {
        type: String
    },
    selling_your_car_mobile: {
        type: String
    },
    our_service_centers_mobile: {
        type: String
    }

},
    {
        timestamps: true
    });

cmspageSchema.methods.toJSON = function () {
    const cms = this;
    const cmsObj = cms.toObject();
    delete cmsObj.__v;
    return cmsObj;
}

const CmsPage = model<ICmsPage>('cms_page', cmspageSchema);

export default CmsPage;