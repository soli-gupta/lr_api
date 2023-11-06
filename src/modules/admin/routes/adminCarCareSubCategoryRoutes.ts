import { Router } from 'express'
import auth from '../middelware/admin_auth'
import { activeDeactiveCarCareSubCategory, carCareSubCategoryList, createCarCareSubCategory, selectCarCareSubCategoryByCatId, updateCarCareSubCategory, viewCarCareSubCategory } from '../controllers/adminCarCareSubCategoryController'

const router = Router()

router.post('/create-car-care-sub-category', auth, createCarCareSubCategory)
router.get('/car-care-sub-category-list', auth, carCareSubCategoryList)
router.get('/view-car-care-sub-category/:id', auth, viewCarCareSubCategory)
router.post('/update-car-care-sub-category/:id', auth, updateCarCareSubCategory)
router.get('/active-deactive-car-care-sub-category', auth, activeDeactiveCarCareSubCategory)
router.get('/get-car-care-sub-category-by-catId', selectCarCareSubCategoryByCatId)

export default router