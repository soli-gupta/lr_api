import { Router } from "express";
import upload from "../image-file/testimonial-image";
import { activeDeactivetestimonial, createTestimonial, testimonialList, updateTestimonial, viewTestimonial } from "../controllers/adminTestimonialController";
import auth from "../middelware/admin_auth";

const router = Router()

router.post('/create-testimonial', auth, upload.single('user_image'), createTestimonial)
router.get('/view-testimonial/:id', auth, viewTestimonial)
router.post('/update-testimonial/:id', upload.single('user_image'), auth, updateTestimonial)
router.get('/all-testimonial', auth, testimonialList)
router.get('/active-deactive-testimonial', auth, activeDeactivetestimonial)

export default router