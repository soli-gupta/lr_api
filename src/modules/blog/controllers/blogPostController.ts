import { Request, Response, NextFunction } from "express";
import blogPost from "../models/blog-post";
import fs from 'fs';
import path from "path";

const blogPostImagePath = path.join(process.cwd(), '/public/blog-post/');

const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const blogPostData = {
      blog_category_id: req.body.category_id ?? '',
      blog_name: req.body.name ?? '',
      blog_slug: req.body.slug ?? '',
      blog_posted_by: req.body.posted_by ?? '',
      blog_posted_date: req.body.posted_date ? req.body.posted_date : Date.now().toLocaleString(),
      blog_description: req.body.description ?? '',
      blog_tag: req.body.tags,
      blog_page_title: req.body.page_title ?? '',
      blog_short_description: req.body.short_description ?? '',
      blog_meta_description: req.body.meta_description ?? '',
      blog_meta_keywords: req.body.meta_keywords ?? ''
    }
    const saveBlogPost = new blogPost(blogPostData)

    if (req.file !== undefined) {
      const uploadFile = req.file.filename ?? '';
      saveBlogPost.blog_image = uploadFile;
    }
    //  console.log( req.body.tags)
    //  return false
    await saveBlogPost.save()
    const data = {
      category_id: saveBlogPost.blog_category_id,
      name: saveBlogPost.blog_name,
      slug: saveBlogPost.blog_slug,
      posted_by: saveBlogPost.blog_posted_by,
      posted_date: saveBlogPost.blog_posted_date,
      logo: saveBlogPost.blog_image ? blogPostImagePath + saveBlogPost.blog_image : '',
      short_description: saveBlogPost.blog_short_description,
      description: saveBlogPost.blog_description,
      status: saveBlogPost.blog_status,
      createdAt: saveBlogPost.createdAt,
      updatedAt: saveBlogPost.updatedAt
    }
    res.status(201).json({ status: 1, message: `Blog post created successfully!`, data: data });
  } catch (error) {
    res.status(500).json({ status: 0, message: error })
  }
}

const blogPostList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts: any = [];
    const page: any = req.query.page ? req.query.page : 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const blogPostData = await blogPost.find({}).populate([
      {
        path: "blog_category_id", select: ["blog_category_name", "blog_category_slug"]
      }
    ]).skip(skip).limit(limit);
    if (!blogPostData) {
      res.status(503).json({ error: 'Data not available.' });
    }
    blogPostData.forEach((post) => {
      posts.push(post)
    })
    res.status(200).json({ status: 1, data: blogPostData, countBlogPosts: posts.length });
  } catch (e) {
    res.status(500).json({ status: 0, message: e });
  }
}

const viewBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.query.id;
    if (!_id) {
      return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
    }

    const blogPostData = await blogPost.findById({ _id }).populate(
      [
        { path: "blog_category_id", select: ["blog_category_name", "blog_category_slug"] },
        { path: "blog_tag", select: ["name"] }
      ]
    );

    if (!blogPostData) {
      return res.status(404).json({ status: 0, message: 'Not found!' });
    }
    res.status(200).json({ status: 1, data: blogPostData });

  } catch (e) {
    res.status(500).json({ status: 0, message: e });
  }
}

const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
    }

    const getBlogPost = await blogPost.findById({ _id });

    if (!getBlogPost) {
      return res.status(404).json({ status: 0, message: 'Blog not found!' });
    }

    getBlogPost.blog_category_id = req.body.category_id ? req.body.category_id : getBlogPost.blog_category_id;
    getBlogPost.blog_name = req.body.name ? req.body.name : getBlogPost.blog_name,
      getBlogPost.blog_slug = req.body.slug ? req.body.slug : getBlogPost.blog_slug,
      getBlogPost.blog_posted_by = req.body.posted_by ? req.body.posted_by : getBlogPost.blog_posted_by,

      getBlogPost.blog_posted_date = req.body.posted_date ? req.body.posted_date : getBlogPost.blog_posted_date,

      getBlogPost.blog_short_description = req.body.short_description ? req.body.short_description : getBlogPost.blog_short_description,
      getBlogPost.blog_description = req.body.description ? req.body.description : getBlogPost.blog_description;


    getBlogPost.blog_meta_description = req.body.meta_description ? req.body.meta_description : getBlogPost.blog_meta_description,
      getBlogPost.blog_meta_keywords = req.body.meta_keywords ? req.body.meta_keywords : getBlogPost.blog_meta_keywords

    if (req.file !== undefined) {
      const uploadFile = req.file.filename ? req.file.filename : getBlogPost.blog_image;
      if (getBlogPost.blog_image) {
        fs.unlinkSync(blogPostImagePath + getBlogPost.blog_image);
      }
      getBlogPost.blog_image = uploadFile;
      console.log(uploadFile)
    }

    await getBlogPost.save();

    const updatedBlogPost = await blogPost.findById({ _id }).populate(
      [
        { path: "blog_category_id", select: ["blog_category_name", "blog_category_slug"] }
      ]
    )
    res.status(200).json({ status: 1, message: ` Blog updated successfully!`, data: updatedBlogPost });
  } catch (e) {
    res.status(500).json({ status: 0, message: e });
  }

}

const activeDeactiveBlogStatus = async (req: Request, res: Response) => {
  try {
    const _id = req.query.id;
    const status: any = req.query.status;
    console.log(req.query);
    if (!_id) {
      return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
    }

    if (!status) {
      return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Please refresh the page and click again!' });
    }

    const getBlogPost = await blogPost.findById({ _id });
    if (!getBlogPost) {
      return res.status(404).json({ status: 0, message: 'Model not found!' });
    }

    getBlogPost.blog_status = status;
    await getBlogPost.save();


    res.status(200).json({ status: 1, message: `Blog post updated successfully!`, data: getBlogPost })
  } catch (e) {
    res.status(500).json({ status: 0, message: e });
  }
}

export { createBlogPost, blogPostList, viewBlog, updateBlogPost, activeDeactiveBlogStatus }