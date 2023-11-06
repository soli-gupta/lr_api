import { Request, Response } from "express";
import Color from "../../admin/models/color";

const allColorList = async(req:Request, res:Response) => {
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

export {allColorList}