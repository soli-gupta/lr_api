import { Router } from 'express'
import auth from '../middelware/admin_auth'
import upload from '../../service/image-file/custom-service-image'
import { activeDeactiveCustomServicePart, createCustomServicePart, customServicePartList, updateCustomServicePart, viewCustomServicePart } from '../controllers/adminCustomServicePartController'

const router = Router()

router.post('/create-custom-service-part', auth, upload.single('image'), createCustomServicePart)
router.get('/custom-service-part-list', auth, customServicePartList)
router.get('/view-custom-service-part/:id', auth, viewCustomServicePart)
router.post('/update-custom-service-part/:id', auth, upload.single('image'), updateCustomServicePart)
router.get('/active-deactive-custom-service-part', auth, activeDeactiveCustomServicePart)

export default router