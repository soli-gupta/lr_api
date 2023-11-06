import { Request, Response } from "express";
import Color from "../models/color";
import { createSlug } from "../../../helpers/common_helper";

const createColor = async(req:Request, res:Response) => {
    try {
        const data = {
            color_name : req.body.name ?? '',
            color_slug : await createSlug(req.body.name),
            color_code : req.body.color_code ?? '',
            color_sorting : req.body.sorting ?? '',
        }
        const color = new Color(data)
        await color.save();
       res.status(201).json({ status: 1, message:  `${req.body.name} color created successfully!` });
    } catch (error) {
         res.status(500).json({ status: 0, message: error });
    }
}

const colorList = async(req:Request, res:Response) => {
    try {
        const colors: any = []
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 100;
        const skip = (page - 1) * limit;
        const colorData = await Color.find({}).skip(skip).limit(limit).where({status:1}).sort({color_sorting : 1});

        if (!colorData) {
            return res.status(400).json({ status: 0, message: 'Data not available' });
        }

        colorData.forEach((color) => {
            colors.push({
                _id: color._id,
                name: color.color_name,
                slug: color.color_slug,
                color_code : color.color_code,
                sorting:color.color_sorting,
                status: color.status,
                createdAt: color.createdAt,
                updatedAt: color.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: colors })
    } catch (error) {
        
    }
}

const editColor = async(req:Request, res:Response) => {
    try {
        const _id = req.query.id
        const colors = await Color.findById({_id})
           if (!colors) {
            return res.status(404).json({ status: 0, message: 'Data not available.' });
        }
          const data = {
            id: colors!._id,
            name: colors!.color_name,
            slug: colors!.color_slug,
            color_code : colors!.color_code,
            sorting:colors!.color_sorting,
            status: colors!.status, 
            createdAt: colors!.createdAt,
            updatedAt: colors!.updatedAt
        } 
        res.status(200).json({ status: 1, data: data });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

const updateColor = async(req:Request, res:Response) => {
    try {
        const _id = req.params.id
         const colors = await Color.findById({_id})
         colors!.color_name = req.body.name ? req.body.name : colors!.color_name
         colors!.color_slug = req.body.name ? await createSlug(req.body.name) : colors!.color_slug 
         colors!.color_code = req.body.color_code ? req.body.color_code : colors!.color_code
         colors!.color_sorting = req.body.sorting ? req.body.sorting : colors!.color_sorting
         await colors!.save()
         const data = {
            id: colors!._id,
            name: colors!.color_name,
            slug: colors!.color_slug,
            color_code : colors!.color_code,
            sorting:colors!.color_sorting,
            status: colors!.status, 
            createdAt: colors!.createdAt,
            updatedAt: colors!.updatedAt
        }
          res.status(200).json({ status: 1, message: `${req.body.name} color updated successfully!`, data: data });
    } catch (error) { 
        
    }
}

const deleteColor = async(req:Request, res:Response) => {
   try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const color = await Color.findById({ _id })

        if (!color) {
            res.status(404).json({ status: 0, message: 'Color not found!' });
        }
        await Color.deleteOne({ _id })

        res.status(200).json({ status: 1, message: `  ${color!.color_name} color deleted successfully` })

    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export {createColor, colorList, editColor, updateColor, deleteColor}