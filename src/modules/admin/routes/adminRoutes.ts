import { Router } from "express";
import { createAdmin, adminLogIn, getAdminProfile, updateAdminProfile, adminLogOut, adminLogOutOfAllDevices } from "../controllers/adminController";
import { adminDataValidation } from "../validation/schemaValidation/adminValidation";
import auth from '../middelware/admin_auth';
import upload from "../image-file";

const router = Router();



router.post('/create-admin', adminDataValidation, createAdmin);
router.post('/login',adminLogIn);
router.get('/profile', auth, getAdminProfile);
router.post('/update-profile', upload.single('profile'), auth, updateAdminProfile)
router.get('/logout', auth, adminLogOut);
router.get('/logout-all', auth, adminLogOutOfAllDevices);


export default router;