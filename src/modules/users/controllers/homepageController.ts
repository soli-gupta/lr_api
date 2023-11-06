import { Request, Response } from "express";
import { cmsPages, fetchBodyTypeDetailsById, fetchBrandDetailsById, fetchFuelTypeDetailsById, fetchModelDetailsByModelId } from "../../../helpers/users/commonHelper";
import BodyType from "../../admin/models/body-type";
import CmsPage from "../../admin/models/cms-page";
import Brands from "../../brand/model/brand";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import Products from "../../product/models/product-model";
import BookVisit from "../models/book-visit";
import BankSchema from "../../admin/models/bank-model";
import Fuel from "../../admin/models/fuel";
import BrandModel from "../../brand/model/brand-models";

const bannerDIR = 'public/cms-page/';

const fetchAllCmsPages = async (req: Request, res: Response) => {
    try {
        const cmsPage: any = [];
        let buildQuery: any = [];

        const getAllPages = await CmsPage.find({ page_slug: { $in: ["buy", "sell", "service", "car-care", "service-packages", "extended-warranty", "insurance", "loan"] } }).where({ page_status: 1 }).sort({ page_sorting: 1 }).limit(8);
        if (!getAllPages) {
            return res.status(400).json({ status: 0, message: 'Server not available. Please refresh the page!' });
        }

        getAllPages.forEach((cms) => {
            cmsPage.push({
                _id: cms._id,
                name: cms.page_name,
                slug: cms.page_slug,
                sub_text: cms.sub_text,
                content_one: cms.content_one,
                content_two: cms.content_two,
                content_three: cms.content_three,
                content_four: cms.content_four,
                page_banner: cms.page_banner ? bannerDIR + cms.page_banner : '',
                why_choose_luxury: cms.why_choose_luxury ? bannerDIR + cms.why_choose_luxury : '',
                selling_your_car: cms.selling_your_car ? bannerDIR + cms.selling_your_car : '',
                banner_image_alt: cms.banner_image_alt,
                status: cms.page_status,
                page_title: cms.cms_page_title,
                meta_keywords: cms.page_meta_keyword,
                meta_description: cms.page_meta_description,
                meta_other: cms.page_meta_other,
                createdAt: cms.createdAt,
                updatedAt: cms.updatedAt,
                newly_launched: cms.page_newly_launched ? cms.page_newly_launched : 2,
                our_service_centers: cms.our_service_centers ? bannerDIR + cms.our_service_centers : '',
                mobile_banner: cms.mobile_banner ? bannerDIR + cms.mobile_banner : '',
                page_logo: cms.page_logo ? bannerDIR + cms.page_logo : '',
                short_description: cms.page_short_description ? cms.page_short_description : '',
                page_sorting: cms.page_sorting ?? '',
                why_choose_luxury_mobile: cms.why_choose_luxury_mobile ? bannerDIR + cms.why_choose_luxury_mobile : '',
                selling_your_car_mobile: cms.selling_your_car_mobile ? bannerDIR + cms.selling_your_car_mobile : '',
                our_service_centers_mobile: cms.our_service_centers_mobile ? bannerDIR + cms.our_service_centers_mobile : '',
            });
        });
        res.status(200).json({ status: 1, cms_page: cmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchCmsPage = async (req: Request, res: Response) => {
    try {
        const pageSlug = req.params.slug;
        const cmsPage: any = await cmsPages(pageSlug);

        if (!cmsPage) {
            return res.status(400).json({ status: 2, message: 'Server problem, Please refresh the page or come back after some time!' });
        }
        res.status(200).json({ status: 1, cms_page: cmsPage });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchProductsForHome = async (req: Request, res: Response) => {
    try {
        const productDIR = 'public/products/'
        const products: any = [];
        const fetchLatestproducts = await Products.find({}).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug"] }
        ]).where({ product_status: 'live', product_type_status: 1 }).sort({ price: -1 }).limit(6);
        if (!fetchLatestproducts) {
            return res.status(400).json({ status: 2, message: 'Server problem, Please refresh the page or come back after some time!' });
        }
        fetchLatestproducts.forEach((product) => {
            products.push({
                _id: product._id,
                brand_id: product.brand_id,
                model_id: product.model_id,
                variant_id: product.variant_id,
                name: product.product_name,
                slug: product.product_slug,
                registration_year: product.registration_year,
                registration_state: product.registration_state,
                kms_driven: product.kms_driven,
                product_ownership: product.product_ownership,
                fuel_type: product.fuel_type,
                price: product.price,
                short_description: product.short_description,
                image: product.product_image ? product.product_image : '',
                sell_status: product.product_status,
                status: product.product_type_status,
                manufacturing_year: product.manufacturing_year,
                engine_cc: product.engine_cc,
                body_type: product.body_type,
                insurance_type: product.insurance_type,
                insurance_valid: product.insurance_valid,
                product_location: product.product_location,
                page_title: product.page_title,
                meta_keywords: product.meta_keywords,
                meta_description: product.meta_description,
                meta_other: product.meta_other,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                product_emi: product.product_monthely_emi ? product.product_monthely_emi : '',
                booking_amount: product.product_booking_amount ? product.product_booking_amount : '',
                image_carousel: product.image_carousel ? product.image_carousel : '',
                registration_number: product.registration_number ? product.registration_number : '',
                image_360: product.image_360
            })
        });

        res.status(200).json({ status: 1, products });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchExperienceCenterForHome = async (req: Request, res: Response) => {
    try {
        const experienceCenterDIR = 'public/experience-center/';
        const experienceCenter: any = [];
        const getExperienceCenters = await ExperienceCenter.find({ 'center_name': { $in: ["Gurugram", "Karnal"] } }).sort({ createdAt: -1 }).limit(2).where({ center_status: 1 });

        if (!getExperienceCenters) {
            return res.status(404).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }

        getExperienceCenters.forEach((center) => {
            experienceCenter.push({
                _id: center._id,
                title: center.center_title,
                name: center.center_name,
                slug: center.center_slug,
                state: center.center_state,
                city: center.center_city,
                address: center.center_full_address,
                address_google_url: center.center_google_address_url,
                banner: center.center_banner ? experienceCenterDIR + center.center_banner : '',
                service_center_banner: center.service_center_banner ? experienceCenterDIR + center.service_center_banner : '',
                short_description: center.short_description,
                center_area: center.center_area,
                center_car_bay: center.center_car_bay,
                center_daily_service: center.center_daily_service,
                status: center.center_status,
                createdAt: center.createdAt,
                updatedAt: center.updatedAt
            })
        });
        res.status(200).json({ status: 1, experience_center: experienceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


// const fetchAllBrandsForHome = async (req: Request, res: Response) => {
//     try {
//         // const getBrandByProduct = await Products.find({}).distinct('brand_id');

//         const brandImgDIR = 'public/brands/';

//         let forBrands: any = [];
//         const brands: any = [];

//         const getBrandByProduct = await Brands.find({}).where({ brand_status: 1 }).sort({ logo_sorting: 1 });


//         if (!getBrandByProduct) {
//             return res.status(400).json({ status: 2, message: 'Something went wrong!' });
//         }

//         // forBrands = getAllBrands;
//         getBrandByProduct.forEach(async (brand) => {

//             brands.push({
//                 _id: brand._id,
//                 name: brand.brand_name,
//                 slug: brand.brand_slug,
//                 logo: brand.brand_logo ? brandImgDIR + brand.brand_logo : '',
//                 sort: brand.logo_sorting ? brand.logo_sorting : '',
//                 status: brand.brand_status,
//                 createdAt: brand.createdAt,
//                 updatedAt: brand.updatedAt,
//                 // models: await BrandModel.find({ brand_id: brand._id }).where({ model_status: 1 })
//             })
//         });

//         const fetchModelsByBrands: any = [];
//         const getDataOutOFLoop: any = [];
//         let getDataOutOFLoop2: any = [];
//         const modelImgDIR = 'public/models/';
//         brands.map(async (br: any) => {
//             const fetchModels = await BrandModel.find({ brand_id: br._id }).where({ model_status: 1 });
//             fetchModels.map((md) => fetchModelsByBrands.push({
//                 _id: md._id,
//                 name: md.model_name,
//                 slug: md.model_slug,
//                 logo: md.model_image ? modelImgDIR + md.model_image : '',
//                 status: md.model_status,
//                 createdAt: md.createdAt,
//                 updatedAt: md.updatedAt,
//             }));

//             getDataOutOFLoop.push({
//                 _id: br._id,
//                 name: br.name,
//                 slug: br.slug,
//                 logo: br.logo ? brandImgDIR + br.logo : '',
//                 sort: br.logo_sorting ? br.logo_sorting : '',
//                 status: br.status,
//                 createdAt: br.createdAt,
//                 updatedAt: br.updatedAt,
//                 models: fetchModelsByBrands
//             })
//             getDataOutOFLoop2 = getDataOutOFLoop
//             // console.log('getDataOutOFLoop : ', getDataOutOFLoop);
//         });
//         console.log('getDataOutOFLoop2 : ', getDataOutOFLoop2);
//         // for (let i = 1; i < brands.length; i++) {
//         //     console.log(brands[i])
//         //     const fetchModels = await fetchModelsByBrandId(brands[i]);
//         //     console.log('fetchModels : ', fetchModels);
//         //     // forBrands = {
//         //     //     _id: getBrandByProduct[i]._id,
//         //     //     name: getBrandByProduct[i].brand_name,
//         //     //     slug: getBrandByProduct[i].brand_slug,
//         //     //     logo: getBrandByProduct[i].brand_logo ? brandImgDIR + getBrandByProduct[i].brand_logo : '',
//         //     //     sort: getBrandByProduct[i].logo_sorting ? getBrandByProduct[i].logo_sorting : '',
//         //     //     status: getBrandByProduct[i].brand_status,
//         //     //     createdAt: getBrandByProduct[i].createdAt,
//         //     //     updatedAt: getBrandByProduct[i].updatedAt,
//         //     //     models: fetchModels
//         //     // }

//         //     // console.log('forBrands : ', forBrands);
//         // }




//         // const fetchModels = await fetchModelsByBrandId(brands);


//         //    const fetchModels =  await BrandModel.find({ brand_id: {$in:brand._id} }).where({ model_status: 1 })
//         // console.log('brands : ', brands);
//         // const brandByProduct = await fetchBrandDetailsById(getBrandByProduct);
//         res.status(200).json({ status: 1, brands });
//     } catch (e) {
//         res.status(500).json({ status: 0, message: 'Something went wrong.' });
//     }
// }

const fetchAllBrandsForHome = async (req: Request, res: Response) => {
    try {
        const brandImgDIR = 'public/brands/';
        const modelImgDIR = 'public/models/';

        const brands: any = [];
        const fetchModelsPromises: any = [];

        const getBrandByProduct = await Brands.find({}).where({ brand_status: 1 }).sort({ logo_sorting: 1 });

        if (!getBrandByProduct) {
            return res.status(400).json({ status: 2, message: 'Something went wrong!' });
        }

        // Process brands and their associated models
        let fetchModelsPromise: any = [];
        getBrandByProduct.forEach(async (brand) => {
            const brandInfo = {
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
                logo: brand.brand_logo ? brandImgDIR + brand.brand_logo : '',
                sort: brand.logo_sorting ? brand.logo_sorting : '',
                status: brand.brand_status,
                createdAt: brand.createdAt,
                updatedAt: brand.updatedAt,
            };

            brands.push(brandInfo);

            fetchModelsPromise = BrandModel.find({ brand_id: brand._id }).where({ model_status: 1 });
            fetchModelsPromises.push(fetchModelsPromise);
        });

        const fetchModelsResults = await Promise.all(fetchModelsPromises);

        brands.forEach((brand: any, index: any) => {
            const fetchModels = fetchModelsResults[index];
            const modelsForBrand = fetchModels.map((md: any) => ({
                _id: md._id,
                name: md.model_name,
                slug: md.model_slug,
                logo: md.model_image ? modelImgDIR + md.model_image : '',
                status: md.model_status,
                createdAt: md.createdAt,
                updatedAt: md.updatedAt,
            }));
            brand.models = modelsForBrand;
        });

        res.status(200).json({ status: 1, brands });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchAllBodyTypeForHome = async (req: Request, res: Response) => {
    try {
        // const getBodyTypeByProduct = await Products.find({}).distinct('body_type');
        const bodyTypeImgpath = 'public/body-type/';
        const bodyTypes: any = [];

        const getBodyTypeByProduct = await BodyType.find({}).where({ body_status: 1 }).sort({ sorting: 1 });


        if (!getBodyTypeByProduct) {
            return res.status(400).json({ status: 2, message: 'Something went wrong!' });
        }

        getBodyTypeByProduct.forEach((body) => {
            bodyTypes.push({
                _id: body._id,
                body_name: body.body_name,
                body_slug: body.body_slug,
                body_status: body.body_status,
                body_image: body.body_image ? bodyTypeImgpath + body.body_image : '',
                createdAt: body.createdAt,
                updatedAt: body.updatedAt
            })
        });


        // const bodyTypes = await fetchBodyTypeDetailsById(getBodyTypeByProduct);
        res.status(200).json({ status: 1, body_type: bodyTypes });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}
// where({ product_status: 'live' }).
// where({ product_status: 'live' }).
//.where({ product_status: 'live' })
const fetchAllFuelTypesForHome = async (req: Request, res: Response) => {
    try {
        // const getFuelTypeByProduct = await Products.find({}).distinct('fuel_type');
        const fuels: any = [];
        const fuelDIR: any = 'public/fuel-type/';

        const getFuelTypeByProduct = await Fuel.find({}).where({ fuel_status: 1 }).sort({ sorting: 1 });

        if (!getFuelTypeByProduct) {
            return res.status(400).json({ status: 2, message: 'Something went wrong!' });
        }

        getFuelTypeByProduct.forEach((fuelData) => {
            fuels.push({
                _id: fuelData._id,
                fuel_name: fuelData.fuel_name,
                fuel_slug: fuelData.fuel_slug,
                suel_status: fuelData.fuel_status,
                cratedAt: fuelData.createdAt,
                updatedAt: fuelData.updatedAt,
                fuel_image: fuelData.fuel_image ? fuelDIR + fuelData.fuel_image : ''
            })
        });

        const fuelType = await fetchFuelTypeDetailsById(getFuelTypeByProduct);

        res.status(200).json({ status: 1, fuel_type: fuelType });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const bookAVisit = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const bookVisitData = {
            visitor_first_name: body.visitor_first_name ?? '',
            visitor_last_name: body.visitor_last_name ?? '',
            visitor_contact: body.visitor_contact ?? '',
            experience_center: body.experience_center ?? '',
            visit_book_date: body.date ?? '',
            visit_book_time: body.book_time ?? '',
            visit_type: body.type ?? '',
        }
        const addVisit = new BookVisit(bookVisitData);
        await addVisit.save();

        res.status(201).json({ status: 1, message: 'Thank you for booking your appointment. Our executive will contact you shortly.', vistDetail: addVisit })
    } catch (e) {
        res.status(500).json({ status: 1, message: 'Something went wrong.' });
    }
}

const fetchAllServiceCenters = async (req: Request, res: Response) => {
    try {
        const experienceCenterDIR = 'public/experience-center/';
        const experienceCenter: any = [];
        const getExperienceCenters = await ExperienceCenter.find({}).sort({ center_sorting: -1 }).where({ center_status: 1 }).sort({ center_sorting: 1 });

        if (!getExperienceCenters) {
            return res.status(404).json({ status: 0, message: 'Server problem, Please refresh the page or come back after some time!' });
        }

        getExperienceCenters.forEach((center) => {
            experienceCenter.push({
                _id: center._id,
                name: center.center_name,
                slug: center.center_slug,
                state: center.center_state,
                city: center.center_city,
                address: center.center_full_address,
                address_google_url: center.center_google_address_url,
                banner: center.center_banner ? experienceCenterDIR + center.center_banner : '',
                service_center_banner: center.service_center_banner ? experienceCenterDIR + center.service_center_banner : '',
                short_description: center.short_description,
                center_area: center.center_area,
                center_car_bay: center.center_car_bay,
                center_daily_service: center.center_daily_service,
                status: center.center_status,
                createdAt: center.createdAt,
                updatedAt: center.updatedAt
            })
        });

        res.status(200).json({ status: 1, experience_center: experienceCenter });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchAllBrandsByProduct = async (req: Request, res: Response) => {
    try {
        const getBrandByProduct = await Products.find({}).distinct('brand_id').where({ product_status: "live", product_type_status: 1 });

        const getBrands = await fetchBrandDetailsById(getBrandByProduct);

        res.status(200).json({ status: 1, brands: getBrands });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


const fetchAllModelByBrandInProducts = async (req: Request, res: Response) => {
    try {
        const brand_slug = req.params.slug;
        const getBrandId = await Brands.findOne({ brand_slug });

        const getModelIdByProduct = await Products.find({ brand_id: getBrandId }).distinct('model_id').where({ product_status: "live", product_type_status: 1 });

        const getModels = await fetchModelDetailsByModelId(getModelIdByProduct);

        res.status(200).json({ status: 1, brand_models: getModels });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


export { fetchAllCmsPages, fetchCmsPage, fetchProductsForHome, fetchExperienceCenterForHome, fetchAllBrandsForHome, fetchAllBodyTypeForHome, fetchAllFuelTypesForHome, bookAVisit, fetchAllServiceCenters, fetchAllBrandsByProduct, fetchAllModelByBrandInProducts }