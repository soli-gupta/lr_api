import { Schema, model, Document } from "mongoose";
import * as mongoose from 'mongoose'

export interface IBlogPost extends Document {
    blog_category_id :string,
    blog_name: string,
    blog_slug:string,
    blog_posted_by :string,
    blog_posted_date : Date,
    blog_image:string,
    blog_short_description? :string,
    blog_description?:string,
    blog_tag: Array<Schema.Types.ObjectId>
    blog_view_count? :number,
    blog_page_title?: string,
    blog_meta_keywords? :string,
    blog_meta_description? :string,
    blog_status:number,
    createdAt :string,
    updatedAt :string
}

const blogPostSchema = new Schema({
    blog_category_id : {
        type: Schema.Types.ObjectId,
        ref: 'blog_category'
    },
    blog_name: {
        type:String,
        require:true,
        trim:true
    },
    blog_slug:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    blog_posted_by:{
      type: Schema.Types.ObjectId,
        ref: 'admin_data'
    },
    blog_posted_date:{
        type:Date,
        default: Date.now
    },
    blog_image :{
        type:String
    },
    blog_short_description:{
        type:String,
        trim:true
    },
    blog_description: {
        type:String,
        trim:true,
    },
     blog_tag: {
        type: [Schema.Types.ObjectId],
        ref: 'tags'
    },
    blog_view_count:{
        type:Number,
        default:0
    },
    blog_page_title:{
        type:String,
        trim:true, 
    },
    blog_meta_keywords:{
        type:String,
        trim:true, 
    },
    blog_meta_description:{
        type:String,
        trim:true
    },
    blog_status:{
        type:Number,
        default:1
    }  
},{timestamps:true})

const blogPost = model<IBlogPost>('blog_post', blogPostSchema);

export default blogPost;