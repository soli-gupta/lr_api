import { Router } from "express";
import auth from "../middelware/admin_auth";
import { blockUnBlockInsuranceAndLoans, fetchAllInsuranceAndLoansData } from "../controllers/adminInsuranceAndLoansController";


const router = Router();


router.get('/get-all-insurance-loans-data', auth, fetchAllInsuranceAndLoansData);
router.get('/update-insurance-loans-lead-status', auth, blockUnBlockInsuranceAndLoans);


export default router;