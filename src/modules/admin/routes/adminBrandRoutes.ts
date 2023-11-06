import { Router } from "express";
import { blockUnblockBrand, createBrand, createmakeModelVariantByExcel, fetchBrands, manageBrandsList, updateBrand, viewBrand } from "../controllers/adminBrandController";
import auth from "../middelware/admin_auth";
import upload from "../../brand/image-file/index";
import { brandDataValidation } from "../../brand/validation/brandValidation";

const router = Router();

//fields([{ name: 'logo', maxCount: 1 }, { name: 'make_model_variant_excel', maxCount: 1 }])
router.post('/create-brand', upload.single('logo'), brandDataValidation, auth, createBrand);
router.get('/manage-brands', auth, manageBrandsList)
router.get('/view-brand/:id', auth, viewBrand);
router.patch('/update-brand/:id', upload.single('logo'), auth, updateBrand);
router.get('/block-unblock-brand', auth, blockUnblockBrand);
router.get('/fetch-brands', auth, fetchBrands);
router.post('/upload-make-model-variant', upload.single('make_model_variant_excel'), auth, createmakeModelVariantByExcel)

export default router;