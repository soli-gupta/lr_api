import { Schema, model, Document } from "mongoose";

export interface IFuel extends Document {
    fuel_name: string,
    fuel_slug: string,
    fuel_status: number
    fuel_image?: string,
    sorting: number,
    createdAt: string,
    updatedAt: string
}

const fuelSchema = new Schema({
    fuel_name: {
        type: String,
        trim: true,
        required: true,
    },
    fuel_slug: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    fuel_image: {
        type: String,

    },
    sorting: {
        type: Number
    },
    fuel_status: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

const Fuel = model<IFuel>('fuel_type', fuelSchema)

export default Fuel