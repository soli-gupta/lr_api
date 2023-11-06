import { Router } from "express";
const router = Router();
import auth from "../middelware/admin_auth";
import { sellDataList, updateAdminSellDataDetail, viewSellData } from "../controllers/adminSellDataController";

router.get('/sell-data-list', auth, sellDataList)
router.get('/view-sell-data/:id', auth, viewSellData)
router.post('/admin-sell-request-status-update', auth, updateAdminSellDataDetail)

export default router