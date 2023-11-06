import { Router } from "express";
import auth from "../middelware/admin_auth";
import { countAllData } from "../controllers/adminDashboardController";




const router = Router();

router.get('/get-all-count-dashboard', auth, countAllData);





export default router;