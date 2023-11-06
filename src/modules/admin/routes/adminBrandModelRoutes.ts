import { Router } from 'express';
import { blockUnblockBrandModel, createBrandModel, getAllBrandModelsList, updateBrandModel, viewBrandModel, getModelByBrand, getBrandModel } from '../controllers/adminBrandModelController';
import upload from '../../brand/image-file/brand-mode-image';
import auth from '../middelware/admin_auth';
import { brandModelDataValidation } from '../../brand/validation/brandModelValidation';

const router = Router();


router.post('/create-brand-model', upload.single('image'), brandModelDataValidation, auth, createBrandModel);
router.get('/manage-brand-models', auth, getAllBrandModelsList);
router.get('/view-brand-model/:id', auth, viewBrandModel);
router.patch('/update-brand-model/:id', upload.single('image'), auth, updateBrandModel);
router.get('/block-unblock-model', auth, blockUnblockBrandModel);
router.get('/get-brand-model-by-brand', auth, getModelByBrand)
router.get('/get-brand-models', auth, getBrandModel);

export default router;