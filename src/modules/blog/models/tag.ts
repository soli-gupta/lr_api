import {Schema, model, Document,  } from "mongoose";

export interface ITag extends Document{
    name : string,
    slug: string,
    status:number,
    createdAt :string,
    updatedAt :string
}

const TagSchema = new Schema({
    name : {
        type:String,
        trim: true,
        require:true
    },
    slug:{
        type: String,
        trim:true,
        require:true,
        unique:true,
    },
    status: {
        type:Number,
        default:1
    }
}, {timestamps:true})

const Tag =  model<ITag>('tags',TagSchema)

export default Tag