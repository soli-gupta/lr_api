import { Router } from "express";
import auth from "../middelware/admin_auth";
import { fetchAllUserExtendedWarranty, updateUserExtendedWarranty } from "../controllers/adminExtendedWarrantyController";


const router = Router();


router.get('/get-all-extended-warranty', auth, fetchAllUserExtendedWarranty);
router.get('/update-extended-warranty-status', auth, updateUserExtendedWarranty);


export default router;