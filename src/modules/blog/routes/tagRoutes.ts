import { Router } from "express";
import auth from "../../admin/middelware/admin_auth";
import { activeDeactiveTag, createTag, tagList, updateTag, viewTag } from "../controllers/tagController";

const router = Router()

router.get('/tag-list', auth, tagList);
router.post('/add-tag', auth, createTag);
router.get('/view-tag',auth, viewTag )
router.post('/update-tag/:id', auth, updateTag )
router.get('/update-tag-status', auth,  activeDeactiveTag)

export default router