
import { Router } from "express";
import upload from "../image-file/insurance-images";
import auth from "../middelware/admin_auth";
import { blockUnBlockInsurance, createInsurance, getAllInsurances, getInsuranceDetail, updateInsurance } from "../controllers/adminInsuranceController";



const router = Router();

router.post('/create-insurance', upload.single("image"), auth, createInsurance);
router.get('/get-all-insurances', auth, getAllInsurances);
router.get('/get-insurance-detail', auth, getInsuranceDetail);
router.patch('/udpate-insurance/:id', upload.single("image"), auth, updateInsurance)
router.get('/block-unblock-insurance', auth, blockUnBlockInsurance);


export default router;