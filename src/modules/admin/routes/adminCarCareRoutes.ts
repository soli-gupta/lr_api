import { Router } from "express";
import auth from "../middelware/admin_auth";
import upload from "../image-file/upload-car-care-excel-file"
import { activeDeactiveCarCarePackage, carCarePackageList, createCarCarePackage, updateCarCarePackage, viewCarCarePackage } from "../controllers/adminCarCareController";

const router = Router()

router.post('/admin-create-car-care-package', upload.single('car-care-file'), auth, createCarCarePackage)
router.get('/admin-car-care-package-list', auth, carCarePackageList)
router.get('/admin-car-care-package-view/:id', auth, viewCarCarePackage)
router.post('/admin-car-care-package-update/:id', auth, updateCarCarePackage)
router.get('/admin-active-deactive-car-care-package', auth, activeDeactiveCarCarePackage)

export default router