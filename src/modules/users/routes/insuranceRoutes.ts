import { Router } from "express";
import { addInsuranceLoansData, getAllBanksList, getAllInsuranceList } from "../controllers/insuranceControllers";
import auth from "../middelware/user_auth";


const router = Router();


router.get('/get-all-banks-list', getAllBanksList);
router.get('/get-all-insurance-list', getAllInsuranceList);
router.post('/submit-car-number', auth, addInsuranceLoansData);


export default router;