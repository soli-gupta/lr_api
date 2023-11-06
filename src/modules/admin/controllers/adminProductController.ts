import { Request, Response } from "express";
import Products from "../../product/models/product-model";
import Brands from "../../brand/model/brand";
// import BrandModel from "../../brand/model/brand-models";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import Fuel from "../models/fuel";
import BodyType from "../models/body-type";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import path from "path";
import fs from 'fs';
import ProductFeatures from "../../product/models/product-specification";
import FeatureSpecification from "../../features-and-specification/models/feature-specification";
import CarTradeImage from "../../product/models/car-trade-img-model";

import { S3Client, PutObjectCommand, S3 } from "@aws-sdk/client-s3"
import crypto from 'crypto'
import axios from "axios";
import { CAR_TRADE_URL, SALES_FORCE } from "../../../config";
import { Secret } from "jsonwebtoken";


const s3 = new S3Client({
    credentials: {
        accessKeyId: `AKIASEWJYHJ3N5LRSNCG`,
        secretAccessKey: `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`,
    },
    region: "ap-south-1",// this is the region that you select in AWS account
});

const carTradeId = ["CTE65175Z", "CTE65176P", "CTE65177G", "CTE65178C", "CTE64807T", "CTE64808R", "CTE64809B", "CTE64810A", "CTE64811C", "CTE64828D", "CTE64829V", "CTE64830G", "CTE64831H", "CTE64832I", "CTE64833X", "CTE64834V", "CTE64835Q", "CTE64836F", "CTE64837H", "CTE64853T", "CTE64854Q", "CTE64855D", "CTE64856U"];



const productImagePath = path.join(process.cwd(), '/public/products/');
const DIR = 'public/products/';
const BUCKET_URL = 'https://bucket-7vbln7.s3.ap-south-1.amazonaws.com/Lr-live/';
const SALES_FORCE_URL: Secret = SALES_FORCE!;



const createProduct = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const productData = {
            brand_id: body.brand_id ?? '',
            model_id: body.model_id ?? '',
            variant_id: body.variant_id ?? '',
            registration_year: body.registration_year ?? '',
            registration_state: body.registration_state ?? '',
            kms_driven: body.kms_driven ?? '',
            product_ownership: body.product_ownership ?? '',
            fuel_type: body.fuel_type ?? '',
            price: body.price ?? '',
            product_name: body.name ?? '',
            product_slug: body.slug ?? '',
            product_color: body.color ?? '',
            product_banner: body.product_banner ? body.product_banner : 2,
            // product_linked_from: body.linked_from ?? '',
            product_booking_amount: body.booking_amount ?? '',
            registration_number: body.registration_number ?? '',
            image_360: body.image_360 ?? '2'
            // short_description: body.short_description ?? '',
            // manufacturing_year: body.manufacturing_year ?? '',
            // engine_cc: body.engine_cc ?? '',
            // body_type: body.body_type ?? '',
            // insurance_type: body.insurance_type ?? '',
            // insurance_valid: body.insurance_valid ?? '',
            // product_location: body.product_location ?? '',
            // page_title: body.page_title ?? '',
            // meta_keywords: body.meta_keywords ?? '',
            // meta_description: body.meta_description ?? '',
            // meta_other: body.meta_other ?? ''
        }
        // console.log(productData);

        const checkProductSlug = await Products.findOne({ product_slug: productData.product_slug });

        if (checkProductSlug) {
            return res.status(400).json({ status: 2, message: `${productData.product_slug} already added. Please change the slug value and click to save again!` });
        }

        const addProduct = new Products(productData);

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ?? '';
            addProduct.product_image = uploadFile;
        }


        let generateCode: any = '';

        const checkCode = await Products.find().sort({ sku_code: - 1 }).limit(1);

        let uniqueCode: any = 0;
        if (checkCode[0].sku_code === undefined) {
            uniqueCode = 1;
        } else {
            uniqueCode = checkCode[0].sku_code + 1;
        }
        generateCode = uniqueCode;

        addProduct.sku_code = generateCode ? generateCode : '';


        // let checkvall = Object.keys(body.linked_from);
        // console.log(addProduct);

        // let getCheckVal = '';
        // checkvall.forEach((check) => {
        //     if (check === '0') {
        //         return 0;
        //     }
        //     getCheckVal = check;
        //     return getCheckVal;
        // })

        // addProduct.product_linked_from = getCheckVal !== '' && getCheckVal !== null ? body.linked_from : '';


        // var loanAmount = parseInt(addProduct.price) * 80 / 100;
        var loanAmount: any = addProduct.price;
        var interestRate = 12;
        var loanTenure = 5;

        // Calculate monthly interest rate and loan tenure in months
        var monthlyInterestRate = interestRate / 1200;
        var loanTenureInMonths = loanTenure * 12;
        // Calculate EMI
        var emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureInMonths) / (Math.pow(1 + monthlyInterestRate, loanTenureInMonths) - 1);

        addProduct.product_monthely_emi = emi.toFixed(0);




        await addProduct.save();


        const brandName = await Brands.findById({ _id: addProduct.brand_id }).select('brand_name');


        const modelName = await BrandModel.findById({ _id: addProduct.model_id }).select("model_name");

        const variantName = await ModelVariant.findById({ _id: addProduct.variant_id }).select("variant_name");

        const fuelType = await Fuel.findById({ _id: addProduct.fuel_type })


        const bodyType = await BodyType.findById({ _id: addProduct.body_type }).select("body_name");

        const productLocation = await ExperienceCenter.findById({ _id: addProduct.product_location }).select("center_name");



        const addProductSalesForce = {
            "product": {
                "Name": `${addProduct.product_name}`,
                "ProductCode": `${addProduct.sku_code}`,
                "IsActive": true,
                "DisplayUrl": `https://luxuryride.in/buy/product-detail/${addProduct.product_slug}`,
                "Body_Type__c": `${bodyType!.body_name}`,
                "Bulletin_Price_In_Lacs__c": addProduct.price,
                "Car_Receiving_Date__c": `${addProduct.createdAt}`,
                "Fuel__c": `${fuelType!.fuel_name}`,
                "KMS_Run__c": `${addProduct.kms_driven}`,
                "Make__c": `${brandName!.brand_name}`,
                "Updated_Model__c": `${modelName!.model_name}`,
                "Updated_Variant__c": `${variantName!.variant_name}`,
                "Serial_Owner__c": `${addProduct.product_ownership}`, "Inventory_Color__c": `${addProduct.product_color}`,
            }
        }

        await axios.post(`${SALES_FORCE_URL}sinkProduct`, addProductSalesForce, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            addProduct.sales_force_id = res.data.ProductId;
            await addProduct.save();
        }).catch((e) => console.log(e));

        const products = {
            _id: addProduct._id,
            name: addProduct.product_name,
            slug: addProduct.product_slug,
        }
        res.status(201).json({ status: 1, message: `${products.name} Added sucessfully!`, products })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const manageProductList = async (req: Request, res: Response) => {
    try {
        const products: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 50;
        const skip = (page - 1) * limit;
        const getAllProducts = await Products.find({}).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name", "variant_slug"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
        ]).skip(skip).limit(limit).sort({ createdAt: -1 });

        if (!getAllProducts) {
            return res.status(400).json({ status: 0, message: 'Not found!' });
        }

        getAllProducts.forEach((product) => {
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
                color: product.product_color,
                short_description: product.short_description,
                // image: product.product_image ? DIR + product.product_image : '',
                image: product.product_image ? product.product_image : '',
                product_banner: product.product_banner,
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
                linked_from: product.product_linked_from ? product.product_linked_from : '',
                booking_amount: product.product_booking_amount ? product.product_booking_amount : '',
                sku_code: product.sku_code ? product.sku_code : '',
                registration_number: product.registration_number ? product.registration_number : '',
                image_360: product.image_360
            })
        });
        // console.log(products.length);
        res.status(200).json({ status: 1, products: products, productCount: products.length });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewProduct = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const brandModels: any = [];
        const modelVariants: any = [];

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please referesh the page and click again!' });
        }

        const product = await Products.findById({ _id }).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name", "variant_slug"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
        ]);

        if (!product) {
            return res.status(404).json({ status: 0, message: 'Not Found!' });
        }

        const products = {
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
            color: product.product_color,
            short_description: product.short_description,
            image: product.product_image ? product.product_image : '',
            product_banner: product.product_banner,
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
            linked_from: product.product_linked_from ? product.product_linked_from : '',
            booking_amount: product.product_booking_amount ? product.product_booking_amount : '',
            sku_code: product.sku_code ? product.sku_code : '',
            registration_number: product.registration_number ? product.registration_number : '',
            image_360: product.image_360
        }


        const fetchModelsByBrand = await BrandModel.find({ brand_id: products.brand_id }).where({ model_status: 1 });

        fetchModelsByBrand.forEach((model) => {
            brandModels.push({
                _id: model._id,
                brand_id: model.brand_id,
                name: model.model_name,
            })
        });

        const getModelVariants = await ModelVariant.find({ brand_id: products.brand_id, model_id: products.model_id });

        getModelVariants.forEach((variant) => {
            modelVariants.push({
                _id: variant._id,
                name: variant.variant_name,
                slug: variant.variant_slug,
            })
        });

        const getCarTradeProduct = await CarTradeImage.findOne({ product_id: products._id });

        res.status(200).json({ status: 1, products, brand_model: brandModels, model_variants: modelVariants, carTradeImg: getCarTradeProduct });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateProduct = async (req: Request, res: Response) => {

    try {
        const _id = req.params.id;
        const body = req.body;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please referesh the page and click again!' });
        }

        const product = await Products.findById({ _id });

        if (!product) {
            return res.status(404).json({ status: 0, message: 'Something went wrong' });
        }

        product.product_name = body.name ? body.name : product.product_name;
        product.product_slug = body.slug ? body.slug : product.product_slug;
        product.brand_id = body.brand_id ? body.brand_id : product.brand_id;
        product.model_id = body.model_id ? body.model_id : product.model_id;
        product.variant_id = body.variant_id ? body.variant_id : product.variant_id;
        product.registration_year = body.registration_year ? body.registration_year : product.registration_year;
        product.registration_state = body.registration_state ? body.registration_state : product.registration_state;
        product.kms_driven = body.kms_driven ? body.kms_driven : product.kms_driven;
        product.product_ownership = body.product_ownership ? body.product_ownership : product.product_ownership;
        product.fuel_type = body.fuel_type ? body.fuel_type : product.fuel_type;
        product.price = body.price ? body.price : product.price;
        product.short_description = body.short_description ? body.short_description : product.short_description;
        product.product_status = body.status ? body.status : product.product_status;
        product.manufacturing_year = body.manufacturing_year ? body.manufacturing_year : product.manufacturing_year;
        product.engine_cc = body.engine_cc ? body.engine_cc : product.engine_cc;
        product.body_type = body.body_type ? body.body_type : product.body_type;
        product.insurance_type = body.insurance_type ? body.insurance_type : product.insurance_type;
        product.insurance_valid = body.insurance_valid ? body.insurance_valid : product.insurance_valid;
        product.product_location = body.product_location ? body.product_location : product.product_location;
        product.page_title = body.page_title ? body.page_title : product.page_title;
        product.meta_keywords = body.meta_keywords ? body.meta_keywords : product.meta_keywords;
        product.meta_description = body.meta_description ? body.meta_description : product.meta_description;
        product.meta_other = body.meta_other ? body.meta_other : product.meta_other;
        product.product_banner = body.product_banner ? body.product_banner : product.product_banner;
        product.product_booking_amount = body.booking_amount ? body.booking_amount : product.product_booking_amount;
        product.product_status = body.product_status ? body.product_status : product.product_status;
        product.registration_number = body.registration_number ? body.registration_number : product.registration_number;
        product.image_360 = body.image_360 ? body.image_360 : product.image_360;

        let productLinkedFrom: any = [];

        let getCheckVal: any = '';

        if (body.linked_from === undefined || body.linked_from === null) {

            getCheckVal = '';
        } else {

            let checkvall = Object.keys(body.linked_from);

            checkvall.forEach((check) => {
                if (check === '0') {
                    return 0;
                }
                getCheckVal = check;
                return getCheckVal;
            })
        }

        product.product_linked_from = getCheckVal !== '' && getCheckVal !== null ? body.linked_from : product.product_linked_from;

        let generateCode: any = '';
        if (product.sku_code === undefined || product.sku_code === null) {
            const checkCode = await Products.find().sort({ sku_code: - 1 }).limit(1);

            let uniqueCode: any = 0;
            if (checkCode[0].sku_code === undefined) {
                uniqueCode = 1;
            } else {
                uniqueCode = checkCode[0].sku_code + 1;
            }
            generateCode = uniqueCode;
        }
        product.sku_code = generateCode ? generateCode : product.sku_code;

        // const $get80Val = parseInt(productPrice) * parseInt(80) / 100;
        // let $calcInterestPerYear = (parseInt($get80Val) * parseInt(12) * parseInt(5)) / parseInt(100);
        // let $perMonthEMI = (parseInt($get80Val) + parseInt($calcInterestPerYear)) / parseInt(60);


        // const product80: any = parseInt(product.price) * 80 / 100;
        // const calcInterestPerYear: any = (product80 * 12 * 5) / 100;
        // const perMonthEMI: any = (product80 + calcInterestPerYear) / 60
        // // console.log('product80 : ', product80);
        // // console.log('calcInterestPerYear : ', calcInterestPerYear);
        // // console.log('perMonthEMI : ', perMonthEMI.toFixed(2));
        // product.product_monthely_emi = perMonthEMI.toFixed(2);



        // var loanAmount = parseInt(product.price) * 80 / 100;
        var loanAmount: any = product.price;
        var interestRate = 12;
        var loanTenure = 5;

        // Calculate monthly interest rate and loan tenure in months
        var monthlyInterestRate = interestRate / 1200;
        var loanTenureInMonths = loanTenure * 12;
        // Calculate EMI
        var emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureInMonths) / (Math.pow(1 + monthlyInterestRate, loanTenureInMonths) - 1);

        product.product_monthely_emi = emi.toFixed(0);

        // console.log(product.product_monthely_emi);

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : product.product_image;
            if (product.product_image) {
                fs.unlinkSync(productImagePath + product.product_image);
            }
            product.product_image = uploadFile;
        }

        await product.save();

        const products = {
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
            product_banner: product.product_banner,
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
            linked_from: product.product_linked_from ? product.product_linked_from : '',
            booking_amount: product.product_booking_amount ? product.product_booking_amount : '',
            sku_code: product.sku_code ? product.sku_code : '',
            monthely_emi: product.product_monthely_emi,
            registration_number: product.registration_number ? product.registration_number : '',
            image_360: product.image_360
        }


        const brandName = await Brands.findById({ _id: product.brand_id }).select('brand_name');


        const modelName = await BrandModel.findById({ _id: product.model_id }).select("model_name");

        const variantName = await ModelVariant.findById({ _id: product.variant_id }).select("variant_name");

        const fuelType = await Fuel.findById({ _id: product.fuel_type })


        const bodyType = await BodyType.findById({ _id: product.body_type }).select("body_name");

        const productLocation = await ExperienceCenter.findById({ _id: product.product_location }).select("center_name");

        const updateProductSalesForce = {
            "product": {
                "Id": `${product.sales_force_id}`,
                "Name": `${product.product_name}`,
                "ProductCode": `${product.sku_code}`,
                "IsActive": product.product_type_status == 1 ? true : false,
                "DisplayUrl": `https://luxuryride.in/buy/product-detail/${product.product_slug}`,
                "Body_Type__c": `${bodyType!.body_name}`,
                "Bulletin_Price_In_Lacs__c": product.price,
                "Car_Receiving_Date__c": `${product.createdAt}`,
                "Fuel__c": `${fuelType!.fuel_name}`,
                "KMS_Run__c": `${product.kms_driven}`,
                "Make__c": `${brandName!.brand_name}`,
                "Updated_Model__c": `${modelName!.model_name}`,
                "Updated_Variant__c": `${variantName!.variant_name}`,
                "Engine_CC__c": `${product.engine_cc}`,
                "Insurance__c": `${product.insurance_type}`,
                "Insurance_Valid_Till__c": `${product.insurance_valid}`,
                "Registration_State__c": `${product.registration_state}`,
                "Registration_Year__c": `${product.registration_year}`,
                "Manufacturing_Year__c": `${product.manufacturing_year}`,
                "Location__c": `${productLocation!.center_city}`,
                "Serial_Owner__c": `${product.product_ownership}`, "Inventory_Color__c": `${product.product_color}`,


            }
        }


        await axios.post(`${SALES_FORCE_URL}sinkProduct`, updateProductSalesForce, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => console.log(res)).catch((e) => console.log(e));


        res.status(200).json({ status: 1, products, message: `${products.name} updated successfully` });
    } catch (e) {
        //`Product not updated!` 
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnBlockProducts = async (req: Request, res: Response) => {
    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, message: 'This action is not allowed at this time. Pleae refresh the page and click again!' });
        }
        const product = await Products.findById({ _id });
        if (!product) {
            return res.status(404).json({ status: 0, message: 'Brand not found!' });
        }
        product.product_type_status = status;
        await product.save();

        const products = {
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
            product_banner: product.product_banner,
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
            linked_from: product.product_linked_from ? product.product_linked_from : '',
            booking_amount: product.product_booking_amount ? product.product_booking_amount : '',
            sku_code: product.sku_code ? product.sku_code : '',
            monthely_emi: product.product_monthely_emi,
            registration_number: product.registration_number ? product.registration_number : '',
            image_360: product.image_360
        }
        res.status(200).json({ status: 1, products, message: `${products.name} status changed successfully` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const addProductSpecification = async (req: Request, res: Response) => {
    // console.log(req.body);
    try {
        const body: any = req.body;
        const categoryId = body.category_id;
        const SpecificationId = body.specification_id;
        const specificationValue = body.specification_value;
        const product_id = body.product_id;
        let data: any = [];
        let ajsgd: any = [];
        let sdmn: any = [];
        categoryId.forEach((category: any) => {
            // console.log(SpecificationId);
            const mergeKeyValue = SpecificationId.reduce((acc: any, item: any, i: any) => {
                // acc[item] = specificationValue[i];
                // return acc;
                // const convByNameValue = mergeKeyValue.forEach((val: any) => {
                //     return {
                //         fs_category_id: category,
                //         fs_id: val,
                //         fs_value: val
                //     }
                //     // return data;

                // })
                // console.log(item);
                // console.log(specificationValue[i]);
                if (specificationValue[i] !== '') {
                    data.push({
                        fs_product_id: product_id,
                        fs_category_id: category,
                        fs_id: item,
                        fs_value: specificationValue[i],
                    });
                } else {
                    data.push({
                        fs_product_id: product_id,
                        fs_category_id: category,
                        fs_id: item,
                        fs_value: '-',
                    });
                }

                // const convData = {
                //     fs_category_id: category,
                //     fs_id: acc[item],
                //     fs_value: specificationValue[i]
                // }
                return data;
            }, {})
            const fetchFsData: any = [];

            // console.log(mergeKeyValue);
            mergeKeyValue.map(async (spec: any) => {
                const productSpecification = new ProductFeatures(spec);
                // console.log(productSpecification);
                await productSpecification.save();
                return productSpecification;
            });
            // ajsgd = mergeKeyValue.productSpecification;
            // sdmn = ajsgd;
            // console.log('askchj : ', mergeKeyValue);
            res.status(201).json({ status: 1, message: 'Specification added successfully!' });
        });
        // console.log(sdmn);

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchFeaturesByProduct = async (req: Request, res: Response) => {
    try {
        const product_id = req.params.productId;
        const allFeatures: any = [];
        if (!product_id) {
            return res.status(400).json({ status: 2, message: 'Something went wrong. Please referesh the page and click again!' });
        }

        const fetchFeatures = await ProductFeatures.find({ fs_product_id: product_id }).populate([
            { path: "fs_product_id", select: ["product_name", "product_slug"] },
            { path: "fs_category_id", select: ["name"] },
            { path: "fs_id", select: ["feature_name", "feature_icon"] }
        ]).where();

        if (!fetchFeatures) {
            return res.status(400).json({ sttaus: 2, message: 'Not found!' });
        }

        fetchFeatures.forEach((feature) => {
            allFeatures.push({
                _id: feature._id,
                name: feature.fs_value,
                product: feature.fs_product_id,
                feature_category: feature.fs_category_id,
                features_specifications: feature.fs_id,
                status: feature.fs_status,
                createdAt: feature.createdAt,
                updatedAt: feature.updatedAt
            })
        })

        res.status(200).json({ status: 1, feature_specification: allFeatures });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnBlockFeatures = async (req: Request, res: Response) => {

    try {
        const _id: any = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        if (!status) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const fetchFeature = await ProductFeatures.findById({ _id });

        if (!fetchFeature) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }

        fetchFeature.fs_status = status;

        await fetchFeature.save();

        res.status(200).json({ status: 1, message: `${fetchFeature.fs_value} Updated successfully!` });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getAllFeatureSpecification = async (req: Request, res: Response) => {
    try {
        const fetchFeatures: any = [];
        const fetchAllFeature = await FeatureSpecification.find({}).where({ feature_status: 1 });

        if (!fetchAllFeature) {
            return res.status(400).json({ status: 2, message: 'Something went wrong.' });
        }

        fetchAllFeature.forEach((feature) => {
            fetchFeatures.push({
                feature_id: feature._id,
                feature_name: feature.feature_name
            })
        })

        res.status(200).json({ status: 1, feature_specifications: fetchFeatures });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const getProductSpecificationDetail = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const feature = await ProductFeatures.findById({ _id });

        if (!feature) {
            return res.status(404).json({ status: 2, message: 'Not found!' });
        }
        res.status(200).json({ status: 1, feature_specification: feature });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateProductSpecification = async (req: Request, res: Response) => {
    try {
        const _id: any = req.params.id;
        const body: any = req.body;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }

        const feature = await ProductFeatures.findById({ _id });

        if (!feature) {
            return res.status(404).json({ status: 2, message: 'Not found!' });
        }
        feature.fs_id = body.specification_id[0] ? body.specification_id[0] : feature.fs_id;
        feature.fs_value = body.specification_value[0] ? body.specification_value[0] : feature.fs_value;
        await feature.save();
        res.status(200).json({ status: 1, message: 'Feature updated successfully!' });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllProductForLink = async (req: Request, res: Response) => {
    try {
        const products: any = [];
        const getAllProducts = await Products.find({}).populate([
            { path: "brand_id", select: ["brand_name", "brand_slug"] },
            { path: "model_id", select: ["model_name", "model_slug"] },
            { path: "variant_id", select: ["variant_name", "variant_slug"] },
            { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
            { path: "body_type", select: ["body_name", "body_slug"] },
            { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
        ]).where({ product_status: "live", product_type_status: 1 }).sort({ createdAt: -1 });

        getAllProducts.forEach((product) => {
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
                color: product.product_color,
                short_description: product.short_description,
                image: product.product_image ? product.product_image : '',
                product_banner: product.product_banner,
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
                linked_from: product.product_linked_from ? product.product_linked_from : '',
                monthely_emi: product.product_monthely_emi,
                sku_code: product.sku_code ? product.sku_code : '',
            })
        });
        res.status(200).json({ status: 1, products });
    } catch (e) {
        res.status(500).json({ status: 0, messsage: 'Something went wrong.' });
    }
}

const uploadCarTradeImages = async (req: Request, res: Response) => {

    try {
        const body: any = req.body;
        let addCarTradeImg: any = '';
        let carTradeActionName = 'luxuryride_update_stock';
        const carTradeData = {
            product_id: body.product_id
        }

        addCarTradeImg = await CarTradeImage.findOne({ product_id: carTradeData.product_id });



        if (!addCarTradeImg) {
            addCarTradeImg = new CarTradeImage(carTradeData);
            carTradeActionName = 'luxuryride_adding_stock';
        };


        const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

        if (files !== undefined) {

            // Exterior Images Start

            if (files.ext_img_1 && files.ext_img_1[0].fieldname === 'ext_img_1') {
                const uploadExt1 = files.ext_img_1[0].location ? files.ext_img_1[0].location : '';
                addCarTradeImg.ext_img_1 = uploadExt1;
                // S3.deleteObject()
            }

            if (files.ext_img_2 && files.ext_img_2[0].fieldname === 'ext_img_2') {
                const uploadExt2 = files.ext_img_2[0].location ? files.ext_img_2[0].location : '';
                addCarTradeImg.ext_img_2 = uploadExt2;
            }

            if (files.ext_img_3 && files.ext_img_3[0].fieldname === 'ext_img_3') {
                const uploadExt3 = files.ext_img_3[0].location ? files.ext_img_3[0].location : '';
                addCarTradeImg.ext_img_3 = uploadExt3;
            }

            if (files.ext_img_4 && files.ext_img_4[0].fieldname === 'ext_img_4') {
                const uploadExt4 = files.ext_img_4[0].location ? files.ext_img_4[0].location : '';
                addCarTradeImg.ext_img_4 = uploadExt4;
            }

            if (files.ext_img_5 && files.ext_img_5[0].fieldname === 'ext_img_5') {
                const uploadExt5 = files.ext_img_5[0].location ? files.ext_img_5[0].location : '';
                addCarTradeImg.ext_img_5 = uploadExt5;
            }

            if (files.ext_img_6 && files.ext_img_6[0].fieldname === 'ext_img_6') {
                const uploadExt6 = files.ext_img_6[0].location ? files.ext_img_6[0].location : '';
                addCarTradeImg.ext_img_6 = uploadExt6;
            }

            if (files.ext_img_7 && files.ext_img_7[0].fieldname === 'ext_img_7') {
                const uploadExt7 = files.ext_img_7[0].location ? files.ext_img_7[0].location : '';
                addCarTradeImg.ext_img_7 = uploadExt7;
            }

            if (files.ext_img_8 && files.ext_img_8[0].fieldname === 'ext_img_8') {
                const uploadExt8 = files.ext_img_8[0].location ? files.ext_img_8[0].location : '';
                addCarTradeImg.ext_img_8 = uploadExt8;
            }

            // Interior Images Start

            if (files.int_img_1 && files.int_img_1[0].fieldname === 'int_img_1') {
                const uploadInt1 = files.int_img_1[0].location ? files.int_img_1[0].location : '';
                addCarTradeImg.int_img_1 = uploadInt1;
            }

            if (files.int_img_2 && files.int_img_2[0].fieldname === 'int_img_2') {
                const uploadInt2 = files.int_img_2[0].location ? files.int_img_2[0].location : '';
                addCarTradeImg.int_img_2 = uploadInt2;
            }

            if (files.int_img_3 && files.int_img_3[0].fieldname === 'int_img_3') {
                const uploadInt3 = files.int_img_3[0].location ? files.int_img_3[0].location : '';
                addCarTradeImg.int_img_3 = uploadInt3;
            }

            if (files.int_img_4 && files.int_img_4[0].fieldname === 'int_img_4') {
                const uploadInt4 = files.int_img_4[0].location ? files.int_img_4[0].location : '';
                addCarTradeImg.int_img_4 = uploadInt4;
            }

            if (files.int_img_5 && files.int_img_5[0].fieldname === 'int_img_5') {
                const uploadInt5 = files.int_img_5[0].location ? files.int_img_5[0].location : '';
                addCarTradeImg.int_img_5 = uploadInt5;
            }

            if (files.int_img_6 && files.int_img_6[0].fieldname === 'int_img_6') {
                const uploadInt6 = files.int_img_6[0].location ? files.int_img_6[0].location : '';
                addCarTradeImg.int_img_6 = uploadInt6;
            }

            if (files.int_img_7 && files.int_img_7[0].fieldname === 'int_img_7') {
                const uploadInt7 = files.int_img_7[0].location ? files.int_img_7[0].location : '';
                addCarTradeImg.int_img_7 = uploadInt7;
            }
        }

        await addCarTradeImg.save();

        const product = await Products.findById({ _id: addCarTradeImg.product_id });



        const brandName = await Brands.findById({ _id: product?.brand_id._id }).select('brand_name');


        const modelName = await BrandModel.findById({ _id: product?.model_id._id }).select("model_name");

        const variantName = await ModelVariant.findById({ _id: product?.variant_id._id }).select("variant_name");

        const fuelType = await Fuel.findById({ _id: product?.fuel_type._id }).select("fuel_name");



        /* 
        Old Ids
        
        CTE19303W
        CTE61216B
        CTE54840S
        CTE36222X
        
        */
        // const getAllImages: any = [];

        // addCarTradeImg.map((img: any) => {

        // });


        //Test Id: CTE4125A
        let messageSuccOrErr: any = '';
        let statusCodeSuccOrError: any = '';
        let statusResponseSuccOrErr: any = '';
        let getMessage: any = '';
        let getSuccessCode: any = '';
        let getResponseCode: any = '';
        const getData: any = [];
        let rj: any = 1;
        carTradeId.forEach(async (tradeId) => {
            const carTradeProductData = {
                "user_id": `${tradeId}`,
                "client_listing_id": `${product?._id}`,
                "price": `${product?.price}`,
                "manufacturing_year": product?.registration_year,
                "car_make": `${brandName!.brand_name}`,
                "car_model": `${modelName!.model_name}`,
                "car_variant": `${variantName!.variant_name}`,
                "state": `${product?.registration_state}`,
                // "city": "Visakhapatnam",
                "fuel": `${fuelType!.fuel_name}`,
                "kms_driven": product?.kms_driven,
                "color_family": `${product?.product_color}`,
                "display_color": `${product?.product_color}`,
                "reg_type": "Individual",
                "reg_no": `${product?.registration_number}`,
                "insurance_type": `${product?.insurance_type}`,
                "owners": `${product?.product_ownership}`,
                "video_link": "",
                "highlight_remarks": "Good Condition",
                "remarks": "Excellent Performance ",
                "image_name": [
                    {
                        "name": `${addCarTradeImg.ext_img_1 ? addCarTradeImg.ext_img_1 : undefined}`,
                        "default_image": "y"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_2 ? addCarTradeImg.ext_img_2 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_3 ? addCarTradeImg.ext_img_3 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_4 ? addCarTradeImg.ext_img_4 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_5 ? addCarTradeImg.ext_img_5 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_6 ? addCarTradeImg.ext_img_6 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_7 ? addCarTradeImg.ext_img_7 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_8 ? addCarTradeImg.ext_img_8 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_1 ? addCarTradeImg.int_img_1 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_2 ? addCarTradeImg.int_img_2 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_3 ? addCarTradeImg.int_img_3 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_4 ? addCarTradeImg.int_img_4 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_5 ? addCarTradeImg.int_img_5 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_6 ? addCarTradeImg.int_img_6 : undefined}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_7 ? addCarTradeImg.int_img_7 : undefined}`,
                        "default_image": "n"
                    },
                ],
                "action": `${carTradeActionName}`,
                "vehicle_status": "Ready"
            }
            // console.log('carTradeProductData : ', carTradeProductData);
            await axios.post(`${CAR_TRADE_URL}`, carTradeProductData, {
                headers: {
                    Authorization: `e3d62c8ebad332a9fba5e0e852e6f1d2c9224773`
                }
            }).then((res) => {
                // console.log('Car Trade Responser: ', res.data);
                // console.log('Car Trade Count: ', rj);
                // console.log('Car Trade Responser: ', res.data && res.data.validationErrors.validationerror);
                if (res.data && res.data.status === 1) {
                    console.log(res && res.data);
                    console.log(res && res.data && res.data.validationErrors && res.data.validationErrors.validationerror);
                    getMessage = `Images uploaded successfully.`;
                    getSuccessCode = 201;
                    getResponseCode = 1;
                }
            }).catch(async (e) => {
                // console.log('Car Trade Error: ', e.response.data);
                if (rj === 23) {
                    await addCarTradeImg.deleteOne({ _id: addCarTradeImg._id });
                }
                getMessage = `Images not uploaded.`;
                getSuccessCode = 500;
                getResponseCode = 0;
                // console.log('Car Trade Error')
            });
            messageSuccOrErr = getMessage;
            statusCodeSuccOrError = getSuccessCode;
            statusResponseSuccOrErr = getResponseCode;
            rj++;
        });

        res.status(201).json({ status: 1, message: `Images uploaded, Please check images on Car Trade IDs Once.`, });

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const deleteCatTradeProduct = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        // console.log('body : ', body)
        let rj: any = 1;
        let getData: any = [];
        carTradeId.forEach(async (tradeId) => {
            const carTradeProductData = {
                "user_id": `${tradeId}`,
                "client_listing_id": `${body.product_id}`,
                "action": `luxuryride_delete_stock`,
            }
            // console.log('carTradeProductData : ', carTradeProductData);
            await axios.post(`${CAR_TRADE_URL}`, carTradeProductData, {
                headers: {
                    Authorization: `e3d62c8ebad332a9fba5e0e852e6f1d2c9224773`
                }
            }).then((res) => {
                // console.log('Car Trade Responser: ', res && res.data);
                // console.log('Car Trade Count: ', rj);
                // console.log('Car Trade Responser: ', res && res.data && res.data.validationErrors.validationerror);
            }).catch(async (e) => {
                // console.log('Car Trade Error: ', e && e.response && e.response.data);
                // console.log('Car Trade Error')
            });
            rj++;
            if (rj === 23) {
                const addCarTradeImg = await CarTradeImage.findOne({ product_id: body.product_id });
                await addCarTradeImg!.deleteOne({ product_id: body._id });
            }
        });

        res.status(200).json({ status: 1, message: `Product deleted successfully, Please check Car Trade IDs Once.`, });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}






export { createProduct, manageProductList, viewProduct, updateProduct, addProductSpecification, fetchFeaturesByProduct, blockUnBlockFeatures, getAllFeatureSpecification, getProductSpecificationDetail, updateProductSpecification, fetchAllProductForLink, blockUnBlockProducts, uploadCarTradeImages, deleteCatTradeProduct }