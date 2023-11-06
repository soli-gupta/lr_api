import { Router } from "express";
import { fetchLoggedUserDetail } from "../controllers/userController";
import auth from "../middelware/user_auth";


const router = Router();

router.get('/get-user-profile', auth, fetchLoggedUserDetail);






export default router;