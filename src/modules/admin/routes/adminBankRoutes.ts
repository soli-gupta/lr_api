import { Router } from "express";
import upload from "../image-file/bank-images";
import auth from "../middelware/admin_auth";
import { blockUnBlockBank, createBank, getAllBanks, getBankDetail, updateBank } from "../controllers/adminBankController";


const router = Router();

router.post('/create-bank', upload.single("image"), auth, createBank);
router.get('/get-all-banks', auth, getAllBanks);
router.get('/get-bank-detail', auth, getBankDetail);
router.patch('/udpate-bank/:id', upload.single("image"), auth, updateBank)
router.get('/block-unblock-bank', auth, blockUnBlockBank);


export default router;