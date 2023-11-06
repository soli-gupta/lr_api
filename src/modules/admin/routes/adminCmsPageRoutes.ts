import { Router } from "express";
import auth from "../middelware/admin_auth";
import upload from "../image-file/cms-page";
import { cmsPageDataValidation } from "../validation/pageValidation/cmsPageValidation";
import { blockUnblockCmsPage, createCmsPage, manageAllCmsPages, updateCmsPage, viewCmsPage } from "../controllers/adminCmsPageController";

const router = Router();

// cmsPageDataValidation  'banner,why_choose_luxury,selling_your_car'
router.post('/create-page', upload.fields([{ name: 'why_choose_luxury', maxCount: 1 }, { name: 'selling_your_car', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'our_service_centers', maxCount: 1 }, { name: 'mobile_banner', maxCount: 1 }, { name: "sell_book_car_inspaction", maxCount: 1 }, { name: "sell_selling_your_car", maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'benefits_like', maxCount: 1 }, { name: "ew_on_the_safe_side", maxCount: 1 }, { name: "bb_assurance", maxCount: 1 }, { name: "why_choose_luxury_mobile", maxCount: 1 }, { name: "selling_your_car_mobile", maxCount: 1 }, { name: "our_service_centers_mobile", maxCount: 1 }]), auth, createCmsPage);

router.get('/manage-cms-pages', auth, manageAllCmsPages);
router.get('/view-cms-page/:id', auth, viewCmsPage);

router.patch('/update-cms-page/:id', upload.fields([{ name: 'why_choose_luxury', maxCount: 1 }, { name: 'selling_your_car', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'our_service_centers', maxCount: 1 }, { name: 'mobile_banner', maxCount: 1 }, { name: "sell_book_car_inspaction", maxCount: 1 }, { name: "sell_selling_your_car", maxCount: 1 }, { name: 'benefits_like', maxCount: 1 }, { name: "ew_on_the_safe_side", maxCount: 1 }, { name: "bb_assurance", maxCount: 1 }, { name: "why_choose_luxury_mobile", maxCount: 1 }, { name: "selling_your_car_mobile", maxCount: 1 }, { name: "our_service_centers_mobile", maxCount: 1 }]), auth, updateCmsPage);

router.get('/block-unblock-cms-page', auth, blockUnblockCmsPage);



export default router;