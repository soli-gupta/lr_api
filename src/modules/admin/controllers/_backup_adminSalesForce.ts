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
const request = require('request');

const SALES_FORCE_URL: Secret = SALES_FORCE!;

const token = 'Luxury Ride eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTMzODEyMCwiaWF0IjoxNjg1MzM4MTIwfQ.c9PFbNUDApNLzbqXJcSdY0kZvYFWHcNeHoFEzkZ-Fk4';


const createProductBySalesForce = async (req: Request, res: Response) => {
    try {

        if (token === req.header("token")) {
            const body = req.body;

            let fetchBrandId = await Brands.findOne({ brand_name: body.Make__c });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make__c ?? '',
                    brand_slug: body.Make__c.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model__c });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model__c ?? '',
                    model_slug: body.Model__c.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelId = createNewModel;
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Variant_Name__c });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Variant_Name__c ?? '',
                    variant_slug: body.Variant_Name__c.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            let fetchLocationId = await ExperienceCenter.findOne({ center_name: body.Location__c });

            if (!fetchLocationId) {
                const experienceCenterData = {
                    center_name: body.Location__c,
                    center_slug: await createSlug(body.Location__c),
                    center_status: 2
                }
                const createNewCenter = new ExperienceCenter(experienceCenterData);
                await createNewCenter.save();
                fetchLocationId = createNewCenter;
            }

            let fetchFuelId = await Fuel.findOne({ fuel_name: body.Fuel__c });

            if (!fetchFuelId) {
                const fuelData = {
                    fuel_name: body.Fuel__c ?? '',
                    fuel_slug: await createSlug(body.naFuel__cme),
                    fuel_status: 2
                }

                const createNewFuel = new Fuel(fuelData);
                await createNewFuel.save();

                fetchFuelId = createNewFuel;
            }

            let fetchBodyTypeId = await BodyType.findOne({ body_name: body.Body_Type__c });

            if (!fetchBodyTypeId) {
                const bodyTypeData = {
                    body_name: body.Body_Type__c ?? '',
                    body_slug: await createSlug(body.Body_Type__c) ?? '',
                    body_status: 2
                }

                const createNewBodyType = new BodyType(bodyTypeData);
                await createNewBodyType.save();

                fetchBodyTypeId = createNewBodyType;
            }

            const productName = body.Make__c + ' ' + body.Model__c + ' ' + body.Variant_Name__c;
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
                registration_state: body.Registration_State__c,
                registration_year: body.Registration_Year__c,
                manufacturing_year: body.Manufacturing_Year__c,
                kms_driven: body.KMS_Run__c,
                product_ownership: body.Serial_Owner__c,
                fuel_type: fetchFuelId._id,
                price: body.Buying_Price__c,
                engine_cc: body.Engine_CC__c,
                body_type: fetchBodyTypeId._id,
                insurance_type: body.Insurance_Status__c,
                insurance_valid: body.Insurance_Valid_Years__c,
                product_location: fetchLocationId._id,
                product_monthely_emi: '',
                product_color: body.Color__c,
                sales_force_id: body._id
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
        const _id = body._id;

        if (token === req.header("token")) {


            const product = await Products.findOne({ sales_force_id: _id });

            if (!product) {
                return res.status(404).json({ status: 2, message: 'No product found.' });
            }


            let fetchBrandId = await Brands.findOne({ brand_name: body.Make__c });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make__c ?? '',
                    brand_slug: body.Make__c.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model__c });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model__c ?? '',
                    model_slug: body.Model__c.toLowerCase().replace(/ /g, '-') ?? '',
                    model_status: 1
                }

                const createNewModel = new BrandModel(newModelData);
                await createNewModel.save();
                fetchModelId = createNewModel;
            }

            let fetchVariantId = await ModelVariant.findOne({ variant_name: body.Variant_Name__c });

            if (!fetchVariantId) {

                const newVariantData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_id: fetchModelId._id ?? '',
                    variant_name: body.Variant_Name__c ?? '',
                    variant_slug: body.Variant_Name__c.toLowerCase().replace(/ /g, '-') ?? '',
                    variant_status: 1
                }

                const createNewVariant = new ModelVariant(newVariantData);
                await createNewVariant.save();

                fetchVariantId = createNewVariant;
            }

            let fetchLocationId = await ExperienceCenter.findOne({ center_name: body.Location__c });

            if (!fetchLocationId) {
                const experienceCenterData = {
                    center_name: body.Location__c,
                    center_slug: await createSlug(body.Location__c),
                    center_status: 2
                }
                const createNewCenter = new ExperienceCenter(experienceCenterData);
                await createNewCenter.save();
                fetchLocationId = createNewCenter;
            }

            let fetchFuelId = await Fuel.findOne({ fuel_name: body.Fuel__c });

            if (!fetchFuelId) {
                const fuelData = {
                    fuel_name: body.Fuel__c ?? '',
                    fuel_slug: await createSlug(body.naFuel__cme),
                    fuel_status: 2
                }

                const createNewFuel = new Fuel(fuelData);
                await createNewFuel.save();

                fetchFuelId = createNewFuel;
            }

            let fetchBodyTypeId = await BodyType.findOne({ body_name: body.Body_Type__c });

            if (!fetchBodyTypeId) {
                const bodyTypeData = {
                    body_name: body.Body_Type__c ?? '',
                    body_slug: await createSlug(body.Body_Type__c) ?? '',
                    body_status: 2
                }

                const createNewBodyType = new BodyType(bodyTypeData);
                await createNewBodyType.save();

                fetchBodyTypeId = createNewBodyType;
            }

            const productName = body.Make__c + ' ' + body.Model__c + ' ' + body.Variant_Name__c;
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
            product.registration_state = body.Registration_State__c ? body.Registration_State__c : product.registration_state;
            product.registration_year = body.Registration_Year__c;
            product.manufacturing_year = body.Manufacturing_Year__c;
            product.kms_driven = body.KMS_Run__c;
            product.product_ownership = body.Serial_Owner__c;
            product.fuel_type = fetchFuelId._id;
            product.price = body.Buying_Price__c;
            product.engine_cc = body.Engine_CC__c;
            product.body_type = fetchBodyTypeId._id;
            product.insurance_type = body.Insurance_Status__c;
            product.insurance_valid = body.Insurance_Valid_Years__c;
            product.product_location = fetchLocationId._id;
            product.product_monthely_emi = '';
            product.product_color = body.Color__c;
            product.sales_force_id = body._id;


            await product.save();

            return res.status(200).json({ status: 1, message: `${product!.product_name} updated successfully.` });
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
            let fetchBrandId = await Brands.findOne({ brand_name: body.Make__c });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make__c ?? '',
                    brand_slug: body.Make__c.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model__c });
            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model__c ?? '',
                    model_slug: body.Model__c.toLowerCase().replace(/ /g, '-') ?? '',
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
            let fetchBrandId = await Brands.findOne({ brand_name: body.Make__c });
            if (!fetchBrandId) {
                const newBrandData = {
                    brand_name: body.Make__c ?? '',
                    brand_slug: body.Make__c.toLowerCase().replace(/ /g, '-') ?? '',
                    brand_status: 1
                }
                const createNewBrand = new Brands(newBrandData);
                await createNewBrand.save();
                fetchBrandId = createNewBrand;
            }


            let fetchModelId = await BrandModel.findOne({ model_name: body.Model__c });

            if (!fetchModelId) {
                const newModelData = {
                    brand_id: fetchBrandId._id ?? '',
                    model_name: body.Model__c ?? '',
                    model_slug: body.Model__c.toLowerCase().replace(/ /g, '-') ?? '',
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

const createOrderFromSalesForce = async (req: Request, res: Response) => {
    try {
        if (token === req.header("token")) {
            const body: any = req.body;

            const product = await Products.findOne({ sales_force_id: body._id });


            res.status(201).json({ status: 1, message: 'Order created successfully.' });


        } else {
            res.status(400).json({ status: 2, message: 'You are not authorized.' })
        }

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }

}

export { createProductBySalesForce, updateProductBySalesForce, createMakeModelVariant, updateMakeModelVariant, updateSalesForceUserOrder, updateUserTestDriveStatusBySalesForce, createOrderFromSalesForce }