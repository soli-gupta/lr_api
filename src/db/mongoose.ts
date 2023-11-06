import mongoose, { mongo } from "mongoose";
import { DB } from "../config/index";
import createHttpError from 'http-errors'

mongoose.set("strictQuery", false);
mongoose.connect(DB, { retryWrites: true, w: 'majority' }).then(() => {
    console.log('Database Connected successfully!');
}).catch(() => {
    throw createHttpError(501, 'Unable to connect the database!');
})

