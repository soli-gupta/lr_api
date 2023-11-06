import { Router } from "express";
import { productImageCarousel } from "../controllers/adminHelloAR";


const router = Router();

router.post('/product-image-carousel', productImageCarousel);


export default router;