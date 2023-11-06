import { Router } from 'express'
import auth from '../middelware/admin_auth'
import { activeDeactiveServiceDiscount, createServicesDiscount, servicesDiscountList, updateServiceDiscount, viewServicesDiscount } from '../controllers/adminServiceDiscountController'

const router = Router()

router.post('/create-service-discount', auth, createServicesDiscount)
router.get('/service-discount-list', auth, servicesDiscountList)
router.get('/view-service-discount/:id', auth, viewServicesDiscount)
router.post('/update-service-discount/:id', auth, updateServiceDiscount)
router.get('/active-deactive-service-discount', auth, activeDeactiveServiceDiscount)

export default router