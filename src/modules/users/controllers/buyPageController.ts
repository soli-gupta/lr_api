import { Request, Response } from "express";
import { fetchBrandIdBuyBrandSlug, fetchFeatureCategorydetails, fetchModelIdBuyModelSlug, fetchVariantIdBuyVariantSlug, linkedProductsHelper, fetchFeatures } from "../../../helpers/users/commonHelper";
import BodyType from "../../admin/models/body-type";
import City from "../../admin/models/city";
import Fuel from "../../admin/models/fuel";
import State from "../../admin/models/state";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import FeatureSpecification from "../../features-and-specification/models/feature-specification";
import SpecificationCategory from "../../features-and-specification/models/specifications-category";
import Products from "../../product/models/product-model";
import ProductFeatures from "../../product/models/product-specification";
import BookTestDrive from "../models/book-testdrive";
import CreateBuyLead from "../models/create-buy-lead";
const request = require('request');
import http from 'http';
import axios from "axios";
import { SALES_FORCE } from "../../../config";
import { Secret } from "jsonwebtoken";
import { sendEmail } from "../../../helpers/common_helper";
import { convertTimeStamp } from "../../../helpers/admin/Helper";
import fs from 'fs';

const productDIR = 'public/products/';
const SALES_FORCE_URL: Secret = SALES_FORCE!;

//  -------------------------- Filter Component Start ----------------------------- //
const buyPageProducts = async (req: Request, res: Response) => {
    try {
        const query = req.query;

        let brands: any = ''
        let splitBrandSlug: any = ''
        let bodyTypes: any = '';
        let splitBodyTypes: any = '';
        let fuelTypes: any = '';
        let splitFuelTypes: any = '';
        let priceVal: any = '';
        let splitPriceVal: any = '';
        let yearVal: any = ''
        let splitYearVal: any = '';
        let kmsVal: any = '';
        let splitKMsVal: any = '';
        const products: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        let sortFilter: any = { price: -1 };

        let getProductBanner: any = [];
        let buildQuery: any = {};

        let fetchBrandId: any = [];
        let brandId: any = [];

        // Get Brands Slug
        if (query.brands !== undefined) {
            brands = query.brands;
            splitBrandSlug = brands.split(',') ? brands.split(',') : brands;

            for (let i = 0; i < splitBrandSlug.length; i++) {
                fetchBrandId = await Brands.find({ 'brand_slug': splitBrandSlug[i] }).select('_id').where({ brand_status: 1 });
                brandId.push(fetchBrandId);
            }
            const brand_id: any = [].concat.apply([], brandId)
            buildQuery.brand_id = { $in: brand_id };
            sortFilter = { createdAt: -1 };
        }

        let fetchBodyTypeId: any = [];
        // Get Body Type Slug
        if (query.body_type !== undefined) {
            bodyTypes = query.body_type;
            splitBodyTypes = bodyTypes.split(',');
            const pushBodyTypes: any = [];
            for (let i = 0; i < splitBodyTypes.length; i++) {
                fetchBodyTypeId = await BodyType.find({ 'body_slug': splitBodyTypes[i] }).select('_id').where({ body_status: 1 });
                pushBodyTypes.push(fetchBodyTypeId)
            }
            const bodyTypes_id: any = [].concat.apply([], pushBodyTypes);
            buildQuery.body_type = { $in: bodyTypes_id };
            sortFilter = { createdAt: -1 };
        }

        let fethFuelTypeId: any = [];
        let pushFuelType: any = [];
        // Get Fuel Type Slug
        if (query.fuel_type !== undefined) {
            fuelTypes = query.fuel_type;
            splitFuelTypes = fuelTypes.split(',');
            for (let i = 0; i < splitFuelTypes.length; i++) {
                fethFuelTypeId = await Fuel.find({ 'fuel_slug': { $in: splitFuelTypes[i] } }).select('_id').where({ fuel_status: 1 });
                pushFuelType.push(fethFuelTypeId);
            }
            const fuelTypeId: any = [].concat.apply([], pushFuelType);
            buildQuery.fuel_type = { $in: fuelTypeId };
            sortFilter = { createdAt: -1 };
        }

        // Get Price from range Sliders
        if (query.price !== undefined) {
            priceVal = query.price;
            splitPriceVal = priceVal.split(',');
            let getProductMaxPrice: any = [];

            // Get Max price from Product Schema
            getProductMaxPrice = await Products.findOne({}).where({ product_type_status: 1, product_status: "live" }).sort({ 'price': 'desc' });


            // If find 1CR in price query parameter then code will be highest max product price
            if (splitPriceVal[1] === '1Cr ') {
                splitPriceVal[1] = getProductMaxPrice.price;
            } else if (splitPriceVal[1] === '10000000') {

                splitPriceVal[1] = getProductMaxPrice.price;
            }
            buildQuery.price = { $gte: splitPriceVal[0], $lte: splitPriceVal[1] }
            sortFilter = { price: 1 };
        }

        if (query.year !== undefined) {
            yearVal = query.year;
            splitYearVal = yearVal.split(',');
            buildQuery.registration_year = { $gte: splitYearVal[0], $lte: splitYearVal[1] };
            sortFilter = { registration_year: -1 };
        }

        if (query.kms !== undefined) {
            kmsVal = query.kms;
            splitKMsVal = kmsVal.split(',');
            buildQuery.kms_driven = { $gte: splitKMsVal[0], $lte: splitKMsVal[1] }
            sortFilter = { kms_driven: 1 };
        }

        if (query.availability !== undefined && query.availability !== 'all') {
            const productStatus: any = query.availability ? query.availability === 'all' ? '' : query.availability : 'live';
            buildQuery.product_status = productStatus
        }

        let product_status: any = ''
        if (query.availability !== undefined && query.availability !== 'all') {
            const productStatus: any = query.availability ? query.availability : 'live';
            product_status = productStatus
            sortFilter = { createdAt: -1 };
        } else {
            product_status = "live";
            sortFilter = { createdAt: -1 };
        }

        let filterValue: any = '';
        if (query.filter !== undefined) {
            let filters = query.filter;
            if (filters === 'recently-added') {
                sortFilter = { createdAt: -1 };
            }
            else if (filters === 'price-low-to-high') {
                sortFilter = { price: 1 }
            }
            else if (filters === 'price-high-to-low') {
                sortFilter = { price: -1 };
            }
            else if (filters === 'km-high-to-low') {
                sortFilter = { kms_driven: -1 };
            }
            else if (filters === 'km-low-to-high') {
                sortFilter = { kms_driven: 1 };
            }
        } else {
            sortFilter = { price: -1 };
        }

        const productList = await Products.find(buildQuery).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug"] }
        ]).where({ product_type_status: 1, product_status: product_status }).sort(sortFilter)
            .skip(skip).limit(limit).allowDiskUse(true).exec();

        productList.forEach((product) => {
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

        const liveProductCount = await Products.countDocuments(buildQuery).where({ product_type_status: 1, product_status: "live" }).sort(sortFilter);

        const bookedProductCount = await Products.countDocuments(buildQuery).where({ product_type_status: 1, product_status: "booked" }).sort(sortFilter);

        const soldProductCount = await Products.countDocuments(buildQuery).where({ product_type_status: 1, product_status: "sold" }).sort(sortFilter);

        let bookedProdcut: any = [];
        let soldProduct: any = []
        if (productList.length === 0) {

            if (product_status !== "sold" && product_status !== "booked") {



                bookedProdcut = await Products.find(buildQuery).populate([
                    { path: "brand_id", select: ["brand_name", "brand_slug"] },
                    { path: "model_id", select: ["model_name", "model_slug"] },
                    { path: "variant_id", select: ["variant_name"] },
                    { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
                    { path: "body_type", select: ["body_name", "body_slug"] },
                    { path: "product_location", select: ["center_name", "center_slug"] }
                ]).where({ product_type_status: 1, product_status: "booked" }).sort(sortFilter)

                bookedProdcut.forEach((product: any) => {
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

            }



            if (bookedProdcut.length === bookedProdcut.length && productList.length === 0 && product_status !== "sold" && product_status !== "booked") {


                soldProduct = await Products.find(buildQuery).populate([
                    { path: "brand_id", select: ["brand_name", "brand_slug"] },
                    { path: "model_id", select: ["model_name", "model_slug"] },
                    { path: "variant_id", select: ["variant_name"] },
                    { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
                    { path: "body_type", select: ["body_name", "body_slug"] },
                    { path: "product_location", select: ["center_name", "center_slug"] }
                ]).where({ product_type_status: 1, product_status: "sold" }).sort(sortFilter)

                soldProduct.forEach((product: any) => {
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
            }
        }

        getProductBanner = await Products.findOne({ product_banner: '1' }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_full_address"] }
        ]).where({ product_type_status: 1, product_status: "live" }).sort({ updatedAt: -1 }).limit(1);

        let productBanner: any = '';

        if (getProductBanner) {
            productBanner = {
                _id: getProductBanner._id,
                brand_id: getProductBanner.brand_id,
                model_id: getProductBanner.model_id,
                variant_id: getProductBanner.variant_id,
                name: getProductBanner.product_name,
                slug: getProductBanner.product_slug,
                registration_year: getProductBanner.registration_year,
                registration_state: getProductBanner.registration_state,
                kms_driven: getProductBanner.kms_driven,
                product_ownership: getProductBanner.product_ownership,
                fuel_type: getProductBanner.fuel_type,
                price: getProductBanner.price,
                short_description: getProductBanner.short_description,
                image: getProductBanner.product_image ? getProductBanner.product_image : '',
                product_banner: getProductBanner.product_banner,
                sell_status: getProductBanner.product_status,
                status: getProductBanner.product_type_status,
                manufacturing_year: getProductBanner.manufacturing_year,
                engine_cc: getProductBanner.engine_cc,
                body_type: getProductBanner.body_type,
                insurance_type: getProductBanner.insurance_type,
                insurance_valid: getProductBanner.insurance_valid,
                product_location: getProductBanner.product_location,
                page_title: getProductBanner.page_title,
                meta_keywords: getProductBanner.meta_keywords,
                meta_description: getProductBanner.meta_description,
                meta_other: getProductBanner.meta_other,
                product_emi: getProductBanner.product_monthely_emi ? getProductBanner.product_monthely_emi : '',
                booking_amount: getProductBanner.product_booking_amount ? getProductBanner.product_booking_amount : '',
                registration_number: getProductBanner.registration_number ? getProductBanner.registration_number : '',
                image_carousel: getProductBanner.image_carousel ? getProductBanner.image_carousel : '',
                image_360: getProductBanner.image_360
            }
        }

        const countProduct = await Products.countDocuments(buildQuery).where({ product_type_status: 1 }).sort({ createdAt: -1 });
        // const allProducts = [...liveProductCount, ...bookedProductCount, ...soldProductCount];

        res.status(200).json({ status: 1, products, productBanner, productCount: countProduct, liveProductCount, bookedProductCount, soldProductCount });

    } catch (e) {
        res.status(500).json({ status: 1, message: 'Something went wrong.' });
    }
}

const buyPageProductsWithBrand = async (req: Request, res: Response) => {
    try {
        const brand_slug: any = req.params.slug;
        const query = req.query;

        const products: any = [];
        const productDIR = 'public/products/'
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        let sortFilter: any = { price: -1 };
        let buildQuery: any = []


        let filterValue: any = '';
        if (query.filter !== undefined) {
            let filters = query.filter;
            if (filters === 'recently-added') {
                sortFilter = { createdAt: -1 };
            }
            else if (filters === 'price-low-to-high') {
                sortFilter = { price: 1 };
            }
            else if (filters === 'price-high-to-low') {
                sortFilter = { price: -1 };
            }
            else if (filters === 'km-high-to-low') {
                sortFilter = { kms_driven: -1 };
            }
            else if (filters === 'km-low-to-high') {
                sortFilter = { kms_driven: 1 };
            }
        } else {
            sortFilter = { price: -1 };
        }

        let product_status: any = ''
        if (query.availability !== undefined) {
            const productStatus: any = query.availability ? query.availability : 'live';
            product_status = productStatus
        } else {
            product_status = "live";
        }
        let getProductBanner: any = [];

        const fetchBrandId = await Brands.findOne({ 'brand_slug': brand_slug }).select('_id').where({ brand_status: 1 });

        // let productList = [];
        const productList = await Products.find({ brand_id: fetchBrandId }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug"] }
        ]).where({ product_type_status: 1, product_status: product_status }).sort(sortFilter)
            .skip(skip).limit(limit).allowDiskUse(true).exec();



        productList.forEach((product) => {
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

        const liveProductCount = await Products.countDocuments({ brand_id: fetchBrandId }).where({ product_type_status: 1, product_status: "live" }).sort(sortFilter);

        const bookedProductCount = await Products.countDocuments({ brand_id: fetchBrandId }).where({ product_type_status: 1, product_status: "booked" }).sort(sortFilter);

        const soldProductCount = await Products.countDocuments({ brand_id: fetchBrandId }).where({ product_type_status: 1, product_status: "sold" }).sort(sortFilter);



        if (productList.length === productList.length || productList.length === 0) {

            const bookedProdcut = await Products.find({ brand_id: fetchBrandId }).populate([
                { path: "brand_id", select: ["brand_name", "brand_slug"] },
                { path: "model_id", select: ["model_name", "model_slug"] },
                { path: "variant_id", select: ["variant_name"] },
                { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
                { path: "body_type", select: ["body_name", "body_slug"] },
                { path: "product_location", select: ["center_name", "center_slug"] }
            ]).where({ product_type_status: 1, product_status: "booked" }).sort(sortFilter)

            bookedProdcut.forEach((product) => {
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


            if (bookedProdcut.length === bookedProdcut.length && productList.length === 0 || productList.length === productList.length) {

                const soldProduct = await Products.find({ brand_id: fetchBrandId }).populate([
                    { path: "brand_id", select: ["brand_name", "brand_slug"] },
                    { path: "model_id", select: ["model_name", "model_slug"] },
                    { path: "variant_id", select: ["variant_name"] },
                    { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
                    { path: "body_type", select: ["body_name", "body_slug"] },
                    { path: "product_location", select: ["center_name", "center_slug"] }
                ]).where({ product_type_status: 1, product_status: "sold" }).sort(sortFilter)

                soldProduct.forEach((product) => {
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
            }
        }

        getProductBanner = await Products.findOne({ brand_id: fetchBrandId, product_banner: 1 }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_full_address"] }
        ]).where({ product_type_status: 1, product_status: "live" }).sort({ updatedAt: -1 });

        let productBanner: any = {}
        if (getProductBanner) {
            productBanner = {
                _id: getProductBanner._id,
                brand_id: getProductBanner.brand_id,
                model_id: getProductBanner.model_id,
                variant_id: getProductBanner.variant_id,
                name: getProductBanner.product_name,
                slug: getProductBanner.product_slug,
                registration_year: getProductBanner.registration_year,
                registration_state: getProductBanner.registration_state,
                kms_driven: getProductBanner.kms_driven,
                product_ownership: getProductBanner.product_ownership,
                fuel_type: getProductBanner.fuel_type,
                price: getProductBanner.price,
                short_description: getProductBanner.short_description,
                image: getProductBanner.product_image ? getProductBanner.product_image : '',
                product_banner: getProductBanner.product_banner,
                sell_status: getProductBanner.product_status,
                status: getProductBanner.product_type_status,
                manufacturing_year: getProductBanner.manufacturing_year,
                engine_cc: getProductBanner.engine_cc,
                body_type: getProductBanner.body_type,
                insurance_type: getProductBanner.insurance_type,
                insurance_valid: getProductBanner.insurance_valid,
                product_location: getProductBanner.product_location,
                page_title: getProductBanner.page_title,
                meta_keywords: getProductBanner.meta_keywords,
                meta_description: getProductBanner.meta_description,
                meta_other: getProductBanner.meta_other,
                product_emi: getProductBanner.product_monthely_emi ? getProductBanner.product_monthely_emi : '',
                image_360: getProductBanner.image_360
            }
        }

        // const countProduct = await Products.countDocuments(buildQuery).where({ product_type_status: 1 }).sort({ createdAt: -1 });

        const allProductForCount = await Products.find({ brand_id: fetchBrandId }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug"] }
        ]).where({ product_type_status: 1 }).sort({ createdAt: -1 });

        const countProduct = allProductForCount.length;

        const slugPageDetail = await Brands.findOne({ brand_slug: brand_slug });

        // console.log('slugPageDetail :', slugPageDetail);

        res.status(200).json({ status: 1, products, productBanner, productCount: countProduct, liveProductCount, bookedProductCount, soldProductCount, brandDetail: slugPageDetail });

    } catch (e) {
        res.status(500).json({ status: 1, message: 'Something went wrong.' });
    }
}


const fetchModelsByBrands = async (req: Request, res: Response) => {

    try {
        const brand_slug: any = req.params.slug;

        const models: any = [];
        if (!brand_slug) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }
        const fetchBrandId = await Brands.findOne({ 'brand_slug': brand_slug }).select('_id').where({ brand_status: 1 });

        const fetchModels = await BrandModel.find({ 'brand_id': { $in: fetchBrandId!._id } }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] }
        ]).where({ model_status: 1 });
        if (!fetchModels) {
            return res.status(404).json({ status: 2, message: 'Not dound!' });
        }

        fetchModels.forEach((model) => {
            models.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
                slug: model.model_slug,
            })
        })

        res.status(200).json({ status: 1, brand_models: models });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchvariantsByModelForBuyPage = async (req: Request, res: Response) => {
    try {
        const model_slug = req.params.slug;
        const modelVariants: any = [];
        if (!model_slug) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }

        const fetchModelId = await BrandModel.findOne({ model_slug }).where({ model_status: 1 });

        const fetchVariants = await ModelVariant.find({ model_id: fetchModelId!._id }).where({ variant_status: 1 });
        if (!fetchVariants) {
            return res.status(404).json({ status: 2, message: 'Not dound!' });
        }
        fetchVariants.forEach((variant) => {
            modelVariants.push({
                _id: variant._id,
                name: variant.variant_name,
                slug: variant.variant_slug,
            })
        });
        res.status(200).json({ status: 1, model_variants: modelVariants });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const generateBuyPageLead = async (req: Request, res: Response) => {

    try {
        const body = req.body;
        // console.log(body);
        const brandId = await fetchBrandIdBuyBrandSlug(body.select_brand);
        if (!brandId) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.' });
        }

        const modelId = await fetchModelIdBuyModelSlug(body.select_model, brandId);
        if (!modelId) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.' });
        }

        const variantId = await fetchVariantIdBuyVariantSlug(body.select_variant, modelId, brandId);
        if (!variantId) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.' });
        }

        const leadData = {
            first_name: req.user?.first_name ? req.user?.first_name : '',
            last_name: req.user?.last_name ? req.user?.last_name : '',
            brand_id: brandId,
            model_id: modelId,
            variant_id: variantId,
            year: body.select_year,
            kms_driven: body.enter_kms,
            lead_contact: req.user?.mobile,
            lead_type: body.lead_type
        }

        const createLead = new CreateBuyLead(leadData);

        await createLead.save();


        const salesForceleadData = {
            "First Name": req.user?.first_name ? req.user?.first_name : '',
            "Last Name": req.user?.last_name ? req.user?.last_name : '',
            "WhatsApp": req.user?.mobile,
            "Email": req.user?.email,
            "Lead Type": body.lead_type,
            "Lead_Category": "Individual",
            "Make": body.brandName,
            "Model": body.modelName,
            "Varient": body.variantName,
            "Year": body.selectYear,
            "Kms_Driven": body.enter_kms
        };


        if (createLead.lead_type === "Buy") {


            const emails = ["kamlesh.kumar@luxuryride.in"];
            const cc = ["himanshu.arya@luxuryride.in", "vikram.pannu@luxuryride.in"];

            // const emails = ["raghavendra.dixit@grapesdigital.com"];
            // const cc = ["soli.gupta@grapesdigital.com", "apurav.gupta@grapesdigital.com", "kamlesh.kumar@luxuryride.in"];

            const subject = "Buy Lead For: " + req.user?.mobile;

            const message = `
            <table border="1"  cellpadding="7">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Contact</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Variant</th>
                        <th>Year</th>
                        <th>KMs Driven</th>
                        <th>Created At</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>${req.user?.first_name ? req.user?.first_name : ''} ${req.user?.last_name ? req.user?.last_name : ''}</td>
                        <td>${req.user?.mobile}</td>
                        <td>${body.brandName}</td>
                        <td>${body.modelName}</td>
                        <td>${body.variantName}</td>
                        <td>${body.selectYear}</td>
                        <td>${body.enter_kms}</td>
                        <td>${convertTimeStamp(createLead.createdAt)}
                        </td>
                    </tr>
                 </tbody>
            </table>`;

            sendEmail(emails, cc, subject, message);
        }

        // await axios.post(`${SALES_FORCE_URL}LeadCreate`, salesForceleadData).then((res) => {

        // }).catch((e) => {

        // });
        res.status(201).json({ status: 1, message: 'Thank you for your interest in Luxury Ride. Please wait, our representative will contact you shortly.', lead: createLead });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}



const fetchProductDetail = async (req: Request, res: Response) => {
    try {
        const productDIR = 'public/products/'
        const productSlug = req.params.productSlug;
        if (!productSlug) {
            return res.status(400).json({ status: 2, message: 'Something went wrong. Please refresh the page and click again!' });
        }
        const productDetail = await Products.findOne({ product_slug: productSlug }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_full_address"] }
        ]).where({ product_type_status: 1 });
        // , product_status: "live" 


        // const $whereQuery: any = {
        //     lookup_id: productDetail!._id
        // }
        // console.log($whereQuery)
        // console.log(`https://api.helloviewer.io/application_products?where=${$whereQuery}`);
        // request(`https://api.helloviewer.io/application_products?where=${$whereQuery}`, (err: Error, response: Response, body: Body) => {
        //     // console.log('Error : ', err)
        //     // console.log('Response : ', response)
        //     // console.log('Body : ', body)
        // })

        // http.get(`https://api.helloviewer.io/application_products?where=${$whereQuery}`, (res) => {
        //     // console.log(res);
        //     const { statusCode } = res;
        //     console.log(statusCode)
        // })

        //643f6362f7e36001c4238336        https://api.helloviewer.io/application_products?where=$whereQuery
        if (!productDetail) {
            return res.status(404).json({ status: 2, message: 'Not found' });
        }
        const product = {
            _id: productDetail!._id,
            brand_id: productDetail.brand_id,
            model_id: productDetail.model_id,
            variant_id: productDetail.variant_id,
            name: productDetail.product_name,
            slug: productDetail.product_slug,
            registration_year: productDetail.registration_year,
            registration_state: productDetail.registration_state,
            kms_driven: productDetail.kms_driven,
            product_ownership: productDetail.product_ownership,
            fuel_type: productDetail.fuel_type,
            price: productDetail.price,
            short_description: productDetail.short_description,
            image: productDetail.product_image ? productDetail.product_image : '',
            product_banner: productDetail.product_banner,
            sell_status: productDetail.product_status,
            status: productDetail.product_type_status,
            manufacturing_year: productDetail.manufacturing_year,
            engine_cc: productDetail.engine_cc,
            body_type: productDetail.body_type,
            insurance_type: productDetail.insurance_type,
            insurance_valid: productDetail.insurance_valid,
            product_location: productDetail.product_location,
            page_title: productDetail.page_title,
            meta_keywords: productDetail.meta_keywords,
            meta_description: productDetail.meta_description,
            meta_other: productDetail.meta_other,
            product_emi: productDetail.product_monthely_emi ? productDetail.product_monthely_emi : '',
            booking_amount: productDetail.product_booking_amount ? productDetail.product_booking_amount : '',
            registration_number: productDetail.registration_number ? productDetail.registration_number : '',
            image_360: productDetail.image_360
        }

        const fethAllFeatureCategory = await ProductFeatures.find({ fs_product_id: product._id }).populate([
            { path: "fs_category_id", select: ["name", "slug"] }
        ]).where({ fs_status: 1 }).select("fs_category_id").distinct('fs_category_id');


        const fetchcategoryDetails = await fetchFeatureCategorydetails(fethAllFeatureCategory);



        // console.log(fetchcategoryDetails);

        // fetchAllFeatures.forEach((feature) => {


        // });

        {/**
     {
        "$lookup": {
            "from": "users",
            "localField": "followers",
            "foreignField": "_id",
            "as": "follower"
        }
    },
    
    */}

        res.status(200).json({ status: 1, product, featureCategory: fetchcategoryDetails });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllFaeturesByCategory = async (req: Request, res: Response) => {
    try {
        const cateId: any = req.params.id;
        const product_id = req.query.product_id;
        const features: any = [];
        if (!cateId) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }

        const allFeatures = await ProductFeatures.find({ fs_product_id: product_id, fs_category_id: cateId, fs_value: { $ne: '-' } }).populate([
            { path: "fs_id", select: ["feature_name", "feature_icon"] }
        ]).where({ fs_status: 1 });

        allFeatures.forEach((fetu) => {
            features.push({
                _id: fetu._id,
                fs_id: fetu.fs_id,
                fs_value: fetu.fs_value,
                fs_status: fetu.fs_status
            })
        })
        res.status(200).json({ status: 1, features })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchLinkedProducts = async (req: Request, res: Response) => {
    try {
        const product_slug: any = req.params.productSlug;
        let productsData: any = [];
        let testForEachData: any = [];
        const fetchProduct = await Products.findOne({ product_slug }).where({ product_status: "live", product_type_status: 1 });

        const fetchProductDetail = await linkedProductsHelper(fetchProduct?.product_linked_from);

        // console.log(fetchProductDetail);

        res.status(200).json({ status: 1, products: fetchProductDetail });
        // const linkedProducts = async (_id: any) => {
        //     const products: any = [];
        //     // let testForEachData: any = [];
        //     const linkedProduct = await Products.find({ '_id': { $in: _id } }).where({ product_status: "live", product_type_status: 1 });

        //     const testVar = [...linkedProduct];
        //     testVar?.forEach((product) => {
        //         products.push(product);
        //         if (product.product_linked_from !== '' || product.product_linked_from !== undefined) {
        //             linkedProducts(product.product_linked_from);
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
        //     const convSingleArray = [].concat.apply([], productsData);
        //     // testForEachData = convSingleArray;
        //     console.log(convSingleArray);
        //     // return convSingleArray;
        //     // res.status(200).json({ status: 1, linke_products: convSingleArray });
        //     // res.end();
        // }



        // const getProducts = await linkedProductsHelper(fetchProduct?.product_linked_from);

        // console.log(getProducts);
        // console.log('line');
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchCompareProducts = async (req: Request, res: Response) => {
    try {
        const products: any = [];
        const getProducts = await Products.find({}).where({ product_status: "live", product_type_status: 1 });

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

const fetchProductsByBrandAndModel = async (req: Request, res: Response) => {
    try {
        const brand_slug: any = req.query.brand_id;
        const model_slug: any = req.query.model_slug;
        const products: any = [];
        // const fetchBrandId = await Brands.findOne({ brand_slug }).where({ brand_status: 1 });
        const fetchModelId = await BrandModel.findOne({ model_slug }).where({ model_status: 1 });

        const getProducts = await Products.find({ brand_id: fetchModelId?.brand_id, model_id: fetchModelId?._id }).populate([
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
        ]).where({ product_status: "live", product_type_status: 1 });

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
                image_carousel: product.image_carousel ? product.image_carousel : '',
                image_360: product.image_360
            })
        });
        res.status(200).json({ status: 1, products });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchFeatureCategoriesByProduct = async (req: Request, res: Response) => {
    try {
        const fetchFeatureCatByProducts = await ProductFeatures.find({}).select('fs_category_id').distinct('fs_category_id').where({ fs_status: 1 });


        const catDetails = await fetchFeatureCategorydetails(fetchFeatureCatByProducts);

        // console.log(catDetails);
        res.status(200).json({ status: 1, feature_category: catDetails });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllProductFaeturesByCategory = async (req: Request, res: Response) => {
    try {
        const cateId: any = req.query.cate_id;
        const productId: any = req.query.product_id;
        const features: any = [];
        if (!cateId) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }

        const allFeatures = await ProductFeatures.find({ fs_product_id: productId, fs_category_id: cateId }).populate([
            { path: "fs_id", select: ["feature_name", "feature_icon"] }
        ]).where({ fs_status: 1 });

        allFeatures.forEach((fetu) => {
            features.push({
                _id: fetu._id,
                fs_id: fetu.fs_id,
                fs_value: fetu.fs_value,
                fs_status: fetu.fs_status
            })
        });
        res.status(200).json({ status: 1, features })

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllFeaturesByCategory = async (req: Request, res: Response) => {
    try {
        const feature_id: any = req.query.feature_id;
        const features: any = [];
        if (!feature_id) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }
        const fetchSpecName = await FeatureSpecification.find({ feature_id: feature_id }).where({ feature_status: 1 });

        if (!fetchSpecName) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.Please try again.' });
        }

        fetchSpecName.forEach((fetu) => {
            features.push({
                _id: fetu._id,
                feature_name: fetu.feature_name,
            })
        });
        res.status(200).json({ status: 1, features });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchCitiesByStateName = async (req: Request, res: Response) => {
    try {
        const stateName: any = req.query.state;
        if (!stateName) {
            return res.status(400).json({ status: 2, messaage: 'Something went wrong. Please refresh the page and click again!' });
        }

        const getStateId = await State.findOne({ province_title: stateName });

        if (!getStateId) {
            return res.status(400).json({ status: 2, messaage: 'Something went wrong. Please refresh the page and click again!' });
        }

        const fetchCities = await City.find({ state_id: getStateId.province_id });

        res.status(200).json({ status: 1, cities: fetchCities });


    } catch (e) {
        res.status(500).json({ status: 0, messgae: 'No Cities found!' });
    }
}


const bookTestDrive = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const bookedData = {
            user_first_name: body.first_name ? body.first_name : req.user?.first_name !== '' && req.user?.first_name !== undefined ? req.user?.first_name : 'User',
            user_last_name: body.last_name ? body.last_name : req.user?.last_name !== '' && req.user?.last_name !== undefined ? req.user?.last_name : 'User',
            user_contact: req.user?.mobile,
            user_address: body.drive_full_address ?? '',
            user_landmark: body.landmark ?? '',
            user_city: body.city ?? '',
            user_state: body.state ?? '',
            test_drive_date: body.book_date ?? '',
            test_drive_time: body.book_time ?? '',
            experience_center: body.experience_center ?? '',
            user_lat: '',
            user_long: '',
            product_id: body.product_id ?? '',
            pin_code: body.pincode ?? '',
            user_id: req.user?._id,
            test_drive_order_id: 'LR-TD' + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9)
        }

        const testDrive = new BookTestDrive(bookedData);


        const product = await Products.findById({ _id: body.product_id }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_full_address"] }
        ]);
        const brandName = await Brands.findById({ _id: product!.brand_id._id }).select('brand_name');


        const modelName = await BrandModel.findById({ _id: product!.model_id._id }).select("model_name");

        const variantName = await ModelVariant.findById({ _id: product!.variant_id._id }).select("variant_name");

        const fuelType = await Fuel.findById({ _id: product!.fuel_type._id })
        // console.log(product.product_location._id);
        // console.log(product.body_type!._id);
        const bodyType = await BodyType.findById({ _id: product!.body_type!._id }).select("body_name");

        const productLocation = await ExperienceCenter.findById({ _id: product!.product_location._id }).select("center_name");







        const salesForceTestDrive = {
            "IsTestDrive": "Yes",
            "AccountWrap": {
                "AccountId": req.user!.salesforce_account_id ? req.user!.salesforce_account_id : '',
                "Phone": req.user?.mobile,
                "FirstName": body.first_name ? body.first_name : req.user?.first_name !== '' && req.user?.first_name !== undefined ? req.user?.first_name : 'User',
                "LastName": body.last_name ? body.last_name : req.user?.last_name !== '' && req.user?.last_name !== undefined ? req.user?.last_name : 'User',
                "BillingStreet": body.drive_full_address ?? '',
                "BillingCity": body.city ?? '',
                "BillingState": body.state ?? '',
                "BillingPostalCode": body.pincode ?? '',
                "BillingCountry": "India"
            },
            "OpportunityWrap": {
                "Appointment_Status": "Confirmed",
                "Name": product!.product_name,
                "Location": body.experience_center_name,
                "Preferred_Date": body.book_date ?? '',
                "Preferred_Time": body.book_time ?? '',
                "OpportunityLineItemWrap": {
                    "Product2Id": product?.sales_force_id
                }
            }
        }

        // await axios.post(`${SALES_FORCE_URL}createOppAndAcc`, salesForceTestDrive, {
        //     headers: {
        //         'Content-Type': "application/json",
        //     }
        // }).then(async (response) => {
        //     if (!req.user!.salesforce_account_id) {
        //         req.user!.salesforce_account_id = response.data.AccountId;
        //         req.user?.save();
        //     }
        //     testDrive.test_drive_OpportunityId = response.data.OpportunityId
        // }).catch((e) => {

        // });

        // "OpportunityId": "0060T000005LA5MQAW",


        // console.log(product);
        testDrive.car_name = product!.product_name;
        testDrive.car_brand_name = brandName!.brand_name;
        testDrive.car_model_name = modelName!.model_name;
        testDrive.car_variant_name = variantName!.variant_name;
        testDrive.car_registration_year = product!.registration_year;
        testDrive.car_resgistration_state = product!.registration_state;
        testDrive.car_kms = product!.kms_driven;
        testDrive.car_ownership = product!.product_ownership;
        testDrive.car_fuel_type = fuelType!.fuel_name;
        testDrive.car_manufacturing_year = product!.manufacturing_year ? product!.manufacturing_year : '';
        testDrive.car_engine_cc = product!.engine_cc ? product!.engine_cc : '';
        testDrive.car_body_type = bodyType!.body_name;
        testDrive.car_insurance_type = product!.insurance_type ? String(product!.insurance_type) : '';
        testDrive.car_insurance_valid = product!.insurance_valid ? product!.insurance_valid : '';
        testDrive.car_location = productLocation!.center_name;
        testDrive.car_color = product!.product_color

        await testDrive.save();


        const emails = ["kamlesh.kumar@luxuryride.in"];
        const cc = ["himanshu.arya@luxuryride.in", "vikram.pannu@luxuryride.in"];

        // const emails = ["raghavendra.dixit@grapesdigital.com"]
        // const cc = ["soli.gupta@grapesdigital.com", "apurav.gupta@grapesdigital.com", "kamlesh.kumar@luxuryride.in"]

        const subject = "Test Drive For: " + req.user?.mobile;

        const message = `
        <table border="1"  cellpadding="7">
    <thead>
        <tr>
            <th>User Name</th>
            <th>User Contact</th>
            <th>Test Drive Date</th>
            <th>Test Drive Time</th>
            <th>Product Name</th>
            <th>Car Location</th>
            <th>Created At</th>
        </tr>
    </thead>

<tbody>
    <tr>
        <td>${body.first_name ? body.first_name : req.user?.first_name !== '' && req.user?.first_name !== undefined ? req.user?.first_name : 'User' + body.last_name ? body.last_name : req.user?.last_name !== '' && req.user?.last_name !== undefined ? req.user?.last_name : 'User'}
        </td>
        <td>${req.user?.mobile}</td>
        <td>${new Date(testDrive.test_drive_date).toLocaleDateString('en-IN', { weekday: 'long' })}, ${new Date(testDrive.test_drive_date).getDate()} ${new Date(testDrive.test_drive_date).toLocaleDateString('en-IN', { month: 'long' })} ${new Date(testDrive.test_drive_date).getFullYear()}
        </td>
        <td>${testDrive.test_drive_time}</td>
        <td>${product!.product_name}</td>
        <td>${body.experience_center_name}</td>
        <td>${convertTimeStamp(testDrive.createdAt)}</td>
    </tr>
</tbody>

</table> `;

        sendEmail(emails, cc, subject, message);

        // console.log(bookedData.user_address);
        // console.log(bookedData.user_landmark);
        // console.log(bookedData.user_city);
        // console.log(bookedData.user_state);

        let checkExpericeCenterOrUserAddress = 0;
        if (bookedData.user_address === '' && bookedData.user_landmark === '' && bookedData.user_city === '' && bookedData.user_state === '') {
            checkExpericeCenterOrUserAddress = 1;
        }

        res.status(201).json({ status: 1, message: `${bookedData.user_first_name} your Test Drive Booked successfully! `, checkExperienceCenter: checkExpericeCenterOrUserAddress, testDrive });

        // 'Test drive not booked'
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


// const createLead = async (req: Request, res: Response) => {
//     try {

//     } catch (e) {
//         res.status(500).json({ status: 0, message: 'Something went wrong.' });
//     }
// }

const getProductMinMaxPrice = async (req: Request, res: Response) => {

    try {
        let price: any = {};
        const minPrice = await Products.findOne({}).where({ product_type_status: 1, product_status: "live" }).sort({ price: 1 });

        const maxPrice = await Products.findOne({}).where({ product_type_status: 1, product_status: "live" }).sort({ price: -1 });

        price.minPrice = minPrice?.price;
        price.maxPrice = maxPrice?.price;
        res.status(200).json({ status: 1, price });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getProductsAfterNoProductFound = async (req: Request, res: Response) => {
    try {
        const products: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const productList = await Products.find({}).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug"] }
        ]).where({ product_type_status: 1, product_status: "live" }).sort({ createdAt: -1 })
            .skip(skip).limit(limit);

        productList.forEach((product) => {
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
        res.status(200).json({ status: 1, products, productCount: products.length, });
    } catch (e) {
        res.status(500).json({ status: 0, message: `Something went wrong.` });
    }
}


const fetchBookedTestDriveByUser = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        const testDrive = await BookTestDrive.findById({ _id }).populate([
            { path: "experience_center", select: ["center_name", "center_full_address"] }
        ]);

        if (!testDrive) {
            return res.status(400).json({ status: 2, message: 'This action is not allowed at this time. Please refresh the page and click again.' });
        }

        res.status(200).json({ status: 1, testDrive });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const fetchGeneratedBuylead = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        const lead = await CreateBuyLead.findById({ _id }).populate([
            { path: "brand_id", select: ["brand_name"] },
            { path: "model_id", select: ["model_name"] },
            { path: "variant_id", select: ["variant_name"] },
        ]);

        if (!lead) {
            return res.status(400).json({ status: 2, message: 'This action is not allowed at this time. Please refresh the page and click again.' });
        }

        res.status(200).json({ status: 1, lead });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchBrandDetailBySlug = async (req: Request, res: Response) => {
    try {
        const brand_slug: any = req.params.slug;


        const slugPageDetail = await Brands.findOne({ brand_slug });

        if (!slugPageDetail) {
            return res.status(400).json({ status: 2, message: 'This action is not allowed at this time. Please refresh the page and click again.' });
        }

        res.status(200).json({ status: 1, brand: slugPageDetail });


    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { buyPageProducts, buyPageProductsWithBrand, fetchModelsByBrands, fetchvariantsByModelForBuyPage, generateBuyPageLead, fetchProductDetail, fetchAllFaeturesByCategory, fetchLinkedProducts, fetchCompareProducts, fetchProductsByBrandAndModel, fetchFeatureCategoriesByProduct, fetchAllProductFaeturesByCategory, fetchAllFeaturesByCategory, fetchCitiesByStateName, bookTestDrive, getProductMinMaxPrice, getProductsAfterNoProductFound, fetchBookedTestDriveByUser, fetchGeneratedBuylead, fetchBrandDetailBySlug }
