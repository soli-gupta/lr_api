import { Router } from "express";
import { createMakeModelVariant, createProductBySalesForce, salesForceBookTestDrive, createSellRequestBySalesForce, updateMakeModelVariant, updateProductBySalesForce, updateSalesForceSellRequest, updateSalesForceUserOrder, updateUserTestDriveStatusBySalesForce, uploadRCCarInsurenceBySalesForce } from "../controllers/adminSalesForceController";
import { createOrderFromSalesForce } from "../controllers/_backup_adminSalesForce";


const router = Router();

router.post('/add-product', createProductBySalesForce);
router.post('/update-product', updateProductBySalesForce);
router.post('/create-make-model-variant', createMakeModelVariant);
router.post('/update-make-model-variant', updateMakeModelVariant);
router.post('/update-user-order', updateSalesForceUserOrder);
router.post('/update-user-test-drive', updateUserTestDriveStatusBySalesForce);
router.post('/manage-ebook-salesforce', createOrderFromSalesForce);
router.post('/create-test-drive-salesforce', salesForceBookTestDrive);

//Sell Request Cancel And Status Update
router.post('/update-sell-request-order', updateSalesForceSellRequest)
router.post('/create-sell-request', createSellRequestBySalesForce)
router.post('/upload-doc-files', uploadRCCarInsurenceBySalesForce)




export default router;