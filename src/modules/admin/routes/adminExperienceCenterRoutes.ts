import { Router } from "express";
import upload from "../../experience-centers/image-file";
import { createExperienceCenter, manageAllExperienceCenter, viewExperienceCenter, updateExperienceCenter, blockUnblockExperienceCenter, fetchExperienceCenter } from "../controllers/adminExperienceCenterController";
import auth from "../middelware/admin_auth";
import { experienceCenterDataValidation } from "../../experience-centers/validation/experienceCenterValidation";


const router = Router();

router.post('/create-experience-center', upload.fields([{ name: 'center_banner', maxCount: 1 }, { name: 'service_center_banner', maxCount: 1 }, { name: 'car_care_banner', maxCount: 1 }]), experienceCenterDataValidation, auth, createExperienceCenter);

router.get('/manage-experience-centers', auth, manageAllExperienceCenter);
router.get('/view-experience-center/:id', auth, viewExperienceCenter);

router.patch('/update-expeirence-center/:id', upload.fields([{ name: 'center_banner', maxCount: 1 }, { name: 'service_center_banner', maxCount: 1 }, { name: 'car_care_banner', maxCount: 1 }]), auth, updateExperienceCenter);
router.get('/block-unblock-experience-center', auth, blockUnblockExperienceCenter);
router.get('/fetch-experience-center', auth, fetchExperienceCenter)


export default router;