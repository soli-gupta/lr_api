import { Router } from "express";
import { completeOrderByAdmin, fetchAllOrders, getOrderDetails } from "../controllers/adminOrderControllers";
import auth from "../middelware/admin_auth";
import multer from "multer";


const router = Router();
const upload = multer();


router.get('/get-all-orders', auth, fetchAllOrders);
router.get('/get-order-details/:orderId', auth, getOrderDetails);
router.post('/update-order-status-by-admin', auth, upload.single('test'), completeOrderByAdmin);




export default router;