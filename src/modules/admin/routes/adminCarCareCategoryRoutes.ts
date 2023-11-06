import { Router } from 'express'
import auth from '../middelware/admin_auth'
// import upload from '../../service/image-file'
import upload from '../../car-care/image-file'
import { activeDeactiveCarCareCategory, carCareCategoryList, createCarCareCategory, updateCarCareCategory, viewCarCareCategory } from '../controllers/adminCarCareCategoryController'

const router = Router()

router.post('/create-car-care-category', auth, upload.single('image'), createCarCareCategory)
router.get('/car-care-category-list', auth, carCareCategoryList)
router.get('/view-car-care-category/:id', auth, viewCarCareCategory)
router.post('/update-car-care-category/:id', auth, upload.single('image'), updateCarCareCategory)
router.get('/active-deactive-car-care-category', auth, activeDeactiveCarCareCategory)

export default router