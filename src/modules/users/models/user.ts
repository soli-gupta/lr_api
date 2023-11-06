import { model, Schema, Document } from "mongoose";

interface ITokens {
    token: string
}
export interface IUSer extends Document {
    first_name: string,
    last_name: string,
    mobile: string,
    email: string,
    profile?: string,
    tokens: Array<ITokens>,
    status: number,
    createdAt: string,
    updatedAt: string,
    salesforce_account_id: string,
}

const userSchema = new Schema({
    first_name: {
        type: String,
        required: false,
        trim: true
    },
    last_name: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
    },

    status: {
        type: Number,
        default: 1
    },
    profile: {
        type: String,
        // trim: true
    },
    tokens: [
        {
            token: {
                type: String,
            }
        }
    ],
    salesforce_account_id: {
        type: String
    }
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.tokens;
    delete userObj.__v;
    return userObj;
}

const User = model<IUSer>('users', userSchema);

export default User;

