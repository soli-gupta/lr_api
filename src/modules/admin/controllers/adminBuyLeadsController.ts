import { Request, Response } from "express";
import CreateBuyLead from "../../users/models/create-buy-lead";



const fetchAllBuyLeads = async (req: Request, res: Response) => {
    try {
        const leads: any = [];
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 200;
        const skip = (page - 1) * limit;
        const lead_type: any = req.query.lead_type;

        const buyLeads = await CreateBuyLead.find({ lead_type }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 });

        // console.log('sdfvh')
        // console.log(buyLeads);


        if (!buyLeads) {
            return res.status(400).json({ status: 2, message: 'No leads found!' });
        }


        buyLeads.forEach((lead) => {

            leads.push({
                _id: lead._id,
                first_name: lead.first_name,
                last_name: lead.last_name,
                brand_id: lead.brand_id,
                model_id: lead.model_id,
                variant_id: lead.variant_id,
                kms_driven: lead.kms_driven,
                status: lead.lead_status,
                createdAt: lead.createdAt,
                updatedAt: lead.updatedAt,
                contact: lead.lead_contact,
                lead_type: lead.lead_type
            })
        });

        res.status(200).json({ status: 1, leads });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const updateLeadsStatus = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
        }

        const lead = await CreateBuyLead.findById({ _id });

        if (!lead) {
            return res.status(404).json({ status: 0, message: 'Lead not found!' });
        }

        lead.lead_status = status;
        await lead.save();

        res.status(200).json({ status: 1, message: `Status updated for ${lead.lead_contact}` })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



export { fetchAllBuyLeads, updateLeadsStatus };