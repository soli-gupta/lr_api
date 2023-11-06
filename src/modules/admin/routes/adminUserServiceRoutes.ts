import { Router } from "express";
import { editServiceDetails, updateServiceDetail, userSeriveLeadList } from "../controllers/adminUserServiceController";
import auth from "../middelware/admin_auth";

const router = Router()

router.get('/user-service-list', auth, userSeriveLeadList)
router.get('/user-edit-service-detail/:id', auth, editServiceDetails)
router.post('/user-update-service-detail', auth, updateServiceDetail)

export default router