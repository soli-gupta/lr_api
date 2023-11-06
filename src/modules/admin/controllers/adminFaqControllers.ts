import { Request, Response } from "express";
import Faq from "../../faqs/models/faqs";
import { getAllCmsPages } from '../../../helpers/admin/Helper'


const createNewFAQ = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const faqData = {
            faq_type: body.faq_type,
            faq_question: body.faq_question,
            faq_description: body.faq_description
        }

        const addFaq = new Faq(faqData);

        await addFaq.save();

        res.status(201).json({ status: 1, faq: addFaq, message: `FAQs added successfully.` });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const fetchAllFAQs = async (req: Request, res: Response) => {
    try {
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const fetchFAQs = await Faq.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!fetchFAQs) {
            return res.status(400).json({ status: 0, message: 'No FAQs found!' });
        }

        res.status(200).json({ status: 1, faq: fetchFAQs });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const fetchFAQs = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Please refresh the page and click again!' });
        }

        const fetchFAQ = await Faq.findById({ _id });

        if (!fetchFAQ) {
            return res.status(404).json({ status: 0, message: 'No FAQ found!' });
        }
        res.status(200).json({ status: 1, faq: fetchFAQ });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const updateFAQ = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const _id = req.params.id;
        const body = req.body;

        const faq = await Faq.findById({ _id });

        if (!faq) {
            return res.status(400).json({ status: 0, message: 'FAQ not updating at this time. Please refresh the page and click again!' });
        }

        faq.faq_type = body.faq_type;
        faq.faq_question = body.faq_question;
        faq.faq_description = body.faq_description;

        await faq.save();

        res.status(200).json({ status: 1, message: `FAQ updated successfully.`, faq });


    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const blockUnBlockFAQs = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }

        const faq = await Faq.findById({ _id });

        if (!faq) {
            return res.status(404).json({ status: 0, message: 'Brand not found!' });
        }

        faq.faq_status = status;
        await faq.save();

        res.status(200).json({ status: 1, message: 'FAQ updated successfully.' });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const fetchAllCmsPages = async (rewq: Request, res: Response) => {
    try {

        const cmsPages = await getAllCmsPages();

        if (!cmsPages) {
            return res.status(400).json({ status: 2, message: 'No data found.' });
        }

        res.status(200).json({ status: 1, cmsPages });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}







export { createNewFAQ, fetchAllFAQs, fetchFAQs, updateFAQ, blockUnBlockFAQs, fetchAllCmsPages }