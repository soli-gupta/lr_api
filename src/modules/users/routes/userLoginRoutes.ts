import { Router } from "express";
import { convertBase64ImageToFile, editUser, loginUser, OtpVerify, updateUserProfile, userLogout } from "../controllers/userLoginController";
import auth from "../middelware/user_auth";
import upload from "../image-file";

const router = Router()

router.post('/user-login', loginUser)
router.post('/otp-verify', OtpVerify)
router.get('/user-profile', auth, editUser);
router.post('/user-update-profile', upload.single('profile'), auth, updateUserProfile)
router.get('/user-logout', auth, userLogout)

router.get('/covert-file', convertBase64ImageToFile)

export default router