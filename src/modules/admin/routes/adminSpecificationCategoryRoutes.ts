import { Router } from "express";
import { activeDeactiveSpecificationCategoryStatus, createSpecificationCategory, specificationCategoryList, updateSpecificationCategory, viewSpecificationCategory, fetchSpecificationCategory } from "../controllers/adminSpecificationCategoryController";
import auth from "../middelware/admin_auth";
import { specificationCategoryValidation } from "../../features-and-specification/validation/specificationCategoryValidation";

const router = Router();

router.post('/add-specification-category', auth, specificationCategoryValidation, createSpecificationCategory)
router.get('/specification-category-list', auth, specificationCategoryList)
router.get('/view-specification-category/:id', auth, viewSpecificationCategory)
router.patch('/update-specification-category/:id', auth, updateSpecificationCategory)
router.get('/update-specification-category-status', auth, activeDeactiveSpecificationCategoryStatus)

router.get('/fetch-all-sepecification-category', auth, fetchSpecificationCategory);


export default router