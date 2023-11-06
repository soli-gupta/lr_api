import { Schema, model, Document } from "mongoose";

export interface IUSerAddress extends Document {
    user_id: Schema.Types.ObjectId,
    user_address_type: string,
    user_full_address: string,
    user_pincode: string,
    user_state: string,
    user_city: string
    createdAt: string,
    updatedAt: string
    address_status: number
}


const userAddressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    user_address_type: {
        type: String,
        required: true,
    },
    user_full_address: {
        type: String,
        required: true
    },
    user_pincode: {
        type: String,
    },
    user_state: {
        type: String,
        required: true,
    },
    user_city: {
        type: String,
        required: true
    },
    address_status: {
        type: Number,
        default: 1
    }
},
    { timestamps: true }
);


const UserAddresses = model<IUSerAddress>('user_address', userAddressSchema);


export default UserAddresses;