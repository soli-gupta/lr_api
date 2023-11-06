import { Router } from "express";
import { fetchAllTestDrives, getTestDriveDetail, updateTestDriveStatus } from "../controllers/adminBookTestDriveController";
import auth from "../middelware/admin_auth";
import multer from 'multer';



const router = Router();
const upload = multer();


router.get('/get-all-test-drives', auth, fetchAllTestDrives);
router.post('/update-test-drive-status', auth, updateTestDriveStatus);
router.get('/get-test-drive-details/:driveId', auth, getTestDriveDetail);


// upload.single('test'),


export default router;