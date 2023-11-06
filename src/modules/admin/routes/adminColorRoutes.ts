import { Router } from "express";
import { createColor, colorList, editColor, updateColor, deleteColor } from "../controllers/adminColorController";
import auth from "../middelware/admin_auth";

const router = Router()

router.post('/add-color', auth, createColor)
router.get('/color-list', auth, colorList)
router.get('/edit-color', auth, editColor)
router.post('/update-color/:id', auth, updateColor)
router.get('/delete-color/:id', auth, deleteColor)

export default router