import { Router } from "express";
import { activDeactiveFuel, checkSlugDuplicate, createFuelType, fetchFuelType, fuelTypeList, updateFuelType, viewFuelType } from "../controllers/adminFuelTypeController";
import auth from "../middelware/admin_auth";
import { fuelValidation } from "../validation/fuelValidation";
import upload from "../image-file/fuel-type";

const router = Router()

router.get('/fuel-list', auth, fuelTypeList)
router.post('/add-fuel', auth, upload.single('logo'), fuelValidation, createFuelType)
router.get('/view-fuel/:id', auth, viewFuelType)
router.patch('/update-fuel/:id',upload.single('logo'),  auth, updateFuelType)
router.get('/update-fuel-status',auth, activDeactiveFuel)
router.get('/check-slug', auth, checkSlugDuplicate);

router.get('/fetch-fule-type', auth, fetchFuelType);

export default router