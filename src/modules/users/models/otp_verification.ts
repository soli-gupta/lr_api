import { Schema, model, Document } from "mongoose";

export interface IOtpVerification extends Document{
    mobile : string,
    otp: number,
    verify_status: number,
    otp_expiry : string,
    createdAt : string,
    updatedAt : string
}

const OtpVerifySchema = new Schema({
    mobile : {
        type : String,
        trim : true,
        required: true,
    },
    otp : {
        type : Number,
        trim : true,
        required : true
    },
    verify_status : {
        type : Number,
        default : 2,  //  1 => active , 2 => deactive

    },
    otp_expiry:{
        type:String,
        required:true
    }
}, {timestamps : true})

const OtpVerification = model<IOtpVerification>('otp_verify', OtpVerifySchema)

export default OtpVerification