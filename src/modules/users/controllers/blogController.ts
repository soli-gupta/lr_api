import { Request, Response, NextFunction } from "express";
import blogPost from "../../blog/models/blog-post";
import blogCategory from "../../blog/models/blog-category";


const allBlogCategory = async(req:Request, res:Response) => {
        try {
            const categories: any = [];
            const blogCategories = await blogCategory.find({}).sort({_id : -1});
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
           res.status(200).json({status: 1, data: categories});
        } catch (error) {
            res.status(500).json({ status: 0, message: error });
        }
}

const allBlogList = async(req:Request, res:Response) => {
    try {
        const blogPostData = await blogPost.find({}).populate( [
            { path: "blog_category_id", select: ["blog_category_name", "blog_category_slug"] },
            { path: "blog_tag", select: ["name"]}
        ]).sort({ createdAt: -1 }).where({ blog_status: 1 })
        if (!blogPostData) {
           return res.status(404).json({ status: 0, message: 'Not found!' });
        }  
        res.status(200).json({ status: 1, data: blogPostData });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}


const blogDetailsBySlug = async(req:Request, res:Response) => {
    try {
        const slug = req.params.slug
        const blogDetail = await blogPost.findOne({blog_slug : slug}).populate( [
            { path: "blog_category_id", select: ["blog_category_name", "blog_category_slug"] },
            { path: "blog_tag", select: ["name"]}
        ]).where({ blog_status: 1 })

        const next_blog = await blogPost.findOne({createdAt:{$lt : blogDetail!.createdAt}}).sort({ createdAt: 1 }).limit(1)
        //  console.log('blog',new Date(blogDetail!.createdAt).toDateString())
        //  console.log('next',new Date(next_blog!.createdAt).toDateString())

        //  console.log('blog',blogDetail!.createdAt)
        //  console.log('next',next_blog!.createdAt)
        //  console.log('next_blog',next_blog)     //.sort({_id: -1})
       
        const pre_blog = await blogPost.findOne({createdAt:{$gt : blogDetail!.createdAt}}).sort({createdAt: -1}).limit(1)
        //  console.log('blog',blogDetail)
        // console.log('next',next_blog)
        // console.log('pre',pre_blog)
        res.status(200).json({ status: 1, data: blogDetail });
    } catch (error) {
          res.status(500).json({ status: 0, message: error });
    }

}

const nextPreBlog = async(req:Request, res:Response) => {
try {
    const next_recipes = await blogPost.findOne({})
//    const next_recipes = RecipesModel::where('id', '>', $recipes_data->id)->where('status', '1')->orderBy('id','desc')->first(); 
    // const back_recipes = RecipesModel::where('id', '<', $recipes_data->id)->where('status', '1')->orderBy('id','desc')->first();
} catch (error) {
    
}
}

export {allBlogList,allBlogCategory, blogDetailsBySlug}