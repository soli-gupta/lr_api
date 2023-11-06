import { Request, Response } from "express";
import InsuranceLoans from '../../users/models/insurance-loans';

const fetchAllInsuranceAndLoansData = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 200;
        const skip = (page - 1) * limit;
        const insLoan: any = [];

        const insLoanData = await InsuranceLoans.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

        if (!insLoanData) {
            return res.status(400).json({ status: 2, message: 'No data found.' });
        }

        insLoanData.forEach((insL) => {
            insLoan.push({
                _id: insL._id,
                first_name: insL.user_first_name ? insL.user_first_name : '',
                last_name: insL.user_last_name ? insL.user_last_name : '',
                mobile: insL.user_mobile_number,
                email: insL.user_email ? insL.user_email : '',
                query_type: insL.form_type,
                car_number: insL.car_number,
                createdAt: insL.createdAt,
                updatedAt: insL.updatedAt,
                status: insL.status
            })
        })

        res.status(200).json({ status: 1, insLoan });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnBlockInsuranceAndLoans = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const insLoan = await InsuranceLoans.findById({ _id });

        if (!insLoan) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        insLoan!.status = status;
        await insLoan.save();

        res.status(200).json({ status: 1, message: `${insLoan!.user_first_name} ${insLoan!.user_last_name} status updated successfully. ` });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { fetchAllInsuranceAndLoansData, blockUnBlockInsuranceAndLoans }