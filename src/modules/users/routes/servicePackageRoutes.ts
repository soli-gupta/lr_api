import { Router } from "express";
import { bookServicePackage, fetchAllFAQsByPage, fetchAllFuelType, fetchAllCarServiceCenters, fetchBrandList, fetchServiceCenters, updateServicePackage, uploadDocsAfterOrer } from "../controllers/servicePackageController";
import auth from "../middelware/user_auth";
import upload from "../image-file/order-docs";


const router = Router();

router.get('/get-brands-sorting', fetchBrandList);
router.get('/get-all-fuels', fetchAllFuelType);
router.post('/book-service-package', auth, bookServicePackage);
router.get('/fetch-service-centers', fetchServiceCenters);
router.get('/fetch-car-care-service-center', fetchAllCarServiceCenters);

router.patch('/upload-doc-after-order/:id', upload.fields([{ name: "rc_certificate", maxCount: 1 }, { name: "insurance_copy", maxCount: 1 }]), auth, uploadDocsAfterOrer);

router.patch('/update-service-package-order/:id', auth, updateServicePackage);

router.get('/get-faqs-by-page/:slug', fetchAllFAQsByPage);


export default router;