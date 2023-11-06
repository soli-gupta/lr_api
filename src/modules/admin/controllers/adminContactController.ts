import { Request, Response, NextFunction } from "express";
import Contact from "../models/contact";


const contactList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contacts: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit: any = 200;
        const skip = (page - 1) * limit;
        const contactList = await Contact.find({}).sort({ _id: -1 }).skip(skip).limit(limit);

        if (contactList.length <= 0) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }
        contactList.forEach((contact) => {
            contacts.push(contact)
        })
        res.status(200).json({ status: 1, data: contacts });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const activeAndDeactiveContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const contact = await Contact.findById({ _id })

        if (!contact) {
            res.status(404).json({ status: 0, message: 'User not found!' });
        }

        contact!.status = status

        await contact!.save();
        res.status(200).json({ status: 1, message: `${contact!.first_name} ${contact!.first_name} status updated successfully!`, data: contact })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const contact = await Contact.findById({ _id })

        if (!contact) {
            res.status(404).json({ status: 0, message: 'User not found!' });
        }
        await Contact.deleteOne({ _id })

        res.status(200).json({ status: 1, message: `${contact!.first_name} ${contact!.first_name} deleted successfully` })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export { contactList, activeAndDeactiveContact, deleteContact }