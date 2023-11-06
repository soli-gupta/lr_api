import { Request, Response } from "express";
import path from "path";
import CmsPage from "../models/cms-page";
import fs from 'fs';

const cmsPageImagePath = path.join(process.cwd(), '/public/cms-page/');
const DIR = 'public/cms-page/';
interface MulterRequest extends Request {
    file: any;
    files: any
}

const createCmsPage = async (req: Request, res: Response) => {

    try {
        const body: any = req.body;
        const cmsPageData = {
            page_name: body.name ?? '',
            page_slug: body.slug ?? '',
            sub_text: body.sub_text ?? '',
            content_one: body.content_one ?? '',
            content_two: body.content_two ?? '',
            content_three: body.content_three ?? '',
            content_four: body.content_four ?? '',
            banner_image_alt: body.banner_image_alt ?? '',
            cms_page_title: body.page_title,
            page_meta_keyword: body.meta_keywords ?? '',
            page_meta_description: body.meta_description ?? '',
            page_meta_other: body.meta_other ?? '',
            page_newly_launched: body.newly_launched ?? '',
            page_short_description: body.short_description ?? '',
            page_sorting: body.page_sorting ?? ''
        }


        const checkCmsPageSlug = await CmsPage.findOne({ page_slug: cmsPageData.page_slug });

        if (checkCmsPageSlug) {
            return res.status(400).json({ status: 2, message: `${cmsPageData.page_slug} slug already added. Please change slug.` });
        }

        const addCmsPage = new CmsPage(cmsPageData);

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {

            if (files.banner && files.banner[0].fieldname === 'banner') {
                const uploadFile = files.banner[0].filename ? files.banner[0].filename : '';

                addCmsPage.page_banner = uploadFile;
            }
            if (files.why_choose_luxury && files.why_choose_luxury[0].fieldname === 'why_choose_luxury') {
                const whyChooseLuxury = files.why_choose_luxury[0].filename ? files.why_choose_luxury[0].filename : '';

                addCmsPage.why_choose_luxury = whyChooseLuxury;
            }

            if (files.selling_your_car && files.selling_your_car[0].fieldname === 'selling_your_car') {
                const sellingYourCar = files.selling_your_car[0].filename ? files.selling_your_car[0].filename : '';

                addCmsPage.selling_your_car = sellingYourCar;
            }

            if (files.logo && files.logo[0].fieldname === 'logo') {
                const uploadLogo = files.logo[0].filename ? files.logo[0].filename : '';
                addCmsPage.page_logo = uploadLogo;
            }

            if (files.our_service_centers && files.our_service_centers[0].fieldname === 'our_service_centers') {
                const uploadOurServiceCenters = files.our_service_centers[0].filename ? files.our_service_centers[0].filename : '';
                addCmsPage.our_service_centers = uploadOurServiceCenters;
            }

            if (files.mobile_banner && files.mobile_banner[0].fieldname === 'mobile_banner') {
                const uploadMobileBanner = files.mobile_banner[0].filename ? files.mobile_banner[0].filename : '';
                addCmsPage.mobile_banner = uploadMobileBanner;
            }

            if (files.sell_book_car_inspaction && files.sell_book_car_inspaction[0].fieldname === 'sell_book_car_inspaction') {
                const uploadSellBookCar = files.sell_book_car_inspaction[0].filename ? files.sell_book_car_inspaction[0].filename : '';
                addCmsPage.sell_book_car_inspaction = uploadSellBookCar;
            }

            if (files.sell_selling_your_car && files.sell_selling_your_car[0].fieldname === 'sell_selling_your_car') {
                const sellSellingYourCar = files.sell_selling_your_car[0].filename ? files.sell_selling_your_car[0].filename : '';
                addCmsPage.sell_selling_your_car = sellSellingYourCar;
            }

            if (files.benefits_like && files.benefits_like[0].fieldname === 'benefits_like') {
                const benefitsLike = files.benefits_like[0].filename ? files.benefits_like[0].filename : '';
                addCmsPage.benefits_like = benefitsLike;
            }

            if (files.ew_on_the_safe_side && files.ew_on_the_safe_side[0].fieldname === 'ew_on_the_safe_side') {
                const uploadEWOneTheSafe = files.ew_on_the_safe_side[0].filename ? files.ew_on_the_safe_side[0].filename : '';
                addCmsPage.on_the_safe_side = uploadEWOneTheSafe;
            }

            if (files.bb_assurance && files.bb_assurance[0].fieldname === 'bb_assurance') {
                const uploadBBAssurance = files.bb_assurance[0].filename ? files.bb_assurance[0].filename : '';
                addCmsPage.bb_assurance = uploadBBAssurance;
            }
            if (files.why_choose_luxury_mobile && files.why_choose_luxury_mobile[0].fieldname === 'why_choose_luxury_mobile') {
                const whyChooseLuxuryMobile = files.why_choose_luxury_mobile[0].filename ? files.why_choose_luxury_mobile[0].filename : '';

                addCmsPage.why_choose_luxury_mobile = whyChooseLuxuryMobile;
            }

            if (files.selling_your_car_mobile && files.selling_your_car_mobile[0].fieldname === 'selling_your_car_mobile') {
                const sellingYourCarMobile = files.selling_your_car_mobile[0].filename ? files.selling_your_car_mobile[0].filename : '';

                addCmsPage.selling_your_car_mobile = sellingYourCarMobile;
            }

            if (files.our_service_centers_mobile && files.our_service_centers_mobile[0].fieldname === 'our_service_centers_mobile') {
                const ourServiceCenterMobile = files.our_service_centers_mobile[0].filename ? files.our_service_centers_mobile[0].filename : '';

                addCmsPage.our_service_centers_mobile = ourServiceCenterMobile;
            }

        }

        // if (req.file !== undefined) {
        //     const uploadFile = req.file.filename ?? '';
        //     addCmsPage.page_banner = uploadFile;
        // }
        await addCmsPage.save();

        const shareCmsPage = {
            _id: addCmsPage._id,
            name: addCmsPage.page_name,
            slug: addCmsPage.page_slug,
            sub_text: addCmsPage.sub_text,
            content_one: addCmsPage.content_one,
            content_two: addCmsPage.content_two,
            content_three: addCmsPage.content_three,
            content_four: addCmsPage.content_four,
            page_banner: addCmsPage.page_banner ? DIR + addCmsPage.page_banner : '',
            why_choose_luxury: addCmsPage.why_choose_luxury ? DIR + addCmsPage.why_choose_luxury : '',
            selling_your_car: addCmsPage.selling_your_car ? DIR + addCmsPage.selling_your_car : '',
            banner_image_alt: addCmsPage.banner_image_alt,
            status: addCmsPage.page_status,
            page_title: addCmsPage.cms_page_title,
            meta_keywords: addCmsPage.page_meta_keyword,
            meta_description: addCmsPage.page_meta_description,
            meta_other: addCmsPage.page_meta_other,
            newly_launched: addCmsPage.page_newly_launched ? addCmsPage.page_newly_launched : 2,
            our_service_centers: addCmsPage.our_service_centers ? DIR + addCmsPage.our_service_centers : '',
            mobile_banner: addCmsPage.mobile_banner ? DIR + addCmsPage.mobile_banner : '',
            short_description: addCmsPage.page_short_description ? addCmsPage.page_short_description : '',
            why_choose_luxury_mobile: addCmsPage.why_choose_luxury_mobile ? DIR + addCmsPage.why_choose_luxury_mobile : '',
            selling_your_car_mobile: addCmsPage.selling_your_car_mobile ? DIR + addCmsPage.selling_your_car_mobile : '',
            our_service_centers_mobile: addCmsPage.our_service_centers_mobile ? DIR + addCmsPage.our_service_centers_mobile : '',

        }
        res.status(201).json({ status: 1, message: `${addCmsPage.page_name} created successfully!`, cms_page: shareCmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const manageAllCmsPages = async (req: Request, res: Response) => {
    try {
        const cmsPage: any = [];
        const page: any = req.query.page && req.query.page !== undefined ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const allCmsPage = await CmsPage.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        if (!allCmsPage) {
            return res.status(400).json({ status: 0, message: 'No data found!' });
        }
        allCmsPage.forEach((cms) => {
            cmsPage.push({
                _id: cms._id,
                name: cms.page_name,
                slug: cms.page_slug,
                sub_text: cms.sub_text,
                content_one: cms.content_one,
                content_two: cms.content_two,
                content_three: cms.content_three,
                content_four: cms.content_four,
                page_banner: cms.page_banner ? DIR + cms.page_banner : '',
                why_choose_luxury: cms.why_choose_luxury ? DIR + cms.why_choose_luxury : '',
                selling_your_car: cms.selling_your_car ? DIR + cms.selling_your_car : '',
                banner_image_alt: cms.banner_image_alt,
                status: cms.page_status,
                page_title: cms.cms_page_title,
                meta_keywords: cms.page_meta_keyword,
                meta_description: cms.page_meta_description,
                meta_other: cms.page_meta_other,
                createdAt: cms.createdAt,
                updatedAt: cms.updatedAt,
                newly_launched: cms.page_newly_launched ? cms.page_newly_launched : 2,
                our_service_centers: cms.our_service_centers ? DIR + cms.our_service_centers : '',
                mobile_banner: cms.mobile_banner ? DIR + cms.mobile_banner : '',
                page_logo: cms.page_logo ? DIR + cms.page_logo : '',
                short_description: cms.page_short_description ? cms.page_short_description : '',
                why_choose_luxury_mobile: cms.why_choose_luxury_mobile ? DIR + cms.why_choose_luxury_mobile : '',
                selling_your_car_mobile: cms.selling_your_car_mobile ? DIR + cms.selling_your_car_mobile : '',
                our_service_centers_mobile: cms.our_service_centers_mobile ? DIR + cms.our_service_centers_mobile : '',
            })
        });
        res.status(200).json({ status: 1, cms_page: cmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const viewCmsPage = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const getCmsPage = await CmsPage.findById({ _id });
        if (!getCmsPage) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }
        const shareCmsPage = {
            _id: getCmsPage._id,
            name: getCmsPage.page_name,
            slug: getCmsPage.page_slug,
            sub_text: getCmsPage.sub_text,
            content_one: getCmsPage.content_one,
            content_two: getCmsPage.content_two,
            content_three: getCmsPage.content_three,
            content_four: getCmsPage.content_four,
            page_banner: getCmsPage.page_banner ? DIR + getCmsPage.page_banner : '',
            why_choose_luxury: getCmsPage.why_choose_luxury ? DIR + getCmsPage.why_choose_luxury : '',
            selling_your_car: getCmsPage.selling_your_car ? DIR + getCmsPage.selling_your_car : '',
            banner_image_alt: getCmsPage.banner_image_alt,
            status: getCmsPage.page_status,
            page_title: getCmsPage.cms_page_title,
            meta_keywords: getCmsPage.page_meta_keyword,
            meta_description: getCmsPage.page_meta_description,
            meta_other: getCmsPage.page_meta_other,
            newly_launched: getCmsPage.page_newly_launched ? getCmsPage.page_newly_launched : 2,
            our_service_centers: getCmsPage.our_service_centers ? DIR + getCmsPage.our_service_centers : '',
            mobile_banner: getCmsPage.mobile_banner ? DIR + getCmsPage.mobile_banner : '',
            short_description: getCmsPage.page_short_description ? getCmsPage.page_short_description : '',
            page_sorting: getCmsPage.page_sorting ?? '',
            why_choose_luxury_mobile: getCmsPage.why_choose_luxury_mobile ? DIR + getCmsPage.why_choose_luxury_mobile : '',
            selling_your_car_mobile: getCmsPage.selling_your_car_mobile ? DIR + getCmsPage.selling_your_car_mobile : '',
            our_service_centers_mobile: getCmsPage.our_service_centers_mobile ? DIR + getCmsPage.our_service_centers_mobile : '',
        }

        res.status(200).json({ status: 1, cms_page: shareCmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}
// const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
// cb(null, file.fieldname + '-' + getFileName);

// console.log(file.originalname.toLowerCase().replace(/ /g, '-'));

const updateCmsPage = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!!' });
        }
        const cmsPage = await CmsPage.findById({ _id });
        if (!cmsPage) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }


        cmsPage.page_name = req.body.name ? req.body.name : cmsPage.page_name;
        cmsPage.page_slug = req.body.slug ? req.body.slug : cmsPage.page_slug;
        cmsPage.sub_text = req.body.sub_text ? req.body.sub_text : cmsPage.sub_text;
        cmsPage.content_one = req.body.content_one ? req.body.content_one : cmsPage.content_one;
        cmsPage.content_two = req.body.content_two ? req.body.content_two : cmsPage.content_two;
        cmsPage.content_three = req.body.content_three ? req.body.content_three : cmsPage.content_three;
        cmsPage.content_four = req.body.content_four ? req.body.content_four : cmsPage.content_four;
        cmsPage.banner_image_alt = req.body.banner_image_alt ? req.body.banner_image_alt : cmsPage.banner_image_alt;
        cmsPage.cms_page_title = req.body.page_title ? req.body.page_title : cmsPage.cms_page_title;
        cmsPage.page_meta_keyword = req.body.meta_keywords ? req.body.meta_keywords : cmsPage.page_meta_keyword;
        cmsPage.page_meta_description = req.body.meta_description ? req.body.meta_description : cmsPage.page_meta_description;
        cmsPage.page_meta_other = req.body.meta_other ? req.body.meta_other : cmsPage.page_meta_other;

        cmsPage.page_newly_launched = req.body.newly_launched ? req.body.newly_launched : cmsPage.page_newly_launched;
        cmsPage.page_short_description = req.body.short_description ? req.body.short_description : cmsPage.page_short_description;
        cmsPage.page_sorting = req.body.page_sorting ? req.body.page_sorting : cmsPage.page_sorting;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files !== undefined) {

            if (files.banner && files.banner[0].fieldname === 'banner') {
                const uploadFile = files.banner[0].filename ? files.banner[0].filename : cmsPage.page_banner;
                if (cmsPage.page_banner) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.page_banner);
                }
                cmsPage.page_banner = uploadFile;
            }
            if (files.why_choose_luxury && files.why_choose_luxury[0].fieldname === 'why_choose_luxury') {
                const whyChooseLuxury = files.why_choose_luxury[0].filename ? files.why_choose_luxury[0].filename : cmsPage.page_banner;
                if (cmsPage.why_choose_luxury) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.why_choose_luxury);
                }
                cmsPage.why_choose_luxury = whyChooseLuxury;
            }

            if (files.selling_your_car && files.selling_your_car[0].fieldname === 'selling_your_car') {
                const sellingYourCar = files.selling_your_car[0].filename ? files.selling_your_car[0].filename : cmsPage.selling_your_car;
                if (cmsPage.selling_your_car) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.selling_your_car);
                }
                cmsPage.selling_your_car = sellingYourCar;
            }

            if (files.logo && files.logo[0].fieldname === 'logo') {
                const uploadLogo = files.logo[0].filename ? files.logo[0].filename : cmsPage.page_logo;
                if (cmsPage.page_logo) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.page_logo);
                }
                cmsPage.page_logo = uploadLogo;
            }


            if (files.our_service_centers && files.our_service_centers[0].fieldname === 'our_service_centers') {
                const uploadOurServiceCenters = files.our_service_centers[0].filename ? files.our_service_centers[0].filename : '';
                if (cmsPage.our_service_centers) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.our_service_centers);
                }
                cmsPage.our_service_centers = uploadOurServiceCenters;
            }

            if (files.mobile_banner && files.mobile_banner[0].fieldname === 'mobile_banner') {
                const uploadMobileBanner = files.mobile_banner[0].filename ? files.mobile_banner[0].filename : '';
                if (cmsPage.mobile_banner) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.mobile_banner);
                }
                cmsPage.mobile_banner = uploadMobileBanner;
            }

            if (files.sell_book_car_inspaction && files.sell_book_car_inspaction[0].fieldname === 'sell_book_car_inspaction') {
                const uploadSellBookCar = files.sell_book_car_inspaction[0].filename ? files.sell_book_car_inspaction[0].filename : '';

                if (cmsPage.sell_book_car_inspaction) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.sell_book_car_inspaction);
                }
                cmsPage.sell_book_car_inspaction = uploadSellBookCar;
            }

            if (files.sell_selling_your_car && files.sell_selling_your_car[0].fieldname === 'sell_selling_your_car') {
                const uploadSellSellingCar = files.sell_selling_your_car[0].filename ? files.sell_selling_your_car[0].filename : '';
                if (cmsPage.sell_selling_your_car) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.sell_selling_your_car);
                }
                cmsPage.sell_selling_your_car = uploadSellSellingCar;
            }

            if (files.benefits_like && files.benefits_like[0].fieldname === 'benefits_like') {
                const uploadBenefitsLike = files.benefits_like[0].filename ? files.benefits_like[0].filename : '';
                if (cmsPage.benefits_like) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.benefits_like);
                }
                cmsPage.benefits_like = uploadBenefitsLike;
            }

            if (files.ew_on_the_safe_side && files.ew_on_the_safe_side[0].fieldname === 'ew_on_the_safe_side') {
                const uploadEWOneTheSafe = files.ew_on_the_safe_side[0].filename ? files.ew_on_the_safe_side[0].filename : '';
                if (cmsPage.on_the_safe_side) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.on_the_safe_side);
                }
                cmsPage.on_the_safe_side = uploadEWOneTheSafe;
            }

            if (files.bb_assurance && files.bb_assurance[0].fieldname === 'bb_assurance') {
                const uploadBBAssurance = files.bb_assurance[0].filename ? files.bb_assurance[0].filename : '';
                if (cmsPage.bb_assurance) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.bb_assurance);
                }
                cmsPage.bb_assurance = uploadBBAssurance;
            }


            if (files.why_choose_luxury_mobile && files.why_choose_luxury_mobile[0].fieldname === 'why_choose_luxury_mobile') {
                const UploadWhyChooseMobile = files.why_choose_luxury_mobile[0].filename ? files.why_choose_luxury_mobile[0].filename : '';
                if (cmsPage.why_choose_luxury_mobile) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.why_choose_luxury_mobile);
                }
                cmsPage.why_choose_luxury_mobile = UploadWhyChooseMobile;
            }

            if (files.selling_your_car_mobile && files.selling_your_car_mobile[0].fieldname === 'selling_your_car_mobile') {
                const UploadSellingYourCarMobile = files.selling_your_car_mobile[0].filename ? files.selling_your_car_mobile[0].filename : '';
                if (cmsPage.selling_your_car_mobile) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.selling_your_car_mobile);
                }
                cmsPage.selling_your_car_mobile = UploadSellingYourCarMobile;
            }

            if (files.our_service_centers_mobile && files.our_service_centers_mobile[0].fieldname === 'our_service_centers_mobile') {
                const UploadOurServiceCenterMobile = files.our_service_centers_mobile[0].filename ? files.our_service_centers_mobile[0].filename : '';
                if (cmsPage.our_service_centers_mobile) {
                    fs.unlinkSync(cmsPageImagePath + cmsPage.our_service_centers_mobile);
                }
                cmsPage.our_service_centers_mobile = UploadOurServiceCenterMobile;
            }


        }



        // const { selling_your_car: CMsImg } = req.files
        // if ((req as MulterRequest).files === 'selling_your_car') {
        //     console.log('troe');
        // }
        // console.log(selling_your_car);
        // console.log(why_choose);
        // if (req.files !== undefined) {
        //     // (req as MulterRequest).files.selling_your_car === 
        // }
        // console.log('Test: ', req.files?.toString());
        // req.files
        // if (req.file !== undefined) {
        //     // if (req.files!.selling_your_car:string !== undefined) {

        //     // }
        //     // req.files?.filter((fileName: string) => {

        //     // })

        //     // if (req.files?.selling_your_car === String('selling_your_car')) {

        //     // }

        //     const uploadFile = req.file.filename ? req.file.filename : cmsPage.page_banner;
        //     if (cmsPage.page_banner) {
        //         fs.unlinkSync(cmsPageImagePath + cmsPage.page_banner);
        //     }
        //     cmsPage.page_banner = uploadFile;
        // }
        await cmsPage.save();

        // console.log(cmsPage.our_service_centers);

        const shareCmsPage = {
            _id: cmsPage._id,
            name: cmsPage.page_name,
            slug: cmsPage.page_slug,
            sub_text: cmsPage.sub_text,
            content_one: cmsPage.content_one,
            content_two: cmsPage.content_two,
            content_three: cmsPage.content_three,
            content_four: cmsPage.content_four,
            page_banner: cmsPage.page_banner ? DIR + cmsPage.page_banner : '',
            why_choose_luxury: cmsPage.why_choose_luxury ? DIR + cmsPage.why_choose_luxury : '',
            selling_your_car: cmsPage.selling_your_car ? DIR + cmsPage.selling_your_car : '',
            banner_image_alt: cmsPage.banner_image_alt,
            status: cmsPage.page_status,
            page_title: cmsPage.cms_page_title,
            meta_keywords: cmsPage.page_meta_keyword,
            meta_description: cmsPage.page_meta_description,
            meta_other: cmsPage.page_meta_other,
            newly_launched: cmsPage.page_newly_launched ? cmsPage.page_newly_launched : 2,
            our_service_centers: cmsPage.our_service_centers ? DIR + cmsPage.our_service_centers : '',
            mobile_banner: cmsPage.mobile_banner ? DIR + cmsPage.mobile_banner : '',
            short_description: cmsPage.page_short_description ? cmsPage.page_short_description : '',
            why_choose_luxury_mobile: cmsPage.why_choose_luxury_mobile ? DIR + cmsPage.why_choose_luxury_mobile : '',
            selling_your_car_mobile: cmsPage.selling_your_car_mobile ? DIR + cmsPage.selling_your_car_mobile : '',
            our_service_centers_mobile: cmsPage.our_service_centers_mobile ? DIR + cmsPage.our_service_centers_mobile : '',
        }
        res.status(200).json({ status: 1, message: `${cmsPage.page_name} updated successfully!`, cms_page: shareCmsPage });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnblockCmsPage = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something wen wrong. Please refresh the page and try again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const cmsPage = await CmsPage.findById({ _id });
        if (!cmsPage) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        cmsPage.page_status = status;
        await cmsPage.save();

        const shareCmsPage = {
            _id: cmsPage._id,
            name: cmsPage.page_name,
            slug: cmsPage.page_slug,
            sub_text: cmsPage.sub_text,
            content_one: cmsPage.content_one,
            content_two: cmsPage.content_two,
            content_three: cmsPage.content_three,
            content_four: cmsPage.content_four,
            page_banner: cmsPage.page_banner ? DIR + cmsPage.page_banner : '',
            why_choose_luxury: cmsPage.why_choose_luxury ? DIR + cmsPage.why_choose_luxury : '',
            selling_your_car: cmsPage.selling_your_car ? DIR + cmsPage.selling_your_car : '',
            banner_image_alt: cmsPage.banner_image_alt,
            status: cmsPage.page_status,
            page_title: cmsPage.cms_page_title,
            meta_keywords: cmsPage.page_meta_keyword,
            meta_description: cmsPage.page_meta_description,
            meta_other: cmsPage.page_meta_other,
            newly_launched: cmsPage.page_newly_launched ? cmsPage.page_newly_launched : 2,
            our_service_centers: cmsPage.our_service_centers ? DIR + cmsPage.our_service_centers : '',
            mobile_banner: cmsPage.mobile_banner ? DIR + cmsPage.mobile_banner : '',
            short_description: cmsPage.page_short_description ? cmsPage.page_short_description : '',
            why_choose_luxury_mobile: cmsPage.why_choose_luxury_mobile ? DIR + cmsPage.why_choose_luxury_mobile : '',
            selling_your_car_mobile: cmsPage.selling_your_car_mobile ? DIR + cmsPage.selling_your_car_mobile : '',
            our_service_centers_mobile: cmsPage.our_service_centers_mobile ? DIR + cmsPage.our_service_centers_mobile : '',
        }

        res.status(200).json({ status: 1, message: `${cmsPage.page_name} updated successfully!`, cms_page: shareCmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}




export { createCmsPage, manageAllCmsPages, viewCmsPage, updateCmsPage, blockUnblockCmsPage }