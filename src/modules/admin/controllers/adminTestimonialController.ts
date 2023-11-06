import { Request, Response, NextFunction } from "express";
import Testimonial from "../models/testimonial";
import path from "path";
import fs from "fs"

const userImagePath = path.join(process.cwd(), '/public/testimonial/');
const DIR = 'public/testimonial/';

const createTestimonial = async (req: Request, res: Response) => {

    try {
        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            product_name: req.body.product_name,
            testimonial_type: req.body.testimonial_type,
            service_name: req.body.service_name ? req.body.service_name : '',
            description: req.body.description,
            rating: req.body.rating,
            video_url: req.body.video_url,
            select_home: req.body.select_home ? req.body.select_home : ''
        }

        const saveData = new Testimonial(data)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            saveData.user_image = uploadFile;
        }
        await saveData.save()
        res.status(200).json({ status: 1, message: `Testimonial created successfully`, data: saveData });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewTestimonial = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const testimonial = await Testimonial.findById({ _id })
        if (!testimonial) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        testimonial!.user_image = DIR + testimonial!.user_image ?? ''
        res.status(200).json({ status: 1, data: testimonial })
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const testimonial = await Testimonial.findById({ _id })
        if (!testimonial) {
            res.status(400).json({ status: 0, message: 'Data not Avaiable' })
        }
        testimonial!.first_name = req.body.first_name ? req.body.first_name : testimonial!.first_name
        testimonial!.last_name = req.body.last_name ? req.body.last_name : testimonial!.last_name
        testimonial!.product_name = req.body.product_name ? req.body.product_name : testimonial!.product_name
        testimonial!.testimonial_type = req.body.testimonial_type ? req.body.testimonial_type : testimonial!.testimonial_type
        testimonial!.service_name = req.body.service_name ? req.body.service_name : testimonial!.service_name
        testimonial!.description = req.body.description ? req.body.description : testimonial!.description
        testimonial!.rating = req.body.rating ? req.body.rating : testimonial!.rating
        testimonial!.video_url = req.body.video_url
        testimonial!.select_home = req.body.select_home

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : testimonial!.user_image;
            if (testimonial!.user_image) {
                fs.unlinkSync(userImagePath + testimonial!.user_image);
            }
            testimonial!.user_image = uploadFile;
        }
        await testimonial!.save()
        const data = {
            _id: testimonial!._id,
            first_name: testimonial!.first_name,
            last_name: testimonial!.last_name,
            product_name: testimonial!.product_name,
            testimonial_type: testimonial!.testimonial_type,
            service_name: testimonial!.service_name,
            description: testimonial!.description,
            rating: testimonial!.rating,
            video_url: testimonial!.video_url,
            select_home: testimonial!.select_home,
            user_image: testimonial!.user_image ? DIR + testimonial!.user_image : ''
        }
        res.status(200).json({ status: 1, message: `${testimonial!.first_name} updated successfully!`, data: data });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const testimonialList = async (req: Request, res: Response) => {
    try {
        const testimonials: any = [];
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const allTestimonial = await Testimonial.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        if (!allTestimonial) {
            return res.status(400).json({ status: 0, message: 'No data found!' });
        }
        allTestimonial.forEach((testimonial) => {
            testimonials.push({
                _id: testimonial._id,
                first_name: testimonial.first_name,
                last_name: testimonial.last_name,
                user_image: testimonial.user_image ? DIR + testimonial.user_image : '',
                product_name: testimonial.product_name,
                testimonial_type: testimonial.testimonial_type,
                service_name: testimonial.service_name,
                description: testimonial.description,
                rating: testimonial.rating,
                video_url: testimonial.video_url,
                select_home: testimonial.select_home,
                status: testimonial.status,
                createdAt: testimonial.createdAt,
                updatedAt: testimonial.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: testimonials, testimonialsCount: testimonials.length });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const activeDeactivetestimonial = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const status: any = req.query.status

        if (!_id && !status) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }

        const testimonial = await Testimonial.findById({ _id })

        if (!testimonial) {
            res.status(404).json({ status: 0, message: ' Testimonial not found!' });
        }

        testimonial!.status = status
        await testimonial!.save();
        const data = {
            _id: testimonial!._id,
            first_name: testimonial!.first_name,
            last_name: testimonial!.last_name,
            product_name: testimonial!.product_name,
            testimonial_type: testimonial!.testimonial_type,
            service_name: testimonial!.service_name,
            description: testimonial!.description,
            rating: testimonial!.rating,
            video_url: testimonial!.video_url,
            select_home: testimonial!.select_home,
            user_image: testimonial!.user_image ? DIR + testimonial!.user_image : ''
        }
        res.status(200).json({ status: 1, message: ` Testimonial updated successfully!`, data: data })

    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}
export { createTestimonial, viewTestimonial, updateTestimonial, testimonialList, activeDeactivetestimonial }