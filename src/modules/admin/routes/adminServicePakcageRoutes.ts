import { Router } from "express";
import { fetchAllUserServicePackage, updateBookedServicePackageStatus } from "../controllers/adminServicePackageController";
import auth from "../middelware/admin_auth";


const router = Router();


router.get('/get-all-service-package', auth, fetchAllUserServicePackage);
router.get('/update-service-package-status', auth, updateBookedServicePackageStatus);

export default router;