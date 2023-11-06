import { Router } from 'express'
import auth from '../middelware/admin_auth'
import { activeDeactiveCarCareDiscount, carCareDiscountList, createCarCareDiscount, updateCarCareDiscount, viewCarCareDiscount } from '../controllers/adminCarCareDiscountController'

const router = Router()

router.post('/create-car-care-discount', auth, createCarCareDiscount)
router.get('/car-care-discount-list', auth, carCareDiscountList)
router.get('/view-car-care-discount/:id', auth, viewCarCareDiscount)
router.post('/update-car-care-discount/:id', auth, updateCarCareDiscount)
router.get('/active-deactive-car-care-discount', auth, activeDeactiveCarCareDiscount)

export default router