import { Document, Schema, model } from "mongoose";


export interface ICarTradeImg extends Document {
    product_id: Schema.Types.ObjectId,
    ext_img_1: string,
    ext_img_2: string,
    ext_img_3: string,
    ext_img_4: string,
    ext_img_5: string,
    ext_img_6: string,
    ext_img_7: string,
    ext_img_8: string,

    int_img_1: string,
    int_img_2: string,
    int_img_3: string,
    int_img_4: string,
    int_img_5: string,
    int_img_6: string,
    int_img_7: string,
}


const carTradeImageSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    ext_img_1: {
        type: String
    },
    ext_img_2: {
        type: String
    },
    ext_img_3: {
        type: String
    },
    ext_img_4: {
        type: String
    },
    ext_img_5: {
        type: String
    },
    ext_img_6: {
        type: String
    },
    ext_img_7: {
        type: String
    },
    int_img_1: {
        type: String
    },
    int_img_2: {
        type: String
    },
    int_img_3: {
        type: String
    },
    int_img_4: {
        type: String
    },
    int_img_5: {
        type: String
    },
    int_img_6: {
        type: String
    },
    int_img_7: {
        type: String
    },
},
    { timestamps: true }
);

carTradeImageSchema.methods.toJSON = function () {
    const img = this;
    const imgObj = img.toObject();
    delete imgObj.__v;
    return imgObj;
}

const CarTradeImage = model<ICarTradeImg>('car-trade-images', carTradeImageSchema);

export default CarTradeImage;