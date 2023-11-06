import { Schema, model, Document } from "mongoose";

interface ITokens {
    token: string
}

export interface IAdmin extends Document {
    admin_name: string,
    admin_email: string,
    admin_contact: number,
    admin_address?: string,
    admin_password: string,
    admin_status: number,
    admin_profile?: string,
    tokens: Array<ITokens>,
    createdAt: string,
    updatedAt: string
}

const adminSchema = new Schema({
    admin_name: {
        type: String,
        required: true,
        trim: true
    },
    admin_email: {
        type: String,
        requried: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    admin_contact: {
        type: Number,
        requried: true,
        unique: true
    },
    admin_address: {
        type: String,
        trim: true,
    },
    admin_password: {
        type: String,
        required: true,
        trim: true
    },
    admin_status: {
        type: Number,
        default: 1
    },
    admin_profile: {
        type: String,
        trim: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},
    {
        timestamps: true
    });

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObj = admin.toObject();
    delete adminObj.admin_password;
    delete adminObj.tokens;
    delete adminObj.__v;
    return adminObj;
}

const Admin = model<IAdmin>('admin_data', adminSchema);

export default Admin;