import { Request, Response, NextFunction } from "express";
import Contact from "../../admin/models/contact";

const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactData = {
            first_name: req.body.first_name ?? '',
            last_name: req.body.last_name ?? '',
            mobile: req.body.mobile ?? '',
            email: req.body.email ?? '',
            query_type: req.body.query_type ?? '',
            description: req.body.description ?? ''
        }
        const contact = new Contact(contactData)
        await contact.save()
        res.status(200).json({ status: 1, message: 'Thanks for reaching out,  We’re thrilled to hear from you. Our inbox can’t wait to get your messages, so talk to us any time you like.', contact: contact })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}


export { createContact }
