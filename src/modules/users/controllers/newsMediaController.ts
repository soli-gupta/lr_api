import { Request, Response } from "express";
import NewsMedia from "../../admin/models/news-media";

const DIR = 'public/news-media/';

const allNewsMedia = async (req: Request, res: Response) => {
    try {
        const newsMedias: any = [];
        // const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        // const limit = 10;
        // const skip = (page - 1) * limit;
        // const allNewsMedia = await NewsMedia.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const allNewsMedia = await NewsMedia.find({}).sort({ createdAt: -1 }).where({ status: 1 });
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
                image: news.image ? DIR + news.image : '',
                news_url: news.news_url ? news.news_url : '',
                status: news.status,
                page_title: news.page_title,
                meta_keywords: news.meta_keywords,
                meta_description: news.meta_description,
                meta_other: news.meta_other,
                createdAt: news.createdAt,
                updatedAt: news.updatedAt
            })
        });
        res.status(200).json({ status: 1, data: newsMedias });
    } catch (error) {
        res.status(200).json({ status: 0, message: 'Something went wrong.' });
    }
}

const newsDetailBySlug = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug
        if (!slug) {
            res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' })
        }
        const newsDetail = await NewsMedia.findOne({ slug: slug }).where({ status: 1 })
        res.status(200).json({ status: 1, data: newsDetail });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

export { allNewsMedia, newsDetailBySlug }