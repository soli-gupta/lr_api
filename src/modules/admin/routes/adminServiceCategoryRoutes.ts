import { Router } from 'express'
import auth from '../middelware/admin_auth'
import { activeDeactiveServiceCategory, createServiceCategory, serviceCategoryList, updateServiceCategory, viewServiceCategory } from '../controllers/adminServiceCategoryController'
import upload from '../../service/image-file'

const router = Router()

router.post('/create-service-category', auth, upload.single('image'), createServiceCategory)
router.get('/service-category-list', auth, serviceCategoryList)
router.get('/view-service-category/:id', auth, viewServiceCategory)
router.post('/update-service-category/:id', auth, upload.single('image'), updateServiceCategory)
router.get('/active-deactive-service-category', auth, activeDeactiveServiceCategory)

export default router