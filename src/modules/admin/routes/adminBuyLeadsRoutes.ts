import { Router } from "express";
import { fetchAllBuyLeads, updateLeadsStatus } from "../controllers/adminBuyLeadsController";
import auth from "../middelware/admin_auth";



const router = Router();



router.get('/get-all-leads', auth, fetchAllBuyLeads);
router.get('/update-leads-status', auth, updateLeadsStatus);

export default router;