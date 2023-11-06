import { Request, Response } from "express";
import BookVisit from "../../users/models/book-visit";



const getAllVisitsList = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const allVisits: any = [];

        const getVisitList = await BookVisit.find({}).populate([
            { path: "experience_center", select: ["center_name"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getVisitList) {
            return res.status(400).json({ status: 0, message: "No visits found!" });
        }

        getVisitList.forEach((visit) => {
            allVisits.push({
                _id: visit._id,
                visitor_first_name: visit.visitor_first_name,
                visitor_last_name: visit.visitor_last_name,
                visitor_contact: visit.visitor_contact,
                experience_center: visit.experience_center,
                date: visit.visit_book_date,
                book_time: visit.visit_book_time,
                type: visit.visit_type,
                status: visit.visit_status,
                createdAt: visit.createdAt,
                updatedAt: visit.updatedAt
            })
        })
        res.status(200).json({ status: 1, booked_visits: allVisits });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const updateBookedVisitState = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const bookedVisit = await BookVisit.findById({ _id });
        if (!bookedVisit) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }
        bookedVisit!.visit_status = status;
        await bookedVisit.save();
        res.status(200).json({ status: 1, message: 'Visit status updated!' });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

export { getAllVisitsList, updateBookedVisitState }