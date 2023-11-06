import { Router } from "express";
import multer from "multer";
import { cancelUserOrder, cancelUsertestDrive, createOrder, fetchAllTestDrives, getAllOrdersDetails, getOrderDetails, reScheduleUserTestDrive, updateOrderDetails } from "../controllers/orderController";
import auth from "../middelware/user_auth";

const upload = multer();



const router = Router();

router.post('/create-new-order', auth, createOrder);
router.get('/fetch-order-details/:orderId', auth, getOrderDetails);
router.get('/get-order-details-by-user', auth, getAllOrdersDetails);
router.post('/cancle-user-order', upload.single('test'), auth, cancelUserOrder)
router.get('/get-test-drives', auth, fetchAllTestDrives);
router.post('/cancel-user-test-drive', upload.single('test'), auth, cancelUsertestDrive);
router.post('/re-schedule-user-test-drive', upload.single('test'), auth, reScheduleUserTestDrive);

router.patch('/update-user-order/:id', upload.single('test'), auth, updateOrderDetails);



export default router;


/* 

{
                        "name": `${addCarTradeImg.ext_img_1}`,
                        "default_image": "y"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_2}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_3}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_4}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_5}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_6}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_7}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.ext_img_8}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_1}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_2}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_3}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_4}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_5}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_6}`,
                        "default_image": "n"
                    },
                    {
                        "name": `${addCarTradeImg.int_img_7}`,
                        "default_image": "n"
                    },

*/