import { Router } from "express";
import { arrayOfYears, brandsList, getCityByState, getModelByBrand, getStates, getVariantsByModel } from "../controllers/sellController";

const router = Router();

router.get('/brands-list', brandsList)
router.get('/model-by-brand-id', getModelByBrand)
router.get('/variant-by-model-id', getVariantsByModel)
router.get('/get-year', arrayOfYears)
router.get('/states', getStates)
router.get('/cities', getCityByState)
export default router