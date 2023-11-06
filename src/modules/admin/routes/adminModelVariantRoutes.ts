import { Router } from "express";
import { createModelVariant, manageAllModelVariantList, viewModelVariant, updateModelVariant, blockUnblockModelVariant, getVariantsByModel } from "../controllers/adminModelVariantController";
import upload from "../image-file/model-variant";
import auth from "../middelware/admin_auth";
import { variantDataValidation } from "../validation/pageValidation/variantValidation";

const router = Router();

router.post('/create-model-variant', upload.single('image'), variantDataValidation, auth, createModelVariant);

router.get('/manage-all-variants', auth, manageAllModelVariantList);

router.get('/view-model-variant/:id', auth, viewModelVariant);

router.patch('/update-model-variant/:id', upload.single('image'), auth, updateModelVariant);

router.get('/block-unblock-variant', auth, blockUnblockModelVariant);

router.get('/get-variants-by-model', auth, getVariantsByModel);


export default router;