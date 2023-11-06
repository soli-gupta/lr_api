import express, { json } from 'express';
import { SERVER_PORT } from './config';
import cors from 'cors';
import createHttpError from 'http-errors';
import "./db/mongoose";
import { errorHandler } from './helpers/errorHandler';
import path from 'path';

// Admin Routes

import adminRoutes from './modules/admin/routes/adminRoutes';
import blogRoute from './modules/blog/routes/blogRoute'
import tagRoutes from './modules/blog/routes/tagRoutes'
import adminBrandRoutes from './modules/admin/routes/adminBrandRoutes';
import adminBrandModelRoutes from './modules/admin/routes/adminBrandModelRoutes';
import adminFuelTypeRoutes from './modules/admin/routes/adminFuelTypeRoutes'
import adminCmsPageRoutes from './modules/admin/routes/adminCmsPageRoutes';
import adminBodyTypeRoutes from './modules/admin/routes/adminBodyTypeRoutes'
import adminModelVariantRoutes from './modules/admin/routes/adminModelVariantRoutes';
import adminExperienceCenterRoutes from './modules/admin/routes/adminExperienceCenterRoutes';
import adminSpecificationCategoryRoutes from './modules/admin/routes/adminSpecificationCategoryRoutes'

import adminProductRoutes from './modules/admin/routes/adminProductRoutes';
import adminBookVisitRoutes from './modules/admin/routes/adminBookVisitRoutes';
import sellRoutes from './modules/user/routes/sellRoutes'
import adminSellDataRoutes from './modules/admin/routes/adminSellDataRoutes'
// import experienceRoutes from './modules/user/routes/experienceRoutes'

import adminFeatureSpecificationRoutes from './modules/admin/routes/adminFeatureSpecificationRoutes';
import adminTestDriveRoutes from './modules/admin/routes/adminTestDriveRoutes';
import adminBuyLeadsRoutes from './modules/admin/routes/adminBuyLeadsRoutes';
import adminOrderRoutes from './modules/admin/routes/adminOrderRoutes';
import adminDashboardRoutes from './modules/admin/routes/adminDashboardRoutes';
import adminUserSeriveRoutes from './modules/admin/routes/adminUserServiceRoutes';
import adminUserCarCareRoutes from './modules/admin/routes/adminUserCarCareRoutes';
import adminColorRoutes from './modules/admin/routes/adminColorRoutes';

// Admin Hello AR 
import adminHelloARRoutes from './modules/admin/routes/adminHelloArRoutes';

import adminServicePackageRoutes from './modules/admin/routes/adminServicePakcageRoutes';
import adminExtendedWarrantyRoutes from './modules/admin/routes/adminExtendedWarrantyRoutes';
import adminContactRoutes from './modules/admin/routes/adminContactController';
import adminBankRoutes from './modules/admin/routes/adminBankRoutes';
import adminInsuranceAndLoansRoutes from './modules/admin/routes/adminInsuranceAndLoansRoutes';
import adminFAQsRoutes from './modules/admin/routes/adminFaqRoutes';
import adminServiceCategoryRoutes from './modules/admin/routes/adminServiceCategoryRoutes'
import adminServiceSubCategoryRoutes from './modules/admin/routes/adminServiceSubCategoryRoutes'
import adminCustomServicePartRoutes from './modules/admin/routes/adminCustomServicePartRoutes';
import adminServiceRoutes from './modules/admin/routes/adminServiceRoutes'
import adminServiceDiscountRoutes from './modules/admin/routes/adminServiceDiscountRoutes'
import adminInsuranceRoutes from './modules/admin/routes/adminInsuranceRoutes';

import adminCarCareCategoryRoutes from './modules/admin/routes/adminCarCareCategoryRoutes'
import adminCarCareSubCategoryRoutes from './modules/admin/routes/adminCarCareSubCategoryRoutes'
import adminCarCareRoutes from './modules/admin/routes/adminCarCareRoutes';
import adminCarCareDiscountRoutes from './modules/admin/routes/adminCarCareDiscountRoutes'

// Admin SalesForce
import adminSalesForceRouter from './modules/admin/routes/adminSalesForceRoutes';


import sellPageRoutes from './modules/users/routes/sellPageRoutes'

import userLoginRoutes from './modules/users/routes/userLoginRoutes'
import blogRoutes from './modules/users/routes/blogRoutes'
import serviceRoutes from './modules/users/routes/serviceRoutes';
import carCareRoutes from './modules/users/routes/carCareRoutes';
import colorRoutes from './modules/users/routes/colorRoutes'
import adminTestimonial from './modules/admin/routes/adminTestimonialRoutes'
import adminNewsMediaRoutes from './modules/admin/routes/adminNewsMediaRoutes'

// Admin Car Trade
import adminCarTradeRoutes from './modules/admin/routes/adminCarTradeRoutes';

const app = express();
// console.log()

app.use(json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, '../public')));




// Add Admin Routes
app.use('/admin', adminRoutes);
// Admin Blog category Route
app.use('/admin', blogRoute)
app.use('/admin', tagRoutes)
app.use('/admin', adminFuelTypeRoutes)
app.use('/admin', adminBodyTypeRoutes)
app.use('/admin', adminSpecificationCategoryRoutes)

app.use('/admin', adminSellDataRoutes)
app.use('/admin', adminTestimonial)
app.use('/admin', adminNewsMediaRoutes)

app.use('/admin', adminBrandRoutes);
app.use('/admin', adminBrandModelRoutes);
app.use('/admin', adminCmsPageRoutes);
app.use('/admin', adminModelVariantRoutes);
app.use('/admin', adminExperienceCenterRoutes);
app.use('/admin', adminProductRoutes);
app.use('/admin', adminFeatureSpecificationRoutes);
app.use('/admin', adminBookVisitRoutes);
app.use('/admin', adminTestDriveRoutes);
app.use('/admin', adminBuyLeadsRoutes);
app.use('/admin', adminOrderRoutes);
app.use('/admin', adminDashboardRoutes);
app.use('/admin', adminUserSeriveRoutes)
app.use('/admin', adminUserCarCareRoutes)
app.use('/admin', adminColorRoutes);
app.use('/admin', adminFAQsRoutes);
app.use('/admin', adminServiceCategoryRoutes)
app.use('/admin', adminServiceSubCategoryRoutes)
app.use('/admin', adminCustomServicePartRoutes)
app.use('/admin', adminServiceRoutes)
app.use('/admin', adminServiceDiscountRoutes)

// Car Care
app.use('/admin', adminCarCareCategoryRoutes)
app.use('/admin', adminCarCareSubCategoryRoutes)
app.use('/admin', adminCarCareRoutes)
app.use('/admin', adminCarCareDiscountRoutes)


// Hello AR
app.use(adminHelloARRoutes);

// Car Trade 
app.use(adminCarTradeRoutes);

app.use('/admin', adminServicePackageRoutes);
app.use('/admin', adminExtendedWarrantyRoutes);
app.use('/admin', adminContactRoutes);
app.use('/admin', adminBankRoutes);
app.use('/admin', adminInsuranceAndLoansRoutes);
app.use('/admin', adminInsuranceRoutes);

// Admin SalesForce
app.use('/sales-force', adminSalesForceRouter);



app.use('/user', sellRoutes)
// app.use('/user')
app.use(userLoginRoutes)

// User(Front) Routes Started
import homePgaeRoutes from './modules/users/routes/homepageRoutes';
import buyPageRoutes from './modules/users/routes/buyPageRoutes';
import userAddressRoutes from './modules/users/routes/userAddressRoutes';
import userLoggedRoutes from './modules/users/routes/userRoutes';
import userOrderRoutes from './modules/users/routes/orderRoutes';

// Service Package Routes
import servicePackageRoutes from './modules/users/routes/servicePackageRoutes';

// Extended Warranty Routes
import extendedWarrantyRoutes from './modules/users/routes/extendedWarrantyRoutes';
import contactRoutes from './modules/users/routes/contactRoutes';

import insuranceRoutes from './modules/users/routes/insuranceRoutes';
import testimonialRoutes from './modules/users/routes/testimonialRoutes';
import newsMediaRoutes from './modules/users/routes/newsMediaRoutes';

// Add User(Front) Routes
app.use(homePgaeRoutes);
app.use(sellPageRoutes)
app.use(buyPageRoutes);
app.use(blogRoutes)
app.use('/user', userAddressRoutes);
app.use('/user', userLoggedRoutes);
app.use('/user', userOrderRoutes);
app.use('/user', serviceRoutes)
app.use('/user', carCareRoutes)
app.use(insuranceRoutes);


// Service Package Routes
app.use(servicePackageRoutes);

// Extended Warranty Routes
app.use(extendedWarrantyRoutes);
app.use(contactRoutes);
app.use(colorRoutes)
app.use(testimonialRoutes)
app.use(newsMediaRoutes)


app.use(() => {
    throw createHttpError(404, " Not found");
})
app.use(errorHandler);


app.listen(SERVER_PORT, () => {
    console.log(`${SERVER_PORT} Run successfully!`);
});

