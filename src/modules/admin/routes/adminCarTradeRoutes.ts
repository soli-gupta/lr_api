import { Router } from "express";
import { CarTradeBuyLeadCreate, fetchAllCarTradeBuyLeads, updateCarTradeLeadStatus, viewCarTradeCarDetails } from "../controllers/adminCarTradeController";
import auth from "../middelware/admin_auth";


const router = Router();

router.post('/car-trade/add-buy-lead', CarTradeBuyLeadCreate);
router.get('/admin/get-car-tarde-buy-leads', auth, fetchAllCarTradeBuyLeads);
router.get('/admin/update-car-trade-status', auth, updateCarTradeLeadStatus);
router.get('/admin/view-car-tarde-lead/:id', auth, viewCarTradeCarDetails);



export default router