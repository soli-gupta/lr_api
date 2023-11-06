import { Router } from "express";
import { bookAVisit, fetchAllBodyTypeForHome, fetchAllBrandsByProduct, fetchAllBrandsForHome, fetchAllCmsPages, fetchAllFuelTypesForHome, fetchAllModelByBrandInProducts, fetchAllServiceCenters, fetchCmsPage, fetchExperienceCenterForHome, fetchProductsForHome } from "../controllers/homepageController";
import { BookVisitValidation } from "../validation/bookVisitValidation";

const router = Router();

router.get('/get-all-cmspage', fetchAllCmsPages)
router.get('/cms-page/:slug', fetchCmsPage);
router.get('/fetch-all-brands', fetchAllBrandsForHome);
router.get('/fetch-all-body-type', fetchAllBodyTypeForHome);
router.get('/fetch-all-fuel-type', fetchAllFuelTypesForHome);
router.get('/fetch-homepage-products', fetchProductsForHome);
router.get('/fetch-experience-center', fetchExperienceCenterForHome);

router.post('/book-visit', BookVisitValidation, bookAVisit);
router.get('/fetch-all-service-centers', fetchAllServiceCenters);

router.get('/fetch-allbrand-by-product', fetchAllBrandsByProduct);
router.get('/fetch-all-models-by-brand-in-product/:slug', fetchAllModelByBrandInProducts);



export default router;