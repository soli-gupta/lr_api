import express, { Request, Response, NextFunction } from "express";
import blogCategory from "../models/blog-category";
import { createSlug } from "../../../helpers/common_helper";


const createBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogData = {
            blog_category_name: req.body.name ?? '',
            blog_category_slug: req.body.slug ? req.body.slug : await createSlug(req.body.name),
        }
        const blogcategory = new blogCategory(blogData);
        await blogcategory.save();
        res.status(201).json({ status: 1, data: blogcategory, message: `${blogcategory.blog_category_name} Created successfully!`, });
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const listBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const sort = { name: -1 }
        const blogCategories = await blogCategory.find({}).sort({ _id: -1 }).skip(skip).limit(limit);
        if (!blogCategories) {
            res.status(503).json({ error: 'Data not available.' });
        }
        blogCategories.forEach((category) => {
            categories.push({
                _id: category._id,
                name: category.blog_category_name,
                slug: category.blog_category_slug,
                status: category.blog_category_status,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            })
        })
        res.status(200).json({ status: 1, data: blogCategories });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewBlogCategory = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const blogcategory = await blogCategory.findOne({ _id });
        if (!blogcategory) {
            return res.status(400).send({ error: `Not found blog category with id ${_id}. Please try again!` });
        }
        res.status(200).json({ status: 1, data: blogcategory });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const updateBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Please click again for updating brand!' });
        }

        const blogCategoryData = await blogCategory.findById({ _id });
        if (!blogCategoryData) {
            return res.status(400).json({ status: 0, message: 'Brand not updating at this time. Please refresh the page and click again!' });
        }
        blogCategoryData.blog_category_name = req.body.name ? req.body.name : blogCategoryData.blog_category_name;
        blogCategoryData.blog_category_slug = req.body.slug ? req.body.slug : blogCategoryData.blog_category_slug;
        await blogCategoryData.save();

        const data = {
            name: blogCategoryData.blog_category_name,
            slug: blogCategoryData.blog_category_slug,
            status: blogCategoryData.blog_category_status,
            createdAt: blogCategoryData.createdAt,
            updatedAt: blogCategoryData.updatedAt
        }

        res.status(200).json({ status: 1, message: `${blogCategoryData.blog_category_name} updated successfully!`, data: data })

    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}


const activDeactiveStatus = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id && !status) {
            return res.status(400).json({ status: 0, message: 'Opps something went wrong. Pleae refresh the page and try again!' });
        }
        const blogCategoryData = await blogCategory.findById({ _id });
        if (!blogCategoryData) {
            return res.status(404).json({ status: 0, message: 'Blog category not found!' });
        }
        blogCategoryData.blog_category_status = status;
        await blogCategoryData.save();

        const data = {
            name: blogCategoryData.blog_category_name,
            slug: blogCategoryData.blog_category_slug,
            status: blogCategoryData.blog_category_status,
            createdAt: blogCategoryData.createdAt,
            updatedAt: blogCategoryData.updatedAt
        }
        res.status(200).json({ status: 1, message: `${blogCategoryData.blog_category_name} status updated successfully!`, data: data })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createBlogCategory, listBlogCategory, viewBlogCategory, updateBlogCategory, activDeactiveStatus }