import { Request, Response } from "express";
import BookTestDrive from "../../users/models/book-testdrive";


const fetchAllTestDrives = async (req: Request, res: Response) => {
    try {
        const testDrive: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const fetchTestDrives = await BookTestDrive.find().populate([
            { path: "product_id", select: ["product_name", "product_slug"] },
            { path: "experience_center", select: ["center_name", "center_full_address"] }
        ]).sort({ createdAt: -1 }).skip(skip).limit(limit);

        if (!fetchTestDrives) {
            return res.status(400).json({ status: 2, message: 'No data found' });
        }

        fetchTestDrives.forEach((drive) => {
            testDrive.push({
                _id: drive._id,
                first_name: drive.user_first_name,
                last_name: drive.user_last_name,
                contact: drive.user_contact,
                full_address: drive.user_address,
                landmark: drive.user_landmark,
                state: drive.user_state,
                city: drive.user_city,
                pincode: drive.pin_code,
                booking_date: drive.test_drive_date,
                booking_time: drive.test_drive_time,
                createdAt: drive.createdAt,
                updatedAt: drive.updatedAt,
                product_id: drive.product_id,
                experience_center: drive.experience_center,
                status: drive.test_status,
                order_id: drive.test_drive_order_id
            })
        })


        res.status(200).json({ status: 1, drives: testDrive });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateTestDriveStatus = async (req: Request, res: Response) => {
    try {
        const _id: any = req.body.order_id;
        const status: any = req.body.order_status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const drive = await BookTestDrive.findById({ _id });
        if (!drive) {
            return res.status(404).json({ status: 0, message: 'Brand not found!' });
        }
        drive.test_status = status;
        drive.car_cancel_description = req.body.order_description ? req.body.order_description : '';

        await drive.save();

        // const testDrive = {
        //     _id: drive._id,
        //     first_name: drive.user_first_name,
        //     last_name: drive.user_last_name,
        //     contact: drive.user_contact,
        //     full_address: drive.user_address,
        //     landmark: drive.user_landmark,
        //     state: drive.user_state,
        //     city: drive.user_city,
        //     pincode: drive.pin_code,
        //     booking_date: drive.test_drive_date,
        //     booking_time: drive.test_drive_time,
        //     createdAt: drive.createdAt,
        //     updatedAt: drive.updatedAt,
        //     product_id: drive.product_id,
        //     experience_center: drive.experience_center,
        //     status: drive.test_status
        // }
        res.status(200).json({ status: 1, message: `Test Drive status updated for ${drive.user_first_name} ${drive.user_last_name}`, drives: drive })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const getTestDriveDetail = async (req: Request, res: Response) => {
    try {
        const drive_id: any = req.params.driveId;
        if (!drive_id) {
            return res.status(400).json({ status: 1, message: `This action is not allowed at this time. Please refresh the page and click again.` });
        }

        const fetchTestDrives = await BookTestDrive.findOne({ _id: drive_id }).populate([
            { path: "product_id", select: ["product_name", "product_slug"] },
            { path: "experience_center", select: ["center_name", "center_full_address"] }
        ]).sort({ createdAt: -1 });

        if (!fetchTestDrives) {
            return res.status(400).json({ status: 1, message: `This action is not allowed at this time. Please refresh the page and click again.` });
        }

        res.status(200).json({ status: 1, test_drive: fetchTestDrives });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong. Please referesh the page.' });
    }
}

export { fetchAllTestDrives, updateTestDriveStatus, getTestDriveDetail };