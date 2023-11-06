import { Request, Response, NextFunction } from "express";
import NewsMedia from "../models/news-media";
import { createSlug } from "../../../helpers/common_helper";
import path from "path"
import fs from "fs"

const NewsMediaImagePath = path.join(process.cwd(), '/public/news-media/');
const DIR = 'public/news-media/';

const createNewsMedia = async (req: Request, res: Response) => {
    try {
        const data = {
            title: req.body.title,
            slug: await createSlug(req.body.title),
            short_description: req.body.short_description,
            description: req.body.description,
            posted_date: req.body.posted_date,
            news_url: req.body.news_url,
            page_title: req.body.page_title,
            meta_keywords: req.body.meta_keywords,
            meta_description: req.body.meta_description,
            meta_other: req.body.meta_other
        }

        const saveData = new NewsMedia(data)
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            saveData.image = uploadFile;
        }
        await saveData.save()
        res.status(200).json({ status: 1, message: `News created successfully`, data: saveData });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}
const viewNewsMedia = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const newsMedia = await NewsMedia.findById({ _id })
        if (!newsMedia) {
            res.status(400).json({ status: 0, message: 'Data not available' })
        }
        newsMedia!.image = DIR + newsMedia!.image ?? ''
        res.status(200).json({ status: 1, data: newsMedia })
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateNewsMedia = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id
        if (!_id) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const newsMedia = await NewsMedia.findById({ _id })
        if (!newsMedia) {
            res.status(400).json({ status: 0, message: 'Data not Avaiable' })
        }
        newsMedia!.title = req.body.title ? req.body.title : newsMedia!.title
        newsMedia!.slug = req.body.title ? await createSlug(req.body.title) : newsMedia!.slug
        newsMedia!.short_description = req.body.short_description ? req.body.short_description : newsMedia!.short_description
        newsMedia!.description = req.body.description ? req.body.description : newsMedia!.description
        newsMedia!.posted_date = req.body.posted_date ? req.body.posted_date : newsMedia!.posted_date
        newsMedia!.news_url = req.body.news_url ? req.body.news_url : newsMedia!.news_url
        newsMedia!.page_title = req.body.page_title ? req.body.page_title : newsMedia!.page_title
        newsMedia!.meta_keywords = req.body.meta_keywords ? req.body.meta_keywords : newsMedia!.meta_keywords
        newsMedia!.meta_description = req.body.meta_description ? req.body.meta_description : newsMedia!.meta_description
        newsMedia!.meta_other = req.body.meta_other ? req.body.meta_other : newsMedia!.meta_other

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : newsMedia!.image;
            if (newsMedia!.image) {
                fs.unlinkSync(NewsMediaImagePath + newsMedia!.image);
            }
            newsMedia!.image = uploadFile;
        }
        await newsMedia!.save()
        const data = {
            _id: newsMedia!._id,
            title: newsMedia!.title,
            slug: newsMedia!.slug,
            short_description: newsMedia!.short_description,
            description: newsMedia!.description,
            posted_date: newsMedia!.posted_date,
            news_url: newsMedia!.news_url,
            image: newsMedia!.image ? DIR + newsMedia!.image : '',
            status: newsMedia!.status,
            page_title: newsMedia!.page_title,
            meta_keywords: newsMedia!.meta_keywords,
            meta_description: newsMedia!.meta_description,
            meta_other: newsMedia!.meta_other,
            createdAt: newsMedia!.createdAt,
            updatedAt: newsMedia!.updatedAt
        }
        res.status(200).json({ status: 1, message: `${newsMedia!.title} updated successfully!`, data: data });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const allNewsMedia = async (req: Request, res: Response) => {
    try {
        const newsMedias: any = [];
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const allNewsMedia = await NewsMedia.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        if (!allNewsMedia) {
            return res.status(400).json({ status: 0, message: 'No data found!' });
        }
        allNewsMedia.forEach((news) => {
            newsMedias.push({
                _id: news._id,
                title: news.title,
                slug: news.slug,
                short_description: news.short_description,
                description: news.description,
                posted_date: news.posted_date,
                news_url: news.news_url,
                image: news.image ? DIR + news.image : '',
                status: news.status,
                page_title: news.page_title,
                meta_keywords: news.meta_keywords,
                meta_description: news.meta_description,
                meta_other: news.meta_other,
                createdAt: news.createdAt,
                updatedAt: news.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: newsMedias, countNewsMedia: newsMedias.length });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createNewsMedia, viewNewsMedia, allNewsMedia, updateNewsMedia }