import { Router } from "express";
import auth from "../middelware/admin_auth";
import upload from "../../features-and-specification/image-file/index";
import { featureSpecificationValidation } from "../../features-and-specification/validation/featureSpecificatrionValid";
import { createFeatureSpecification, manageAllSpecifications, viewFeatureSpecification, blockUnBlockFeature, fetchAllFeatures, fetchFeatureByCategory, updateFeature, fetchFeturewithCategory, fetchFeatureSpecificationsBuyCategories } from "../controllers/adminFeatureSpecificationController";

const router = Router();


router.post('/create-feature', upload.single('icon'), featureSpecificationValidation, auth, createFeatureSpecification);
router.get('/manage-feature-specifications', auth, manageAllSpecifications);
router.get('/view-feature-specification/:id', auth, viewFeatureSpecification);
router.patch('/update-feature-specification/:id', upload.single('icon'), featureSpecificationValidation, auth, updateFeature);
router.get('/block-unblock-feature', auth, blockUnBlockFeature);

router.get('/fetch-feature-by-category', auth, fetchFeatureByCategory);
router.get('/fetch-all-feature', auth, fetchAllFeatures);

router.get('/test-feature-category-data/:id', auth, fetchFeturewithCategory);
router.get('/check-function-test', auth, fetchFeatureSpecificationsBuyCategories);


export default router;