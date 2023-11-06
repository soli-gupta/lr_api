import { Router } from 'express'
import { addToCartCarCare, allUserCarCareList, cancelCarCareRequestData, carCaresCategoryList, editCarCareDetails, fetchCarCareByCategoryId, fetchCarCarebyCarDetails, getCarCareById, removeToCartCarCare, rescheduleCarCareRequest, saveCarCareDetails, selectCarCareAddTOCartByOrderId, updateCarCareDetails } from '../controllers/carCareController'
import auth from '../middelware/user_auth'

const router = Router()

router.post('/save-user-car-care', auth, saveCarCareDetails)
router.get('/edit-user-car-care', auth, editCarCareDetails)
router.post('/update-user-car-care/:id', auth, updateCarCareDetails)
router.get('/user-car-care-list', auth, allUserCarCareList)
router.post('/reschedule-car-care-request', auth, rescheduleCarCareRequest)
router.post('/cancel-car-care-request', auth, cancelCarCareRequestData)
router.get('/car-care-categories', carCaresCategoryList)
router.post('/get-car-care-by-category-id', fetchCarCareByCategoryId)
router.get('/get-car-care-by-id/:id', getCarCareById)
router.post('/car-care-add-to-cart', auth, addToCartCarCare)
router.get('/car-care-remove-to-cart/:id', auth, removeToCartCarCare)
router.get('/get-car-care-by-car-detail', fetchCarCarebyCarDetails)
router.get('/get-car-care-by-order-id/:id', auth, selectCarCareAddTOCartByOrderId)

export default router