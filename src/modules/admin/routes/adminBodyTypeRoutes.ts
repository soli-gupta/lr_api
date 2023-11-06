import { Router } from "express";
import { activeDeactiveBodyType, bodyTypeList, createBodyType, fetchBodyType, updateBodyType, viewBodyType } from "../controllers/adminBodyTypeController";
import auth from "../middelware/admin_auth";
import upload from "../image-file/body-type";

const router = Router()

router.post('/add-body-type', upload.single('logo'), auth, createBodyType)
router.get('/body-type-list', auth, bodyTypeList)
router.get('/view-body-type/:id', auth, viewBodyType)
router.patch('/update-body-type/:id', upload.single('logo'), auth, updateBodyType)
router.get('/update-body-type-status', auth, activeDeactiveBodyType);

router.get('/fetch-body-type', auth, fetchBodyType)


export default router