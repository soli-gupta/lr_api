import {Router} from 'express'
import { editCarCareDetailsByAdmin, updateCarCareDetailByAdmin, userCarCareLeadList } from '../controllers/adminUserCarCareController'
import auth from '../middelware/admin_auth'

const router = Router()

router.get('/user-car-care-list', auth, userCarCareLeadList)
router.get('/edit-car-care-detail/:id', auth, editCarCareDetailsByAdmin)
router.post('/update-car-care-detail', auth, updateCarCareDetailByAdmin)

export default router