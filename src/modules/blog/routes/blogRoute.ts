import { Router } from "express";
import { createBlogCategory, listBlogCategory, viewBlogCategory,updateBlogCategory, activDeactiveStatus } from "../controllers/blogCategoryController";
import auth from "../../admin/middelware/admin_auth";
import { blogValidation } from "../validation/schemaValidation/blogCategoryValidation";
import { blogPostValidate } from "../validation/schemaValidation/blogPostValidation";
import uploadBlogPostImage from "../image-file/postImage";
import { blogPostList, createBlogPost, updateBlogPost, viewBlog, activeDeactiveBlogStatus } from "../controllers/blogPostController";

const router = Router()

// Blog Category Route
router.get('/blog-category-list', auth, listBlogCategory);
router.post('/add-blog-category', blogValidation, auth, createBlogCategory);
router.get('/view-blog-category',auth, viewBlogCategory)
router.patch('/update-blog-category/:id', auth, updateBlogCategory)
router.get('/update-status', auth, activDeactiveStatus)

// Blog Post Route
router.get('/blog-list', auth, blogPostList);
router.post('/add-blog', uploadBlogPostImage.single('logo'), blogPostValidate, auth, createBlogPost)
router.get('/view-blog', auth, viewBlog)
router.patch('/update-blog/:id', uploadBlogPostImage.single('logo'), auth, updateBlogPost)
router.get('/update-blog-status', auth, activeDeactiveBlogStatus)

export default router