import { Request, Response } from "express";
import Tag from "../models/tag";
import { createSlug } from "../../../helpers/common_helper";

const createTag = async(req:Request, res:Response) => {
   try {
     const data = {
        name: req.body.name,
        slug: req.body.slug ? req.body.slug : await createSlug(req.body.name)
    }
    const checkTagSlug = await Tag.findOne({ slug: data.slug }); 
        if (checkTagSlug) {
            return res.status(400).json({ status: 2, message: `${data.slug} slug already added. Please change slug!` });
        }  
    const tag = new Tag(data);
    await tag.save(); 

    res.status(201).json({status: 1, data: tag, message: `${tag.name} Created successfully!`, });
   } catch (error) {
     res.status(500).json({ status: 0, message: error });
   }

}

const tagList = async(req:Request, res:Response) => {
try {
        const tags: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit; 
        const allTag = await Tag.find({}).sort({_id : -1}).skip(skip).limit(limit);
        if (!allTag) {
            res.status(503).json({ error: 'Data not available.' });
        }
        allTag.forEach((tag) => {
            tags.push({
                _id: tag._id,
                name: tag.name,
                slug: tag.slug,
                status: tag.status,
                createdAt: tag.createdAt,
                updatedAt: tag.updatedAt
            })
        })
        res.status(200).json({status: 1, data: allTag});
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const viewTag = async(req:Request, res:Response) => {
      try {
        const _id = req.query.id; 
        const tags = await Tag.findOne({ _id });
        if (!tags) { 
            return res.status(400).send({ error: `Not found tag with id ${_id}. Please try again!` });
        }
        res.status(200).json({status: 1 ,data: tags});
    } catch (e) {
        res.status(500).json({status: 0, message:e});
    }
}

const updateTag = async(req:Request, res:Response) => {
 try {
    const _id = req.params.id;
    
    if (!_id) {
        return res.status(400).json({ status: 0, message: 'Please click again for updating brand!' });
    } 
    
    const tags = await Tag.findById({_id});
    if (!tags) {
        return res.status(400).json({ status: 0, message: 'Brand not updating at this time. Please refresh the page and click again!' });
    }
    tags.name = req.body.name ? req.body.name : tags.name;
    tags.slug = req.body.slug ? req.body.slug : tags.slug;
    await tags.save();

    const data = {
        name: tags.name,
        slug: tags.slug,
        status: tags.status,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt
    }

    res.status(200).json({ status: 1, message: `${tags.name} updated successfully!`, data: data })

   } catch (error) {
    res.status(500).json({ status: 0, message: error })
   }
}

const activeDeactiveTag = async(req:Request, res:Response) => {
   try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const tags = await Tag.findById({ _id });
        if (!tags) {
            return res.status(404).json({ status: 0, message: 'tags not found!' });
        }
        tags.status = status;
        await tags.save();

        const shareTags = {
            name: tags.name,
            slug: tags.slug,
            status: tags.status,
            createdAt: tags.createdAt,
            updatedAt: tags.updatedAt
        }
        res.status(200).json({ status: 1, message: `${tags.name} updated successfully!`, brand: shareTags })
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}
export {createTag, tagList, viewTag, updateTag, activeDeactiveTag}