import { Schema, Document, model } from "mongoose";

export interface IBookVisit extends Document {
    visitor_first_name: string,
    visitor_last_name: string,
    visitor_contact: string,
    createdAt: string,
    updatedAt: string,
    experience_center: Schema.Types.ObjectId,
    visit_book_date: string,
    visit_book_time: string,
    visit_type: string,
    visit_status: number
}


const bookVisitSchema = new Schema({
    visitor_first_name: {
        type: String,
        trim: true,
        required: true
    },
    visitor_last_name: {
        type: String,
        trim: true,
    },
    visitor_contact: {
        type: String,
        required: true,
        trim: true
    },
    experience_center: {
        type: Schema.Types.ObjectId,
        ref: 'experice_center',
        required: true
    },
    visit_book_date: {
        type: String,
        required: true
    },
    visit_book_time: {
        type: String
    },
    visit_type: {
        type: String,
        trim: true
    },
    visit_status: {
        type: Number,
        default: 1
    }
},
    {
        timestamps: true
    });


const BookVisit = model<IBookVisit>('book_visit', bookVisitSchema);

export default BookVisit;