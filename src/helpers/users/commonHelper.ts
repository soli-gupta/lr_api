import { Request, Response } from "express";
import BodyType from "../../modules/admin/models/body-type";
import CmsPage from "../../modules/admin/models/cms-page";
import Fuel from "../../modules/admin/models/fuel";
import Brands from "../../modules/brand/model/brand";
import BrandModel from "../../modules/brand/model/brand-models";
import ModelVariant from "../../modules/brand/model/model-variant";
import ExperienceCenter from "../../modules/experience-centers/models/experience-centers";
import FeatureSpecification from "../../modules/features-and-specification/models/feature-specification";
import SpecificationCategory from "../../modules/features-and-specification/models/specifications-category";
import Products from "../../modules/product/models/product-model";
import ServiceDiscount from "../../modules/service/models/service-discount";
import ServicesSubCategory from "../../modules/service/models/service-sub-category";
import ServicesDemo from "../../modules/service/models/demo-service";
import { ObjectId } from "mongodb";
import CarCareSubCategory from "../../modules/car-care/models/car-care-sub-category";
import CarCares from "../../modules/car-care/models/car-cares";
import CarCareDiscount from "../../modules/car-care/models/car-care-discount";

const cmsPageDIR = 'public/cms-page/';

const cmsPages = async (pageSlug: string) => {
    let shareCmsPage: any = {};
    const fetchPage = await CmsPage.findOne({ page_slug: pageSlug });
    if (!fetchPage) {
        return shareCmsPage = '';
    }
    shareCmsPage = {
        _id: fetchPage._id,
        name: fetchPage.page_name,
        slug: fetchPage.page_slug,
        sub_text: fetchPage.sub_text,
        content_one: fetchPage.content_one,
        content_two: fetchPage.content_two,
        content_three: fetchPage.content_three,
        content_four: fetchPage.content_four,
        page_banner: fetchPage.page_banner ? cmsPageDIR + fetchPage.page_banner : '',
        why_choose_luxury: fetchPage.why_choose_luxury ? cmsPageDIR + fetchPage.why_choose_luxury : '',
        selling_your_car: fetchPage.selling_your_car ? cmsPageDIR + fetchPage.selling_your_car : '',
        banner_image_alt: fetchPage.banner_image_alt,
        status: fetchPage.page_status,
        page_title: fetchPage.cms_page_title,
        meta_keywords: fetchPage.page_meta_keyword,
        meta_description: fetchPage.page_meta_description,
        meta_other: fetchPage.page_meta_other,
        newly_launched: fetchPage.page_newly_launched ? fetchPage.page_newly_launched : 2,
        our_service_centers: fetchPage.our_service_centers ? cmsPageDIR + fetchPage.our_service_centers : '',
        mobile_banner: fetchPage.mobile_banner ? cmsPageDIR + fetchPage.mobile_banner : '',
        page_logo: fetchPage.page_logo ? cmsPageDIR + fetchPage.page_logo : '',
        short_description: fetchPage.page_short_description ? fetchPage.page_short_description : '',
        bb_assurance: fetchPage.bb_assurance ? cmsPageDIR + fetchPage.bb_assurance : '',
        why_choose_luxury_mobile: fetchPage.why_choose_luxury_mobile ? cmsPageDIR + fetchPage.why_choose_luxury_mobile : '',
        selling_your_car_mobile: fetchPage.selling_your_car_mobile ? cmsPageDIR + fetchPage.selling_your_car_mobile : '',
        our_service_centers_mobile: fetchPage.our_service_centers_mobile ? cmsPageDIR + fetchPage.our_service_centers_mobile : '',
    }
    return shareCmsPage;
}
//.find({ $or: [{ _id: _id[i] }, { 'brand_slug': { $in: [_id] } }] }).where({ brand_status: 1 }).sort({ logo_sorting: 1 });

const fetchBrandDetailsById = async (_id: any) => {
    const brandImgDIR = 'public/brands/';

    let forBrands: any = [];
    const brands: any = [];

    for (let i = 0; i < _id.length; i++) {

        const getAllBrands = await Brands.find({ _id: _id[i] }).where({ brand_status: 1 }).sort({ logo_sorting: 1 });

        // forBrands = getAllBrands;
        getAllBrands.forEach((brand) => {
            brands.push({
                _id: brand._id,
                name: brand.brand_name,
                slug: brand.brand_slug,
                logo: brand.brand_logo ? brandImgDIR + brand.brand_logo : '',
                sort: brand.logo_sorting ? brand.logo_sorting : '',
                status: brand.brand_status,
                createdAt: brand.createdAt,
                updatedAt: brand.updatedAt
            })
        });
        forBrands = brands;
    }
    return forBrands;
}


const fetchBodyTypeDetailsById = async (_id: any) => {
    const bodyTypeImgpath = 'public/body-type/';
    const bodyTypes: any = []
    let foraBodyType: any = [];

    for (let i = 0; i < _id.length; i++) {

        const getBodyType = await BodyType.find({ _id: _id[i] }).where({ body_status: 1 });

        getBodyType.forEach((body) => {
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
        foraBodyType = bodyTypes;
    }
    return foraBodyType;
}

const fetchFuelTypeDetailsById = async (_id: any) => {
    const fuels: any = [];
    let forFuelType: any = [];
    const fuelDIR: any = 'public/fuel-type/'
    for (let i = 0; i < _id.length; i++) {
        const getFuelType = await Fuel.find({ _id: _id[i] }).where({ fuel_status: 1 });

        getFuelType.forEach((fuelData) => {
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
        forFuelType = fuels
    }
    return forFuelType;
}

// const fetchExperienceCenterDetails = async (slug: any) => {
//     const experienceCenterDIR = 'public/experience-center/';
//     const experienceCenter: any = [];
//     let forExperienceCenter: any = [];
//     for (let i = 0; i < slug.length; i++) {
//         console.log(slug[i]);
//         const getExperienceCenters = await ExperienceCenter.find({ center_name: slug[i] }).where({ center_status: 1 });

//         console.log(getExperienceCenters)
//         getExperienceCenters.forEach((center) => {
//             experienceCenter.push({
//                 _id: center._id,
//                 name: center.center_name,
//                 slug: center.center_slug,
//                 state: center.center_state,
//                 city: center.center_city,
//                 address: center.center_full_address,
//                 address_google_url: center.center_google_address_url,
//                 banner: center.center_banner ? experienceCenterDIR + center.center_banner : '',
//                 short_description: center.short_description,
//                 status: center.center_status,
//                 createdAt: center.createdAt,
//                 updatedAt: center.updatedAt
//             })
//         });
//         forExperienceCenter = experienceCenter;
//     }
//     return forExperienceCenter;
// }

const fetchBrandIdBuyBrandSlug = async (brandSlug: any) => {
    const fetchBrandIdBuySlug = await Brands.findOne({ brand_slug: brandSlug }).where({ brand_status: 1 });
    if (!fetchBrandIdBuySlug) {
        return '';
    }
    return fetchBrandIdBuySlug?._id;
}

const fetchModelIdBuyModelSlug = async (modelSlug: any, brand_id: any) => {
    const fetchModelId = await BrandModel.findOne({ model_slug: modelSlug, brand_id }).where({ model_status: 1 });
    if (!fetchModelId) {
        return '';
    }
    return fetchModelId?._id
}

const fetchVariantIdBuyVariantSlug = async (variantSlug: any, model_id: any, brand_id: any) => {
    const fetchVariantId = await ModelVariant.findOne({ variant_slug: variantSlug, model_id, brand_id }).where({ variant_status: 1 });
    if (!fetchVariantId) {
        return ''
    }
    return fetchVariantId?._id;
}

const fetchFeatureCategorydetails = async (_id: any) => {
    const categories: any = [];
    let forFeatureCategory: any = [];
    // SpecificationCategory
    for (let i = 0; i < _id.length; i++) {
        const fetchCategories = await SpecificationCategory.find({ _id: _id[i] }).where({ status: 1 });

        fetchCategories.forEach((cate) => {
            categories.push({
                cate_id: cate._id,
                cate_name: cate.name,
                cate_slug: cate.slug
            })
        })
        forFeatureCategory = categories;
    }
    return forFeatureCategory;
}


const fetchFeatures = async (feature_id: any) => {


    let forFeatures: any = [];
    const features: any = [];
    for (let i = 0; i < feature_id.length; i++) {
        const fetchSpecName = await FeatureSpecification.find({ feature_id: feature_id[i]._id }).where({ feature_status: 1 });

        fetchSpecName.forEach((fetu) => {
            features.push({
                _id: fetu._id,
                feature_name: fetu.feature_name,
            })
        });

        forFeatures = features;

        return forFeatures;
    }
}

// const linkedProducts = async (_id: any) => {
//     const products: any = [];
//     let testForEachData: any = [];
//     const linkedProduct = await Products.find({ '_id': { $in: _id } }).where({ product_status: "live", product_type_status: 1 });
//     // console.log(linkedProduct);
//     // fetchProduct?.product_linked_from
//     // const testVar = linkedProduct.concat(...linkedProduct);
//     // const testVar = [...linkedProduct];
//     // // console.log(testVar);
//     // // // console.log('<br><br>');
//     // testVar?.forEach((product) => {
//     //     products.push(product);
//     //     if (product.product_linked_from !== '' || product.product_linked_from !== undefined) {
//     //         // console.log(product.product_linked_from);
//     //         linkedProducts(product.product_linked_from);
//     //     }
//     //     // console.log(products);
//     // });
//     // // let testForEachData = [].concat(...products);
//     // testForEachData.push(products);
//     // console.log(testForEachData);
//     return linkedProduct;
// }

const linkedProductsHelper = async (_id: any) => {

    const productDIR = 'public/products/';
    const products: any = [];
    let forProducts: any = [];
    for (let i = 0; i < _id.length; i++) {

        const getProducts = await Products.find({ _id: { $in: _id[i] } }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_full_address"] }]).where({ product_status: "live", product_type_status: 1 });

        getProducts.forEach((product) => {
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
                // image: product.product_image ? productDIR + product.product_image : '',
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
                linked_from: product.product_linked_from,
                product_emi: product.product_monthely_emi ? product.product_monthely_emi : '',
                image_360: product.image_360
            })
        })
        forProducts = products;
    }

    return forProducts;
    // const data = await getProductdata(_id);
    // const conv = [].concat.apply([], data);
    // // console.log(...conv);
    // return data;
}

// const getProductdata = async (_id: any) => {
//     const productDIR = 'public/products/';
//     const products: any = [];
//     let productsData: any = [];
//     const linkedProduct = await Products.find({ '_id': { $in: _id } }).where({ product_status: "live", product_type_status: 1 });

//     const testVar = [...linkedProduct];
//     testVar?.forEach((product) => {
//         products.push(product);
//         if (product.product_linked_from !== '' || product.product_linked_from !== undefined) {
//             linkedProductsHelper(product.product_linked_from);
//         }
//     });
//     products?.forEach((prod: any) => {
//         productsData.push({
//             _id: prod._id,
//             brand_id: prod.brand_id,
//             model_id: prod.model_id,
//             variant_id: prod.variant_id,
//             name: prod.product_name,
//             slug: prod.product_slug,
//             registration_year: prod.registration_year,
//             registration_state: prod.registration_state,
//             kms_driven: prod.kms_driven,
//             product_ownership: prod.product_ownership,
//             fuel_type: prod.fuel_type,
//             price: prod.price,
//             short_description: prod.short_description,
//             image: prod.product_image ? productDIR + prod.product_image : '',
//             sell_status: prod.product_status,
//             status: prod.product_type_status,
//             manufacturing_year: prod.manufacturing_year,
//             engine_cc: prod.engine_cc,
//             body_type: prod.body_type,
//             insurance_type: prod.insurance_type,
//             insurance_valid: prod.insurance_valid,
//             product_location: prod.product_location,
//             page_title: prod.page_title,
//             meta_keywords: prod.meta_keywords,
//             meta_description: prod.meta_description,
//             meta_other: prod.meta_other,
//             createdAt: prod.createdAt,
//             updatedAt: prod.updatedAt,
//             linked_from: prod.product_linked_from
//         })

//     })
//     // const asdjhb = [...products];
//     // const convSingleArray = [].concat.apply([], productsData);
//     // const convSingleArray = [].concat.apply([], products);
//     // testForEachData = convSingleArray;
//     // console.log(...products);
//     // const sdkjb = {
//     //     asdjhb
//     // }
//     // let asjhdb: any = [];
//     // asjhdb = { ...convSingleArray }
//     // console.log(asjhdb);
//     // return convSingleArray;
//     // res.status(200).json({ status: 1, linke_products: convSingleArray });
//     // res.end();
//     return products;
// }

const fetchModelDetailsByModelId = async (_id: any) => {
    const modelImgDIR = 'public/models/';

    let forModels: any = [];
    const models: any = [];

    for (let i = 0; i < _id.length; i++) {

        const getAllModels = await BrandModel.find({ _id: _id[i] }).where({ model_status: 1 });
        // .sort({ logo_sorting: 1 });

        // forBrands = getAllBrands;
        getAllModels.forEach((model) => {
            models.push({
                _id: model._id,
                name: model.model_name,
                slug: model.model_slug,
                logo: model.model_image ? modelImgDIR + model.model_image : '',
                // sort: model.model ? model.logo_sorting : '',
                status: model.model_status,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            })
        });
        forModels = models;
    }

    return forModels;
}

const fetchServiceSubCat = async (_id: any) => {

    const categories: any = [];
    let forDisCategory: any = [];
    // SpecificationCategory
    // for (let i = 0; i < _id.length; i++) {

    const fetchCategories = await ServicesSubCategory.find({ service_category_id: _id });

    fetchCategories.forEach((subCate) => {
        categories.push({
            sub_cate_id: subCate._id,
            sub_cate: subCate.service_sub_category_name,
        })
    })
    forDisCategory = categories;
    // }
    return forDisCategory;
}

const fetchCarCareSubCat = async (_id: any) => {

    const categories: any = [];
    let forDisCategory: any = [];
    // SpecificationCategory
    // for (let i = 0; i < _id.length; i++) {

    const fetchCategories = await CarCareSubCategory.find({ car_care_category_id: _id });

    fetchCategories.forEach((subCate) => {
        categories.push({
            sub_cate_id: subCate._id,
            sub_cate: subCate.car_care_sub_category_name,
        })
    })
    forDisCategory = categories;
    // }
    return forDisCategory;
}

const filterServicebyCarDetails = async (cateId: any, brandId: any, modelId: any, variantId: any, fuel: any, res: Response) => {
    try {
        const services: any = [];
        // const queryData = req.query
        // console.log(queryData);
        const responseData = [];
        let grossAmount = 0
        let discountAmount = 0
        let getServices = await ServicesDemo.find({ service_category_id: cateId, brand_name: brandId, model_name: modelId, variant_name: variantId, fuel_type: fuel }).populate([
            { path: "service_category_id", select: ["service_category_name"] },
            { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug", "service_category_slug", "service_taken_hours", "service_short_description", "service_description"] }
        ]);

        for (const getServicess of getServices) {
            let catId = new ObjectId(getServicess.service_category_id).toString()
            let subCatId = new ObjectId(getServicess.service_sub_category_id).toString()
            // console.log(subCatId)
            let discount = await ServiceDiscount.find({ service_category_id: catId, service_sub_category_id: subCatId })

            if (discount && discount.length > 0) {
                discount.map((dis) => {
                    if (dis.discount_type === '1') {
                        discountAmount = dis.service_discount_price
                        grossAmount = getServicess.service_price - dis.service_discount_price
                        // console.log(grossAmount)
                    }
                    if (dis.discount_type === '2') {
                        // (getServicess.service_price * dis.service_discount_price) / 100;
                        let disAmount = (dis.service_discount_price / 100) * getServicess.service_price;
                        discountAmount = disAmount
                        grossAmount = getServicess.service_price - disAmount
                        // console.log(grossAmount)
                    }

                    responseData.push({
                        ...getServicess.toJSON(),
                        service_price: getServicess.service_price,
                        discount: discountAmount,
                        grossAmount: grossAmount,
                    });
                })
            } else {
                responseData.push({
                    ...getServicess.toJSON(),
                    service_price: getServicess.service_price,
                    discount: 0,
                    grossAmount: 0,
                });
            }
            // let discount = await ServiceDiscount.find({getServicess})
        }

        // const getServices = await Services.find({ service_category_id: queryData.id, brand_id: queryData.brand_name, model_id: queryData.model_name, variant_id: queryData.variant_name, fuel_type: queryData.fuel }).populate([
        //     { path: "service_category_id", select: ["service_category_name", "service_category_slug"] },
        //     { path: "service_sub_category_id", select: ["service_sub_category_name", "service_category_slug"] }
        // ]);

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }

        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                brand_id: servicesData.brand_name,
                model_id: servicesData.model_name,
                variant_id: servicesData.variant_name,
                fuel_type: servicesData.fuel_type,
                // body_type: servicesData.body_type,
                service_category: servicesData.service_category_id,
                service_sub_category: servicesData.service_sub_category_id,
                // service_name: servicesData.service_name,
                service_price: servicesData.service_price,
                // service_taken_hours: servicesData.service_taken_hours,
                // service_short_description: servicesData.service_short_description,
                // service_description: servicesData.service_description,
                // service_sorting: servicesData.service_sorting,
                // service_recommend: servicesData.service_recommend,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });
        // console.log(services)
        return responseData
        res.status(200).json({ status: 1, data: services, datas: responseData });
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}


const filterCarCarebyCarDetails = async (cateId: any, brandId: any, modelId: any, color: any, res: Response) => {
    try {
        const services: any = [];

        const responseData = [];
        let grossAmount = 0
        let discountAmount = 0
        let getServices = await CarCares.find({ car_care_category_id: cateId, brand_name: brandId, model_name: modelId, car_care_color: color }).populate([
            { path: "car_care_category_id", select: ["car_care_category_name"] },
            { path: "car_care_sub_category_id", select: ["car_care_sub_category_name", "car_care_category_slug", "car_care_category_slug", "car_care_taken_hours", "car_care_short_description", "car_care_description"] }
        ]);

        for (const getServicess of getServices) {
            let catId = new ObjectId(getServicess.car_care_category_id).toString()
            let subCatId = new ObjectId(getServicess.car_care_sub_category_id).toString()
            // console.log(subCatId)
            let discount = await CarCareDiscount.find({ car_care_category_id: catId, car_care_sub_category_id: subCatId })

            if (discount && discount.length > 0) {
                discount.map((dis) => {
                    if (dis.discount_type === '1') {
                        discountAmount = dis.car_care_discount_price
                        grossAmount = getServicess.car_care_price - dis.car_care_discount_price
                        // console.log(grossAmount)
                    }
                    if (dis.discount_type === '2') {
                        // (getServicess.service_price * dis.service_discount_price) / 100;
                        let disAmount = (dis.car_care_discount_price / 100) * getServicess.car_care_price;
                        discountAmount = disAmount
                        grossAmount = getServicess.car_care_price - disAmount
                        // console.log(grossAmount)
                    }

                    responseData.push({
                        ...getServicess.toJSON(),
                        car_care_price: getServicess.car_care_price,
                        discount: discountAmount,
                        grossAmount: grossAmount,
                    });
                })
            } else {
                responseData.push({
                    ...getServicess.toJSON(),
                    car_care_price: getServicess.car_care_price,
                    discount: 0,
                    grossAmount: 0,
                });
            }
            // let discount = await ServiceDiscount.find({getServicess})
        }

        if (!getServices) {
            return res.status(400).send({ status: 0, message: 'Data not available!' });
        }

        getServices.forEach((servicesData) => {
            services.push({
                _id: servicesData._id,
                brand_id: servicesData.brand_name,
                model_id: servicesData.model_name,
                color: servicesData.car_care_color,
                car_care_category: servicesData.car_care_category_id,
                car_care_sub_category: servicesData.car_care_sub_category_id,
                car_care_price: servicesData.car_care_price,
                status: servicesData.status,
                createdAt: servicesData.createdAt,
                updatedAt: servicesData.updatedAt
            })
        });

        return responseData

    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

export { cmsPages, fetchBrandDetailsById, fetchBodyTypeDetailsById, fetchFuelTypeDetailsById, fetchBrandIdBuyBrandSlug, fetchModelIdBuyModelSlug, fetchVariantIdBuyVariantSlug, fetchFeatures, fetchFeatureCategorydetails, linkedProductsHelper, fetchModelDetailsByModelId, fetchServiceSubCat, filterServicebyCarDetails, fetchCarCareSubCat, filterCarCarebyCarDetails }