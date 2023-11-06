import { Router } from "express";
import multer from "multer";
import { addNewAddress, deleteUserAddress, editAndUpdateAddress, fetchAllAddress } from "../controllers/userAddressController";
import auth from "../middelware/user_auth";
import { userAddressValidation } from "../validation/userAddressvalidation";


const router = Router();
const upload = multer();

router.post('/save-new-user-address', upload.single('test'), auth, addNewAddress);

router.get('/fetch-all-address', auth, fetchAllAddress);
router.get('/edit-user-address', auth, editAndUpdateAddress);
router.post('/edit-user-address', auth, editAndUpdateAddress);
router.get('/delete-address', auth, deleteUserAddress);

export default router;