import { Router } from "express";
import { addToCartService, allUserServiceList, cancelServiceRequestData, editServiceDetails, fetchServicebyCarDetails, fetchServicesByCategoryId, getServiceById, removeToCartService, rescheduleServiceRequest, saveUserService, selectAddTOCartByOrderId, servicesCategoryList, updateServiceDetails } from "../controllers/serviceController";
import auth from "../middelware/user_auth";

const router = Router()

router.post('/save-user-service', auth, saveUserService)
router.get('/edit-user-service', auth, editServiceDetails)
router.post('/update-user-service/:id', auth, updateServiceDetails)
router.get('/user-service-list', auth, allUserServiceList)
router.post('/reschedule-service-request', auth, rescheduleServiceRequest)
router.post('/cancel-service-request', auth, cancelServiceRequestData)
router.get('/service-categories', servicesCategoryList)
router.post('/get-service-by-category-id', fetchServicesByCategoryId)
router.get('/get-service-by-id/:id', getServiceById)
router.post('/service-add-to-cart', auth, addToCartService)
router.get('/service-remove-to-cart/:id', auth, removeToCartService)
router.get('/get-service-by-car-detail', fetchServicebyCarDetails)
router.get('/get-service-by-order-id/:id', auth, selectAddTOCartByOrderId)
export default router