import { Router } from "express";
import { allNewsMedia, newsDetailBySlug } from "../controllers/newsMediaController";

const router = Router()

router.get('/all-news-media-list', allNewsMedia)
router.get('/news-media-details/:slug', newsDetailBySlug)

export default router