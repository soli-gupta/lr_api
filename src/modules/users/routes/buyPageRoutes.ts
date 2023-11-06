import { Router } from "express";

import { buyPageProducts, buyPageProductsWithBrand, fetchAllFaeturesByCategory, fetchCompareProducts, fetchLinkedProducts, fetchModelsByBrands, fetchProductDetail, fetchProductsByBrandAndModel, fetchvariantsByModelForBuyPage, generateBuyPageLead, fetchFeatureCategoriesByProduct, fetchAllProductFaeturesByCategory, fetchAllFeaturesByCategory, bookTestDrive, fetchCitiesByStateName, getProductMinMaxPrice, getProductsAfterNoProductFound, fetchBookedTestDriveByUser, fetchGeneratedBuylead, fetchBrandDetailBySlug } from "../controllers/buyPageController";
import auth from "../middelware/user_auth";
import { BooktestDriveValidation } from "../validation/BooktestDriveValidation";
import { BookVisitValidation } from "../validation/bookVisitValidation";
import multer from "multer";

const upload = multer();


const router = Router();

router.get('/buy-products', buyPageProducts);
router.get('/buy-products/:slug', buyPageProductsWithBrand);

router.get('/fetch-models-by-brand-buy-page/:slug', fetchModelsByBrands);
router.get('/fetch-variantsby-model-buy-page/:slug', fetchvariantsByModelForBuyPage);
router.post('/generate-buy-page-lead', auth, generateBuyPageLead);
router.get('/fetch-product-detail-by-slug/:productSlug', fetchProductDetail);

router.get('/get-all-features-by-categories/:id', fetchAllFaeturesByCategory);
router.get('/fetchlinked-product-for-detail/:productSlug', fetchLinkedProducts);
router.get('/compare-products-for-detail', fetchCompareProducts);
router.get('/fetch-products-by-brand-model', fetchProductsByBrandAndModel);
router.get('/fetch-feature-category-by-product', fetchFeatureCategoriesByProduct);

router.get('/fetch-product-feature-by-category', fetchAllProductFaeturesByCategory);
router.get('/fetch-allfeature-details-by-category', fetchAllFeaturesByCategory);

router.get('/fetch-cities-by-state-name', fetchCitiesByStateName);

router.post('/book-test-drive', upload.single('test'), auth, bookTestDrive);
router.get('/fetch-product-min-max-price', getProductMinMaxPrice);
// router.get('/fetch-product-for-thank-you/:productSlug', auth, fetchProductDetail);BooktestDriveValidation

router.get('/get-product-after-no-data-found', getProductsAfterNoProductFound);
router.get('/fetch-booked-user-test-drive/:id', auth, fetchBookedTestDriveByUser);

router.get('/feth-buy-lead-by-user/:id', auth, fetchGeneratedBuylead);
router.get('/fetch-brand-detailsfor-page/:slug', fetchBrandDetailBySlug);



export default router