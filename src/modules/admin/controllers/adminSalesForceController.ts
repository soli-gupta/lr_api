import { Secret } from "jsonwebtoken";
import { SALES_FORCE } from "../../../config";
import { Request, Response } from "express";
import Brands from "../../brand/model/brand";
import BrandModel from "../../brand/model/brand-models";
import ModelVariant from "../../brand/model/model-variant";
import ExperienceCenter from "../../experience-centers/models/experience-centers";
import { createSlug } from "../../../helpers/common_helper";
import Fuel from "../models/fuel";
import BodyType from "../models/body-type";
import Products from "../../product/models/product-model";
import Orders from "../../users/models/orders";
import BookTestDrive from "../../users/models/book-testdrive";
import Sell from "../../user/model/sell";
import User from "../../users/models/user";
import UserAddresses from "../../users/models/user-address";
import path from "path";
const request = require('request');

const SALES_FORCE_URL: Secret = SALES_FORCE!;
var fs = require("fs");

const token = 'Luxury Ride eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTMzODEyMCwiaWF0IjoxNjg1MzM4MTIwfQ.c9PFbNUDApNLzbqXJcSdY0kZvYFWHcNeHoFEzkZ-Fk4';
const SellCarCertificatePath = path.join(process.cwd(), "/public/sell/car-certificate/");
const SellCertDIR = "public/sell/car-certificate/";

const SellCarInsurance = path.join(process.cwd(), "/public/sell/car-insurance/");
const SellCarInsuranceDIR = "public/sell/car-insurance/";

const createProductBySalesForce = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body = req.body;

            let fetchBrandId = await Brands.findOne({ brand_name: body.Make });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make ?? '',
                    brand_slug: body.Make.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model ?? '',
                    model_slug: body.Model.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelId = createNewModel;
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Variant_Name });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Variant_Name ?? '',
                    variant_slug: body.Variant_Name.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            let fetchLocationId = await ExperienceCenter.findOne({ center_name: body.Location });

            if (!fetchLocationId) {
                const experienceCenterData = {
                    center_name: body.Location,
                    center_slug: await createSlug(body.Location),
                    center_status: 2
                }
                const createNewCenter = new ExperienceCenter(experienceCenterData);
                await createNewCenter.save();
                fetchLocationId = createNewCenter;
            }

            let fetchFuelId = await Fuel.findOne({ fuel_name: body.Fuel });

            if (!fetchFuelId) {
                const fuelData = {
                    fuel_name: body.Fuel ?? '',
                    fuel_slug: await createSlug(body.naFuelme),
                    fuel_status: 2
                }

                const createNewFuel = new Fuel(fuelData);
                await createNewFuel.save();

                fetchFuelId = createNewFuel;
            }

            let fetchBodyTypeId = await BodyType.findOne({ body_name: body.Body_Type });

            if (!fetchBodyTypeId) {
                const bodyTypeData = {
                    body_name: body.Body_Type ?? '',
                    body_slug: await createSlug(body.Body_Type) ?? '',
                    body_status: 2
                }

                const createNewBodyType = new BodyType(bodyTypeData);
                await createNewBodyType.save();

                fetchBodyTypeId = createNewBodyType;
            }

            const productName = body.Make + ' ' + body.Model + ' ' + body.Variant_Name;
            let productSlug = productName.toLowerCase().replace(/ /g, '-');

            const checkProductSlug = await Products.find({ product_name: productName }).sort({ createdAt: -1 }).limit(1);

            let getProductCount: any = '';
            if (checkProductSlug.length) {
                checkProductSlug.map((slug) => {
                    getProductCount = slug.sku_code;
                });
                productSlug = productSlug + '-' + getProductCount;
            }

            const newProductData = {
                brand_id: fetchBrandId._id,
                model_id: fetchModelId._id,
                variant_id: fetchVariantId._id,
                product_name: productName,
                product_slug: productSlug,
                registration_state: body.Registration_State,
                registration_year: body.Registration_Year,
                manufacturing_year: body.Manufacturing_Year,
                kms_driven: body.KMS_Run,
                product_ownership: body.Serial_Owner,
                fuel_type: fetchFuelId._id,
                price: body.Buying_Price,
                engine_cc: body.Engine_CC,
                body_type: fetchBodyTypeId._id,
                insurance_type: body.Insurance_Status,
                insurance_valid: body.Insurance_Valid_Years,
                product_location: fetchLocationId._id,
                product_monthely_emi: '',
                product_color: body.Color,
                sales_force_id: body.product_id
            }

            const product = new Products(newProductData);

            let generateCode: any = '';
            const checkCode = await Products.find().sort({ sku_code: - 1 }).limit(1);
            let uniqueCode: any = 0;
            if (checkCode[0].sku_code === undefined) {
                uniqueCode = 1;
            } else {
                uniqueCode = checkCode[0].sku_code + 1;
            }
            generateCode = uniqueCode;
            product.sku_code = generateCode ? generateCode : '';

            await product.save();

            res.status(201).json({ status: 1, message: `${product.product_name} Addedd successfully.` });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' });
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateProductBySalesForce = async (req: Request, res: Response) => {
    try {

        const body: any = req.body;
        const _id = body.product_id;

        if (token === req.header("token")) {


            const product = await Products.findOne({ sales_force_id: _id });

            if (!product) {
                return res.status(404).json({ status: 2, message: 'No product found.' });
            }


            let fetchBrandId = await Brands.findOne({ brand_name: body.Make });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make ?? '',
                    brand_slug: body.Make.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model ?? '',
                    model_slug: body.Model.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelId = createNewModel;
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Variant_Name });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Variant_Name ?? '',
                    variant_slug: body.Variant_Name.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            let fetchLocationId = await ExperienceCenter.findOne({ center_name: body.Location });

            if (!fetchLocationId) {
                const experienceCenterData = {
                    center_name: body.Location,
                    center_slug: await createSlug(body.Location),
                    center_status: 2
                }
                const createNewCenter = new ExperienceCenter(experienceCenterData);
                await createNewCenter.save();
                fetchLocationId = createNewCenter;
            }

            let fetchFuelId = await Fuel.findOne({ fuel_name: body.Fuel });

            if (!fetchFuelId) {
                const fuelData = {
                    fuel_name: body.Fuel ?? '',
                    fuel_slug: await createSlug(body.naFuelme),
                    fuel_status: 2
                }

                const createNewFuel = new Fuel(fuelData);
                await createNewFuel.save();

                fetchFuelId = createNewFuel;
            }

            let fetchBodyTypeId = await BodyType.findOne({ body_name: body.Body_Type });

            if (!fetchBodyTypeId) {
                const bodyTypeData = {
                    body_name: body.Body_Type ?? '',
                    body_slug: await createSlug(body.Body_Type) ?? '',
                    body_status: 2
                }

                const createNewBodyType = new BodyType(bodyTypeData);
                await createNewBodyType.save();

                fetchBodyTypeId = createNewBodyType;
            }

            const productName = body.Make + ' ' + body.Model + ' ' + body.Variant_Name;
            let productSlug = productName.toLowerCase().replace(/ /g, '-');

            if (productName !== body.productName) {
                productSlug = productSlug + '-' + product.sku_code;
            }

            let getProductCount: any = '';

            product.brand_id = fetchBrandId._id;
            product.model_id = fetchModelId._id;
            product.variant_id = fetchVariantId._id;
            product.product_name = productName;
            product.product_slug = productSlug;
            product.registration_state = body.Registration_State ? body.Registration_State : product.registration_state;
            product.registration_year = body.Registration_Year;
            product.manufacturing_year = body.Manufacturing_Year;
            product.kms_driven = body.KMS_Run;
            product.product_ownership = body.Serial_Owner;
            product.fuel_type = fetchFuelId._id;
            product.price = body.Buying_Price;
            product.engine_cc = body.Engine_CC;
            product.body_type = fetchBodyTypeId._id;
            product.insurance_type = body.Insurance_Status;
            product.insurance_valid = body.Insurance_Valid_Years;
            product.product_location = fetchLocationId._id;
            product.product_monthely_emi = '';
            product.product_color = body.Color;
            product.sales_force_id = body.product_id;


            await product.save();

            return res.status(200).json({ status: 1, message: `${product!.product_name} updated successfully.`, product });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (e) {
        res.status(500).json({ status: 1, message: 'Something went wrong.' });
    }
}

const createMakeModelVariant = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {


            const body: any = req.body;
            let fetchBrandId = await Brands.findOne({ brand_name: body.Make });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make ?? '',
                    brand_slug: body.Make.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model });
            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model ?? '',
                    model_slug: body.Model.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                console.log(createNewModel);
                await createNewModel.save();
                fetchModelId = createNewModel;
                console.log('fetchModelId : ', fetchModelId);
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Name });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Name ?? '',
                    variant_slug: body.Name.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            return res.status(201).json({ status: 1, message: `Created successfully.` });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const updateMakeModelVariant = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body: any = req.body;
            let fetchBrandId = await Brands.findOne({ brand_name: body.Make });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make ?? '',
                    brand_slug: body.Make.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model ?? '',
                    model_slug: body.Model.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelId = createNewModel;
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Name });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Name ?? '',
                    variant_slug: body.Name.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            return res.status(201).json({ status: 1, message: `Updated successfully.` });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateSalesForceUserOrder = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body: any = req.body;

            const order = await Orders.findOne({ salesforce_OpportunityId: body.OpportunityId })

            if (!order) {
                return res.status(400).json({ status: 2, message: 'Order not found.' });
            }


            order.order_status = body.orderStatus;
            order.order_cancel_reason = body.Deal_Cancel_Description ? body.Deal_Cancel_Description : '';
            order.order_cancel_description = body.Deal_Cancel_Description_Other ? body.Deal_Cancel_Description_Other : '';

            await order.save();

            const product = await Products.findById({ _id: order.order_product_id });

            let orderStatus = ''
            if (body.orderStatus === "1") {
                orderStatus = 'Booked'
                product!.product_status = "booked"
            } else if (body.orderStatus === "2") {
                orderStatus = 'Completed'
                product!.product_status = "sold";
            } else if (body.orderStatus === "3") {
                orderStatus = 'Cancelled'
                product!.product_status = "live";
            }
            await product!.save();

            res.status(200).json({ status: 1, message: `${order?.order_car_name} ${orderStatus} successfully.` });

        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateUserTestDriveStatusBySalesForce = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body: any = req.body;

            const testDrive = await BookTestDrive.findOne({ test_drive_OpportunityId: body.OpportunityId });

            if (!testDrive) {
                return res.status(400).json({ status: 2, message: `No data found.` });
            }

            testDrive.test_status = body.testDriveStatus;

            let testDriveStatus = '';
            if (body.testDriveStatus === "2") {
                testDriveStatus = "Completed";
                testDrive.car_cancel_reason = '';
                testDrive.car_cancel_description = '';
            } else if (body.testDriveStatus === "3") {
                testDriveStatus = "Cancelled";
                testDrive.car_cancel_reason = body.Deal_Cancel_Description ? body.Deal_Cancel_Description : '';
                testDrive.car_cancel_description = body.Deal_Cancel_Description_Other ? body.Deal_Cancel_Description_Other : '';
            }

            await testDrive.save();

            res.status(200).json({ status: 1, message: `${testDrive.car_name} test drive ${testDriveStatus} successfully.`, testDrive });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const updateSalesForceSellRequest = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body: any = req.body;

            const sell = await Sell.findOne({ salesforce_opportunity_id: body.OpportunityId })

            if (!sell) {
                return res.status(400).json({ status: 2, message: 'Sell Request not found.' });
            }

            sell!.status = body.sellRequestStatus;
            let RequestStatus = '';
            if (body.sellRequestStatus === "2") {
                RequestStatus = "Completed";
                sell!.cancel_reason = '';
                sell!.cancel_reason_dscription = '';
            } else if (body.sellRequestStatus === "3") {
                RequestStatus = "Cancelled";
                sell!.cancel_reason = body.Deal_Cancel_Description ? body.Deal_Cancel_Description : '';
                sell!.cancel_reason_dscription = body.Deal_Cancel_Description_Other ? body.Deal_Cancel_Description_Other : '';
            }
            await sell!.save();

            res.status(200).json({ status: 1, message: `${sell?.brand_name} ${sell!.model_name} ${sell!.variant_name} sell requested ${RequestStatus} successfully.` });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}
const createOrderFromSalesForce = async (req: Request, res: Response) => {
    try {
        if (token === req.header("token")) {
            const body: any = req.body;
            const _id = body.product_id;
            const product: any = await Products.findOne({ sales_force_id: _id }).populate([
                { path: "brand_id", select: ["brand_name", "brand_slug"] },
                { path: "model_id", select: ["model_name", "model_slug"] },
                { path: "variant_id", select: ["variant_name", "variant_slug"] },
                { path: "fuel_type", select: ["fuel_name", "fuel_slug"] },
                { path: "body_type", select: ["body_name", "body_slug"] },
                { path: "product_location", select: ["center_name", "center_slug", "center_city"] }
            ]);
            // .where({ product_status: "live", product_type_status: 1 });


            if (!product) {
                return res.status(400).json({ status: 0, message: 'Not found.' });
            }


            const brandName = await Brands.findById({ _id: product.brand_id._id }).select('brand_name');


            const modelName = await BrandModel.findById({ _id: product.model_id._id }).select("model_name");

            const variantName = await ModelVariant.findById({ _id: product.variant_id._id }).select("variant_name");

            const fuelType = await Fuel.findById({ _id: product.fuel_type._id })


            const bodyType = await BodyType.findById({ _id: product.body_type!._id }).select("body_name");

            const productLocation = await ExperienceCenter.findById({ _id: product.product_location._id }).select("center_name");


            let user = await User.findOne({ mobile: body.user_contact });

            if (!user) {
                const userData = {
                    first_name: body.user_first_name,
                    last_name: body.user_last_name,
                    mobile: body.user_contact,
                    email: body.user_email,
                    salesforce_account_id: body.accountId
                }
                user = new User(userData);
                await user.save();
            }


            const productData = {
                user_contact: user.mobile,
                order_brand_name: brandName!.brand_name,
                order_model_name: modelName!.model_name,
                order_variant_name: variantName!.variant_name,
                order_car_registration_year: product.registration_year,
                order_car_ownership: product.product_ownership,
                order_car_kms: product.kms_driven,
                order_car_amount: product.price,
                user_booking_amount: body.booking_amount,
                order_balance_amount: product.price - parseInt(body.booking_amount),
                order_car_fuel_type: fuelType!.fuel_name,
                order_car_registration_state: product.registration_state,
                order_car_name: product.product_name,
                order_car_manufacturing_year: product.manufacturing_year,
                order_car_engine: product.engine_cc,
                order_car_body_type: bodyType!.body_name,
                order_car_insurance_type: product.insurance_type,
                order_car_insurance_valid: product.insurance_valid,
                order_car_location: productLocation!.center_name,
                order_id: 'LR-' + Date.now() + '-' + Math.round(Math.random() * 1e9),

                order_user_id: user._id,
                order_product_id: product._id,
                order_car_color: product.product_color,
                user_optd_insurance: body.option_insurance ? body.option_insurance : 2,
                order_type: "buy",
                form_step: 4,
                order_status: 1,
                salesforce_OpportunityId: body.OpportunityId,

                user_first_name: user.first_name,
                user_last_name: user.last_name,
                user_email_id: user.email,
                user_full_address: body.address + ' ' + body.city + ' ' + body.state + ' ' + body.pincode,
                payment_type: body.payment_type
            }

            let order = new Orders(productData);

            await order.save();

            product!.product_status = "booked"
            await product.save();

            res.status(201).json({ status: 1, message: `${order.order_car_name} Order created successfully.` });


        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }

}

const salesForceBookTestDrive = async (req: Request, res: Response) => {
    try {
        if (token === req.header("token")) {
            const body: any = req.body;
            const _id: any = body.product_id;

            let user = await User.findOne({ mobile: body.user_contact });

            if (!user) {
                const userData = {
                    first_name: body.user_first_name,
                    last_name: body.user_last_name,
                    mobile: body.user_contact,
                    email: body.user_email,
                    salesforce_account_id: body.accountId
                }
                user = new User(userData);
                await user.save();
            }

            const bookedData = {
                user_first_name: user.first_name,
                user_last_name: user.last_name,
                user_contact: user.mobile,
                user_address: body.address + ' ' + body.city + ' ' + body.state + ' ' + body.pincode,
                user_landmark: body.landmark ?? '',
                user_city: body.city,
                user_state: body.state,
                test_drive_date: body.book_date ?? '',
                test_drive_time: body.book_time ?? '',
                user_lat: '',
                user_long: '',
                pin_code: body.pincode,
                user_id: user._id,
                test_drive_order_id: 'LR-TD' + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9)
            }

            const testDrive = new BookTestDrive(bookedData);

            const product = await Products.findOne({ sales_force_id: _id }).populate([
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

            const bodyType = await BodyType.findById({ _id: product!.body_type!._id }).select("body_name");

            const productLocation = await ExperienceCenter.findById({ _id: product!.product_location._id }).select("center_name");


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
            testDrive.car_color = product!.product_color;
            testDrive!.experience_center = productLocation?._id;
            testDrive!.product_id = product?._id;
            testDrive!.test_drive_OpportunityId = body.OpportunityId;

            await testDrive.save();

            res.status(201).json({ status: 1, message: `${testDrive.car_name} Test drive booked successfully.` });

        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const createSellRequestBySalesForce = async (req: Request, res: Response) => {
    try {
        if (token === req.header("token")) {
            let fetchBrandData = await Brands.findOne({ brand_name: req.body.Make });
            if (!fetchBrandData) {
                const newBrandData = {
                    brand_name: req.body.Make ?? '',
                    brand_slug: req.body.Make.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandData = createNewBrand;
            }

            let fetchModelData = await BrandModel.findOne({ model_name: req.body.Model });

            if (!fetchModelData) {
                const newModelData = {
                    brand_id: fetchBrandData._id ?? '',
                    model_name: req.body.Model ?? '',
                    model_slug: req.body.Model.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelData = createNewModel;
            }

            let fetchVariantData = await ModelVariant.findOne({ variant_name: req.body.Variant_Name });

            if (!fetchVariantData) {

                const newVariantData = {
                    brand_id: fetchBrandData._id ?? '',
                    model_id: fetchModelData._id ?? '',
                    variant_name: req.body.Variant_Name ?? '',
                    variant_slug: req.body.Variant_Name.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();
                fetchVariantData = createNewVariant;
            }

            let fetchUser = await User.findOne({ mobile: req.body.Phone });
            if (!fetchUser) {
                const newUserData = {
                    salesforce_account_id: req.body.SalesForceAccountId,
                    mobile: req.body.Phone,
                    first_name: req.body.FirstName,
                    last_name: req.body.LastName,
                    email: req.body.PersonEmail
                }
                const createNewUser = new User(newUserData)
                await createNewUser.save()
                fetchUser = createNewUser
            }

            let fetchUserAddress = await UserAddresses.find({ user_state: req.body.state, user_city: req.body.city, user_pincode: req.body.pincode, user_full_address: req.body.full_address })

            // if (!fetchUserAddress) {
            //     const newUserAddressData = {
            //         user_id: fetchUser._id,
            //         user_address_type: req.body.address_type,
            //         user_state: req.body.state,
            //         user_city: req.body.city,
            //         user_pincode: req.body.pincode,
            //         user_full_address: req.body.full_address
            //     }
            //     const createUserAddress = new UserAddresses(newUserAddressData)
            //     await createUserAddress.save()
            //     fetchUserAddress = createUserAddress
            // }

            const data = {
                salesforce_account_id: req.body.SalesForceAccountId,
                salesforce_opportunity_id: req.body.salesForceOpportunityId,
                brand_name: req.body.Model,
                model_name: req.body.model_name,
                variant_name: req.body.variant_name,
                year: req.body.year,
                ownership: req.body.ownership ? req.body.ownership : '',
                kms: req.body.kms,
                user_mobile: fetchUser.mobile,
                step_form: "5",
                user_name: req.body.FirstName + " " + req.body.LastName,
                user_email: req.body.PersonEmail ? req.body.PersonEmail : '',
                address_type: req.body.address_type ? req.body.address_type : '',
                state: req.body.state ? req.body.state : '',
                city: req.body.city ? req.body.city : '',
                full_address: req.body.full_address ? req.body.full_address : '',
                pincode: req.body.pincode ? req.body.pincode : '',
                slot_date: req.body.slot_date ? req.body.slot_date : '',
                slot_time: req.body.slot_time ? req.body.slot_time : '',
                expected_sell_price: req.body.expected_price ? req.body.expected_price : ''

            }

            const createSellRequest = new Sell(data)
            await createSellRequest.save()
            res.status(200).json({ status: 1, message: 'sell requested successfully.' });
        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const uploadRCCarInsurenceBySalesForce = async (req: Request, res: Response) => {
    try {

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const sell = await Sell.findOne({ salesforce_opportunity_id: req.body.salesForceOpportunityId });
        let fileName: any = ''
        let fileName1: any = ''
        // console.log(sell)
        // return false
        // if (files !== undefined) {
        if (req.body.rc_registration_certificate) {
            let base64String: any = req.body.rc_registration_certificate
            let base64Image = base64String.split(';base64,').pop();

            fileName = req.body.fileName
            if (sell!.rc_registration_certificate && sell!.rc_registration_certificate !== undefined) {
                fs.unlinkSync(SellCarCertificatePath + req.body!.rc_registration_certificate);
            }
            sell!.rc_registration_thumbnail = req.body.fileName
            fs.writeFile(`./public/sell/car-certificate/${fileName}`, base64Image, { encoding: 'base64' }, function (error: any) {

            });
            sell!.rc_registration_certificate = fileName;
        }
        if (req.body.car_insurance) {
            let base64String1: any = req.body.car_insurance
            let base64Image1 = base64String1.split(';base64,').pop();

            fileName1 = req.body.fileName1
            if (sell!.car_insurance && sell!.car_insurance !== undefined) {
                fs.unlinkSync(SellCarInsurance + req.body!.car_insurance);
            }
            sell!.car_insurance_thumbnail = req.body.fileName1
            fs.writeFile(`./public/sell/car-insurance/${fileName1}`, base64Image1, { encoding: 'base64' }, function (error: any) {

            });
            sell!.car_insurance = fileName1;
        }
        await sell!.save();
        res.status(200).json({ status: 1, messages: "Your document uploaded successfully" });
        // }
    } catch (error) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createProductBySalesForce, updateProductBySalesForce, createMakeModelVariant, updateMakeModelVariant, updateSalesForceUserOrder, updateUserTestDriveStatusBySalesForce, updateSalesForceSellRequest, createSellRequestBySalesForce, createOrderFromSalesForce, salesForceBookTestDrive, uploadRCCarInsurenceBySalesForce }
