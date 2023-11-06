import { Router } from "express";
import { createSellData, editSellData, updateSellData, cancelSellRequestData, userSellRequestAllList, rescheduleSellRequest, deleteEvaluationDocument, updateRequestData, editSellRequestData, sellRequestGetCallBack } from "../controllers/sellDataController";
import upload from "../image-file/sell-image";
import auth from "../../users/middelware/user_auth";
const router = Router();

router.post('/save-sell-data', auth, createSellData)
router.get('/edit-sell-data', auth, editSellData)
router.get('/edit-sell-request', auth, editSellRequestData)
router.post('/update-sell-request/:id', auth, updateRequestData)
router.post('/update-sell-data', auth, upload.fields([{ name: 'rc_registration_certificate', maxCount: 1 }, { name: 'car_insurance', maxCount: 1 }]), updateSellData)
router.post('/cancel-sell-data', auth, cancelSellRequestData)
router.get('/user-sell-request-list', auth, userSellRequestAllList)
router.post('/reschedule-sell-request', auth, rescheduleSellRequest)
router.post('/remove-evaluation-doc', auth, deleteEvaluationDocument)
router.post('/sell-request-call-back', auth, sellRequestGetCallBack)

export default router