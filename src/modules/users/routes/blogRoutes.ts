import { Router } from "express";
import { allBlogCategory, allBlogList, blogDetailsBySlug } from "../controllers/blogController";

const router = Router()

router.get('/blogs', allBlogList)
router.get('/all-blog-category', allBlogCategory)
router.get('/blogs/:slug', blogDetailsBySlug)

export default router