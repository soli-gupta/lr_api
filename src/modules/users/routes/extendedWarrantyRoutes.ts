import { Router } from "express";
import { bookExtendedWarrantyPackage, updateExtendedWarrantyPackage, uploadDocsAfterOrder } from "../controllers/extendedWarrantyController";
import auth from "../middelware/user_auth";
import upload from "../image-file/extended-warranty";


const router = Router();

router.post('/book-extended-warranty', auth, bookExtendedWarrantyPackage);
router.patch('/upload-doc-after-order-extended-warranty/:id', upload.fields([{ name: "rc_certificate", maxCount: 1 }, { name: "insurance_copy", maxCount: 1 }]), auth, uploadDocsAfterOrder);

router.patch('/update-extended-warranty/:id', auth, updateExtendedWarrantyPackage);


export default router;