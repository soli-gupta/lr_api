import { Request, Response } from "express";


const fetchLoggedUserDetail = async (req: Request, res: Response) => {
    try {
        const userData = {
            _id: req.user?._id,
            mobile: req.user?.mobile,
            status: req.user?.status,
            createdAt: req.user?.createdAt,
            updatedAt: req.user?.updatedAt,
            email: req.user?.email ? req.user?.email : '',
            first_name: req.user?.first_name ? req.user?.first_name : '',
            last_name: req.user?.last_name ? req.user?.last_name : ''
        }
        // console.log(userData);
        res.status(200).json({ status: 1, user: userData });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}




export { fetchLoggedUserDetail };