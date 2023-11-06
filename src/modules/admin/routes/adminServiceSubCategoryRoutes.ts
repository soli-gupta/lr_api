import { Router } from 'express'
import auth from '../middelware/admin_auth'
import { activeDeactiveServiceSubCategory, createServicesSubCategory, selectSubCategoryByCatId, servicesSubCategoryList, updateServiceSubCategory, viewServicesSubCategory } from '../controllers/adminServiceSubCategoryController'

const router = Router()

router.post('/create-service-sub-category', auth, createServicesSubCategory)
router.get('/service-sub-category-list', auth, servicesSubCategoryList)
router.get('/view-service-sub-category/:id', auth, viewServicesSubCategory)
router.post('/update-service-sub-category/:id', auth, updateServiceSubCategory)
router.get('/active-deactive-service-sub-category', auth, activeDeactiveServiceSubCategory)
router.get('/get-sub-category-by-catId', selectSubCategoryByCatId)

export default router