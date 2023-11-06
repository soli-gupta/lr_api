import { Router } from "express";
import upload from "../image-file/news-media-image";
import auth from "../middelware/admin_auth";
import { allNewsMedia, createNewsMedia, updateNewsMedia, viewNewsMedia } from "../controllers/adminNewsMediaController";


const router = Router()

router.post('/create-news-media', upload.single('image'), auth, createNewsMedia)
router.get('/view-news-media/:id', auth, viewNewsMedia)
router.get('/all-news-media', auth, allNewsMedia)
router.post('/update-news-media/:id', upload.single('image'), auth, updateNewsMedia)

export default router