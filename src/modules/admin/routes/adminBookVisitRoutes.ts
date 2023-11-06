import { Router } from "express";
import { getAllVisitsList, updateBookedVisitState } from "../controllers/adminBookVisitController";
import auth from "../middelware/admin_auth";

const router = Router();

router.get('/booked-visits', auth, getAllVisitsList);
router.get('/update-booked-visit-status', auth, updateBookedVisitState);

export default router