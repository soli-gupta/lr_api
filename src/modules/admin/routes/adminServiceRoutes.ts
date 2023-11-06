import { Router } from "express";
import { activeDeactiveService, createServices, servicesList, updateService, viewServices } from "../controllers/adminServiceController";
import auth from "../middelware/admin_auth";
import upload from "../image-file/upload-service-file";

const router = Router()

router.post('/admin-create-service', upload.single('service-file'), auth, createServices)
router.get('/admin-service-list', auth, servicesList)
router.get('/admin-service-view/:id', auth, viewServices)
router.post('/admin-service-update/:id', auth, updateService)
router.get('/admin-active-deactive-service', auth, activeDeactiveService)

export default router