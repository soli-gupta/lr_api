import { Request, Response } from "express";
import BookExtendedWarranty from "../../users/models/extended-warranty";


const fetchAllUserExtendedWarranty = async (req: Request, res: Response) => {
    try {

        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const extendedWarranty = await BookExtendedWarranty.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
        if (!extendedWarranty) {
            return res.status(400).json({ status: 0, message: 'No data found.' });
        }

        res.status(200).json({ status: 1, extended_warranty: extendedWarranty })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const updateUserExtendedWarranty = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const extendedWarranty = await BookExtendedWarranty.findById({ _id });
        if (!extendedWarranty) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        extendedWarranty!.warranty_status = status;
        await extendedWarranty!.save();
        res.status(200).json({ status: 1, message: `${extendedWarranty!.user_first_name} ${extendedWarranty!.user_last_name} lead status updated successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { fetchAllUserExtendedWarranty, updateUserExtendedWarranty };