import { Schema, model, Document } from "mongoose";

export interface ICity extends Document {
    state_id : string,
    name : string,
    city_slug : string,
    status : number
    createdAt : string,
    updatedAt : string
}

const citySchema = new Schema({
    state_id : {
        type : String,  
    },
    name : {
        type:String,
        trim : true
    },
    slug: {
        type: String,
        trim: true
    },
    status : {
        type : Number,
        default:1
    }
}, {timestamps:true})

const City = model<ICity>('cities',citySchema)

export default City