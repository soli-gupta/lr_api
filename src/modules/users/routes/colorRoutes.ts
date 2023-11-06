import { Router } from "express";
import { allColorList } from "../controllers/colorController"; 

const router = Router()

router.get('/all-color-list', allColorList)

export default router