import { Schema, model, Document } from "mongoose";

export interface IState extends Document {
    province_id : number,
    province_title : string,
    slug : string,
    status : number
    createdAt : string,
    updatedAt : string
}

const stateSchema = new Schema({
    province_id : {
        type : Number,  
    },
    province_title : {
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

const State = model<IState>('states',stateSchema)

export default State