import {
    Request, Response
    , NextFunction
} from "express";
import Brands from "../../brand/model/brand";
import fs from 'fs';
import path from "path";
import { parseExcelFile } from "../../../helpers/admin/Helper";
import XLBrands from "../../brand/model/xl-brand";
import { createSlug } from "../../../helpers/common_helper";
import XLBrandModel from "../../brand/model/xl-brand-models";
import XLModelVariant from "../../brand/model/xl-model-varaint";

const brandImagePath = path.join(process.cwd(), '/public/brands/');
const DIR = 'public/brands/';

const createBrand = async (req: Request, res: Response) => {
    try {
        const brandData = {
            brand_name: req.body.name ?? '',
            brand_slug: req.body.slug ?? '',
            logo_sorting: req.body.sort,
            page_title: req.body.page_title,
            h1_tag: req.body.h1_tag,
            meta_description: req.body.meta_description,
        }

        const checkBrandSlug = await Brands.findOne({ brand_slug: brandData.brand_slug });

        if (checkBrandSlug) {
            return res.status(400).json({ status: 2, message: `${brandData.brand_slug} slug already added. Please change slug.` });
        }



        const brand = new Brands(brandData);
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ?? '';
            brand.brand_logo = uploadFile;
        }
        await brand.save();
        const shareBrand = {
            id: brand._id,
            name: brand.brand_name,
            slug: brand.brand_slug,
            logo: brand.brand_logo ? DIR + brand.brand_logo : '',
            status: brand.brand_status,
            sort: brand.logo_sorting ? brand.logo_sorting : '',
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
            page_title: brand.page_title,
            h1_tag: brand.h1_tag,
            meta_description: brand.meta_description,
        }

        res.status(201).json({ status: 1, message: `${brand.brand_name} brand created successfully!`, brand: shareBrand });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const manageBrandsList = async (req: Request, res: Response) => {
    try {
        const brands: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const getBrands = await Brands.find({}).skip(skip).limit(limit).sort({ 'createdAt': -1 });
        if (!getBrands) {
            return res.status(400).json({ status: 0, message: 'No brands found!' });
        }

        getBrands.forEach((brand) => {
            brands.push({
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
                logo: brand.brand_logo ? DIR + brand.brand_logo : '',
                sort: brand.logo_sorting ? brand.logo_sorting : '',
                status: brand.brand_status,
                createdAt: brand.createdAt,
                updatedAt: brand.updatedAt,
                page_title: brand.page_title,
                h1_tag: brand.h1_tag,
                meta_description: brand.meta_description,
            })
        });
        res.status(200).json({ status: 1, brands, brandCount: brands.length })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewBrand = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Please refresh the page and click again!' });
        }
        const viewBrand = await Brands.findById({ _id });
        if (!viewBrand) {
            return res.status(404).json({ status: 0, message: 'No brand found!' });
        }
        const shareBrand = {
            name: viewBrand.brand_name,
            slug: viewBrand.brand_slug,
            logo: viewBrand.brand_logo ? DIR + viewBrand.brand_logo : '',
            sort: viewBrand.logo_sorting ? viewBrand.logo_sorting : '',
            status: viewBrand.brand_status,
            createdAt: viewBrand.createdAt,
            updatedAt: viewBrand.updatedAt,
            page_title: viewBrand.page_title,
            h1_tag: viewBrand.h1_tag,
            meta_description: viewBrand.meta_description,
        }

        res.status(200).json({ status: 1, brand: shareBrand });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateBrand = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Please click again for updating brand!' });
        }
        const brand = await Brands.findById({ _id });
        if (!brand) {
            return res.status(400).json({ status: 0, message: 'Brand not updating at this time. Please refresh the page and click again!' });
        }

        brand.brand_name = req.body.name ? req.body.name : brand.brand_name;
        brand.brand_slug = req.body.slug ? req.body.slug : brand.brand_slug;
        brand.logo_sorting = req.body.sort ? req.body.sort : brand.logo_sorting;
        brand.page_title = req.body.page_title ? req.body.page_title : brand.page_title;
        brand.h1_tag = req.body.h1_tag ? req.body.h1_tag : brand.h1_tag;
        brand.meta_description = req.body.meta_description ? req.body.meta_description : brand.meta_description;
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : brand.brand_logo;
            if (brand.brand_logo) {
                fs.unlinkSync(brandImagePath + brand.brand_logo);
            }
            // console.log(brand.brand_logo);
            // console.log(uploadFile);
            brand.brand_logo = uploadFile;
        }

        await brand.save();

        const shareBrand = {
            name: brand.brand_name,
            slug: brand.brand_slug,
            logo: brand.brand_logo ? DIR + brand.brand_logo : '',
            sort: brand.logo_sorting ? brand.logo_sorting : '',
            status: brand.brand_status,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
            page_title: brand.page_title,
            h1_tag: brand.h1_tag,
            meta_description: brand.meta_description,
        }

        res.status(200).json({ status: 1, message: `${brand.brand_name} updated successfully!`, brand: shareBrand })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}

const blockUnblockBrand = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const brand = await Brands.findById({ _id });
        if (!brand) {
            return res.status(404).json({ status: 0, message: 'Brand not found!' });
        }
        brand.brand_status = status;
        await brand.save();

        const shareBrand = {
            name: brand.brand_name,
            slug: brand.brand_slug,
            logo: brand.brand_logo ? DIR + brand.brand_logo : '',
            sort: brand.logo_sorting ? brand.logo_sorting : '',
            status: brand.brand_status,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
            page_title: brand.page_title,
            h1_tag: brand.h1_tag,
            meta_description: brand.meta_description,
        }
        res.status(200).json({ status: 1, message: `${brand.brand_name} updated successfully!`, brand: shareBrand })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchBrands = async (req: Request, res: Response) => {
    try {
        const brands: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const getBrands = await Brands.find({}).sort({ 'createdAt': -1 }).where({ brand_status: 1 });
        //.skip(skip).limit(limit)
        if (!getBrands) {
            return res.status(400).json({ status: 0, message: 'No brands found!' });
        }

        getBrands.forEach((brand) => {
            brands.push({
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
            })
        });
        res.status(200).json({ status: 1, brands })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const createmakeModelVariantByExcel = async (req: Request, res: Response) => {
    // try {
    //     // body.make_model_variant_excel
    // const DIR = "public/brands/excel/"
    // const excelFilePath: any = DIR + req.file?.filename;
    // const excelData = await parseExcelFile(excelFilePath);
    //     console.log(excelFilePath);

    //     parseExcelFile(excelFilePath)
    //         .then((excelData) => {
    //             const fetchSuccData: any = [];
    //             excelData.forEach(async (data: any) => {
    //                 let brand_id: any = '';
    //                 brand_id = await XLBrands.findOne({ brand_name: data.brand });

    //                 if (!brand_id) {
    //                     const newBrand = {
    //                         brand_name: data.brand,
    //                         brand_slug: await createSlug(data.brand)
    //                     }
    //                     brand_id = new XLBrands(newBrand);
    //                     console.log('newBrand : ', newBrand);
    //                 }
    //                 await brand_id.save();
    //                 console.log(brand_id);
    //                 let model_id: any = '';

    //                 model_id = await XLBrandModel.findOne({ model_name: data.model });

    //                 if (!model_id) {
    //                     const newModel = {
    //                         brand_id: brand_id._id,
    //                         model_name: data.model,
    //                         model_slug: await createSlug(data.model)
    //                     }
    //                     model_id = new XLBrandModel(newModel);
    //                 }
    //                 model_id.brand_id = brand_id._id;
    //                 await model_id.save();

    //                 let variant: any = '';

    //                 variant = await XLModelVariant.findOne({ variant_name: data.variant });

    //                 if (!variant) {
    //                     const newVariant = {
    //                         brand_id: brand_id._id,
    //                         mode_id: model_id._id,
    //                         variant_name: data.variant,
    //                         variant_slug: await createSlug(data.variant)
    //                     }
    //                     model_id = new XLModelVariant(newVariant);
    //                 }
    //                 variant.brand_id = brand_id._id;
    //                 variant.model_id = model_id._id
    //                 await variant.save();
    //             });
    //             res.status(201).json({ status: 1, message: 'Please check all data once.' });
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });



    // } catch (e) {
    //     res.status(500).json({ status: 0, message: e });
    // }

    // for (const data of excelData) {
    //     let brand_id = await XLBrands.findOne({ brand_name: data.brand });

    //     if (!brand_id) {
    //         const newBrand = {
    //             brand_name: data.brand,
    //             brand_slug: await createSlug(data.brand)
    //         }
    //         brand_id = new XLBrands(newBrand);
    //         await brand_id.save();
    //     }

    //     let model_id = await XLBrandModel.findOne({ model_name: data.model });

    //     if (!model_id) {
    //         const newModel = {
    //             brand_id: brand_id._id,
    //             model_name: data.model,
    //             model_slug: await createSlug(data.model)
    //         }
    //         model_id = new XLBrandModel(newModel);
    //     }
    //     model_id.brand_id = brand_id._id;
    //     await model_id.save();

    //     let variant = await XLModelVariant.findOne({ variant_name: data.variant });
    //     console.log('data.variant : ', data.variant);
    //     if (!variant) {
    //         const newVariant = {
    //             brand_id: brand_id._id,
    //             model_id: model_id._id,
    //             variant_name: data.variant,
    //             variant_slug: await createSlug(data.variant)
    //         }
    //         variant = new XLModelVariant(newVariant);
    //     }
    //     variant.brand_id = brand_id._id;
    //     variant.model_id = model_id._id;
    //     await variant.save();
    // }

    // try {
    //     const DIR = "public/brands/excel/"
    //     const excelFilePath = DIR + req.file?.filename;

    //     const excelData = await parseExcelFile(excelFilePath);

    //     for (const data of excelData) {
    //         let brand_id = await XLBrands.findOne({ brand_name: data.brand });

    //         if (!brand_id) {
    //             const newBrand = {
    //                 brand_name: data.brand,
    //                 brand_slug: await createSlug(data.brand)
    //             }
    //             brand_id = new XLBrands(newBrand);
    //             await brand_id.save();
    //         }

    //         let model_id = await XLBrandModel.findOne({ model_name: data.model });

    //         if (!model_id) {
    //             const newModel = {
    //                 brand_id: brand_id._id,
    //                 model_name: data.model,
    //                 model_slug: await createSlug(data.model)
    //             }
    //             model_id = new XLBrandModel(newModel);
    //             await model_id.save();
    //         }

    //         let variant = await XLModelVariant.findOne({ variant_name: data.variant });

    //         if (!variant) {
    //             const newVariant = {
    //                 brand_id: brand_id._id,
    //                 model_id: model_id._id,
    //                 variant_name: data.variant,
    //                 variant_slug: await createSlug(data.variant)
    //             }
    //             variant = new XLModelVariant(newVariant);
    //             await variant.save();
    //         }
    //         variant.brand_id = brand_id._id;
    //         variant.model_id = model_id._id;
    //         await variant.save();
    //     }

    //     res.status(201).json({ status: 1, message: 'Please check all data once.' });

    // } catch (error) {
    //     res.status(500).json({ status: 0, message: error });
    // }

    // try {
    //     const DIR = "public/brands/excel/";
    //     const excelFilePath = DIR + req.file?.filename;

    //     const excelData = await parseExcelFile(excelFilePath);

    //     const createdBrands = new Map(); // Store created brand documents
    //     const createdModels = new Map(); // Store created model documents

    //     await Promise.all(excelData.map(async (data: any) => {
    //         let brand = createdBrands.get(data.brand);
    //         if (!brand) {
    //             brand = await XLBrands.findOne({ brand_name: data.brand });
    //             if (!brand) {
    //                 const newBrand = {
    //                     brand_name: data.brand,
    //                     brand_slug: await createSlug(data.brand)
    //                 };
    //                 brand = new XLBrands(newBrand);
    //                 await brand.save();
    //             }
    //             createdBrands.set(data.brand, brand);
    //         }

    //         let model = createdModels.get(data.model);
    //         if (!model) {
    //             model = await XLBrandModel.findOne({ model_name: data.model });
    //             if (!model) {
    //                 const newModel = {
    //                     brand_id: brand._id,
    //                     model_name: data.model,
    //                     model_slug: await createSlug(data.model)
    //                 };
    //                 model = new XLBrandModel(newModel);
    //                 await model.save();
    //             }
    //             createdModels.set(data.model, model);
    //         }

    //         let variant = await XLModelVariant.findOne({ variant_name: data.variant });
    //         if (!variant) {
    //             const newVariant = {
    //                 brand_id: brand._id,
    //                 model_id: model._id,
    //                 variant_name: data.variant,
    //                 variant_slug: await createSlug(data.variant)
    //             };
    //             variant = new XLModelVariant(newVariant);
    //             await variant.save();
    //         }
    //         variant.brand_id = brand._id;
    //         variant.model_id = model._id;
    //         await variant.save();
    //     }));

    //     res.status(201).json({ status: 1, message: 'Please check all data once.' });

    // } catch (error) {
    //     res.status(500).json({ status: 0, message: 'Something went wrong.' });
    // }

    try {
        const DIR = "public/brands/excel/";
        const excelFilePath = DIR + req.file?.filename;

        const excelData = await parseExcelFile(excelFilePath);
        // console.log('Excel Data:', excelData); // Add this logging

        for (const data of excelData) {
            // console.log('Processing:', data); // Add this logging

            if (data.year) {

                if (data.brand) {

                    let brand_id = await Brands.findOne({ brand_name: data.brand });

                    if (!brand_id) {
                        const newBrand = {
                            brand_name: data.brand,
                            brand_slug: await createSlug(data.brand),
                        };
                        brand_id = new Brands(newBrand);
                        await brand_id.save();
                    }

                    // console.log('Brand ID:', brand_id._id); // Add this logging

                    if (data.model) {

                        let model_id = await XLBrandModel.findOne({ model_name: data.model, model_year: data.year, brand_id: brand_id._id });

                        if (!model_id) {
                            const newModel = {
                                brand_id: brand_id._id,
                                model_name: data.model,
                                model_slug: await createSlug(data.model),
                                model_year: data.year,
                            };
                            model_id = new XLBrandModel(newModel);
                            await model_id.save();
                        }
                        model_id.brand_id = brand_id._id;
                        model_id.model_year = data.year;
                        // console.log('Model ID:', model_id._id); // Add this logging


                        if (data.variant) {

                            let variant = await XLModelVariant.findOne({ variant_name: data.variant, variant_year: data.year, brand_id: brand_id._id, model_id: model_id._id });

                            if (!variant) {
                                const newVariant = {
                                    brand_id: brand_id._id,
                                    model_id: model_id._id,
                                    variant_name: data.variant,
                                    variant_slug: await createSlug(data.variant),
                                    variant_year: data.year,
                                };
                                variant = new XLModelVariant(newVariant);
                                await variant.save();
                            }

                            variant.brand_id = brand_id._id;
                            variant.model_id = model_id._id;
                            variant.variant_year = data.year;
                            await variant.save();

                        }

                    }
                    // , brand_year: data.year,

                }
            }


        }

        res.status(201).json({ status: 1, message: 'Please check all data once.' });

    } catch (error) {
        console.error('Error:', error); // Add this logging
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }


}

export { createBrand, manageBrandsList, viewBrand, updateBrand, blockUnblockBrand, fetchBrands, createmakeModelVariantByExcel }