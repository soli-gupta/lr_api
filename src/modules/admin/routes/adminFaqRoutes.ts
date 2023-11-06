import { Router } from "express";
import auth from "../middelware/admin_auth";
import { blockUnBlockFAQs, createNewFAQ, fetchAllCmsPages, fetchAllFAQs, fetchFAQs, updateFAQ } from "../controllers/adminFaqControllers";
import multer from "multer";

const upload = multer();

const router = Router();

router.post('/add-faq', auth, upload.single('test'), createNewFAQ);
router.get('/fetch-all-faq', auth, fetchAllFAQs);
router.get('/fetch-faq/:id', auth, fetchFAQs);
router.patch('/update-faq/:id', upload.single('test'), auth, updateFAQ);
router.get('/block-unblock-faq', auth, blockUnBlockFAQs);
router.get('/fetch-all-cms-pages', auth, fetchAllCmsPages);





export default router