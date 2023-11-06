import { Request, Response } from "express";
import Testimonial from "../../admin/models/testimonial";

const DIR = 'public/testimonial/';
const allTestimonialData = async (req: Request, res: Response) => {
    try {
        const testimonial: any = [];
        const testimonials = await Testimonial.find({ select_home: 'yes' }).sort({ _id: -1 }).where({ status: 1 }).limit(10);
        if (!testimonials) {
            res.status(503).json({ error: 'Data not available.' });
        }

        testimonials.forEach((testimonials) => {
            testimonial.push({
                _id: testimonials._id,
                first_name: testimonials.first_name,
                last_name: testimonials.last_name,
                user_image: testimonials.user_image,
                type: testimonials.testimonial_type,
                product_name: testimonials.product_name,
                service_name: testimonials.service_name,
                description: testimonials.description,
                testimonial_type: testimonials.testimonial_type,
                video_url: testimonials.video_url ? testimonials.video_url : '',
                rating: testimonials.rating,
                status: testimonials.status,
                createdAt: testimonials.createdAt,
                updatedAt: testimonials.updatedAt
            })
        })

        res.status(200).json({ status: 1, data: testimonial });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const fetchTestimonialByType = async (req: Request, res: Response) => {
    try {
        const testimonialType = req.params.type;
        const testimonial = await Testimonial.find({ testimonial_type: testimonialType }).where({ status: 1 });

        if (!testimonial) {
            return res.status(400).json({ status: 2, message: 'Server problem, Please refresh the page or come back after some time!' });
        }
        res.status(200).json({ status: 1, data: testimonial });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { allTestimonialData, fetchTestimonialByType }