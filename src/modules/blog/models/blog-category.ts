import { Schema, model, Document } from "mongoose";

export interface IBlogCategory extends Document {
     blog_category_name: string,
     blog_category_slug:string,
     blog_category_page_title?:string,
     blog_category_meta_keywords?:string,
     blog_category_meta_description?:string,
     blog_category_status:number,
     createdAt :string,
     updatedAt :string
}

const blogCategorySchema = new Schema({
    blog_category_name : {
        type: String,
        required:true,
        trim: true 
    },
    blog_category_slug:{
        type:String,
        required:true,
        unique:true ,
        trim: true
    },
    blog_category_page_title:{
        type:String, 
        trim: true
    },
    blog_category_meta_keywords : {
        type:String, 
        trim:true
    },
    blog_category_meta_description:{
        type:String,  
        trim:true
    },
    blog_category_status:{
        type:Number,
        default:1,
        trim:true
    }
},{timestamps:true});

const blogCategory = model<IBlogCategory>('blog_category', blogCategorySchema);

export default blogCategory;