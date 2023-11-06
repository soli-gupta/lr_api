import { Request, Response } from "express";
import BookServicePackage from "../../users/models/service-package";


const fetchAllUserServicePackage = async (req: Request, res: Response) => {
    try {

        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const servicePackage = await BookServicePackage.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!servicePackage) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.' })
        }
        res.status(200).json({ status: 1, service_package: servicePackage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateBookedServicePackageStatus = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const servicePackage = await BookServicePackage.findById({ _id });
        if (!servicePackage) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        servicePackage!.service_status = status;
        await servicePackage!.save();
        res.status(200).json({ status: 1, message: `${servicePackage!.user_first_name} ${servicePackage!.user_last_name} lead status updated successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { fetchAllUserServicePackage, updateBookedServicePackageStatus }