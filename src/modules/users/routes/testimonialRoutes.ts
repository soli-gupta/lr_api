import { Router } from "express";
import { allTestimonialData, fetchTestimonialByType } from "../controllers/testimonialController";

const router = Router()

router.get('/all-testimonial-list', allTestimonialData)
router.get('/testimonial/:type', fetchTestimonialByType)

export default router