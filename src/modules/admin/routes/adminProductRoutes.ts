import { Request, Response, Router } from "express";
import { createProduct, manageProductList, viewProduct, updateProduct, addProductSpecification, fetchFeaturesByProduct, blockUnBlockFeatures, getAllFeatureSpecification, getProductSpecificationDetail, updateProductSpecification, fetchAllProductForLink, blockUnBlockProducts, uploadCarTradeImages, deleteCatTradeProduct } from "../controllers/adminProductController";
import auth from "../middelware/admin_auth";
import upload from "../../product/image-file/index";
import { productValidation } from "../../product/validation/productValidation";
// import multer from "multer";


import CarTradeImage from "../../product/models/car-trade-img-model";
import multer from "multer";
import multerS3 from 'multer-s3';
import { S3Client, S3 } from '@aws-sdk/client-s3'
import crypto from 'crypto'

// const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')







// const s3 = new S3Client({
//     region: "ap-south-1",
//     credentials: {
//         accessKeyId: `AKIASEWJYHJ3N5LRSNCG`,
//         secretAccessKey: `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`,
//     },
// });


// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: "bucket-7vbln7",
//         // bucket: "Lr-live",
//         acl: "public-read",
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: (req, file, cb) => {
//             const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//             const getFileName = file.originalname.toLocaleLowerCase().replace(/ /g, '-');
//             const fileName = file.fieldname + '-' + uniqueShuffix + '-' + getFileName;
//             const imageStorageName = generateFileName();
//             console.log('imageStorageName 1: ', imageStorageName);
//             cb(null, imageStorageName);
//         }
//     }),
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|svg|pdf)$/)) {
//             return cb(new Error('Please upload Jpg, Jpeg, Png or Svg Image only!'));
//         }
//         cb(null, true);
//     },
// });

const storage = multer.memoryStorage()
const uploadS3Images = multer({ storage: storage })
const router = Router();

router.post('/create-product', upload.single('image'), productValidation, auth, createProduct);
router.get('/manage-products', auth, manageProductList);
router.get('/view-product/:id', auth, viewProduct);
router.patch('/update-product/:id', upload.single('image'), auth, updateProduct);
router.get('/block-unblock-products', auth, blockUnBlockProducts);

router.post('/add-product-specification', auth, addProductSpecification);
router.get('/get-allfeatures-list-by-product/:productId', auth, fetchFeaturesByProduct);
router.get('/block-unblock-product-features', auth, blockUnBlockFeatures);

router.get('/get-all-feature-specification', auth, getAllFeatureSpecification);
router.get('/get-product-feature-detail/:id', auth, getProductSpecificationDetail);
router.patch('/update-product-specification-detail/:id', auth, updateProductSpecification);

router.get('/fetch-all-active-product-froLink', auth, fetchAllProductForLink);








router.post('/upload-product-car-trade-image', auth, upload.fields([
    { name: 'ext_img_1', maxCount: 9999 },
    { name: 'ext_img_2', maxCount: 9999 },
    { name: 'ext_img_3', maxCount: 9999 },
    { name: 'ext_img_4', maxCount: 9999 },
    { name: 'ext_img_5', maxCount: 9999 },
    { name: 'ext_img_6', maxCount: 9999 },
    { name: 'ext_img_7', maxCount: 9999 },
    { name: 'ext_img_8', maxCount: 9999 },
    { name: 'int_img_1', maxCount: 9999 },
    { name: 'int_img_2', maxCount: 9999 },
    { name: 'int_img_3', maxCount: 9999 },
    { name: 'int_img_4', maxCount: 9999 },
    { name: 'int_img_5', maxCount: 9999 },
    { name: 'int_img_6', maxCount: 9999 },
    { name: 'int_img_7', maxCount: 9999 },
]), uploadCarTradeImages);

router.post('/delete-car-trade-product', auth, deleteCatTradeProduct);

//uploadCarTradeImages
export default router;


// async (req: Request, res: Response) => {
//     try {
//         const body: any = req.body;
//         let addCarTradeImg: any = '';
//         const carTradeData = {
//             product_id: body.product_id
//         }

//         addCarTradeImg = await CarTradeImage.findOne({ product_id: carTradeData.product_id });

//         if (!addCarTradeImg) {
//             addCarTradeImg = new CarTradeImage(carTradeData);
//         }
//         ;
//         // const fileBuffer = 



//         //   const uploadParams = {
//         //     Bucket: 'bucket-7vbln7',
//         //     Body: fileBuffer,
//         //     Key: fileName,
//         //     ContentType: file.mimetype
//         //   }


//         const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };
//         // console.log('files : ', files);
//         if (files !== undefined) {

//             // Exterior Images Start
//             // media/image
//             if (files.ext_img_1 && files.ext_img_1[0].fieldname === 'ext_img_1') {
//                 console.log(files.ext_img_1[0].location);
//             }
//             if (files.ext_img_2 && files.ext_img_2[0].fieldname === 'ext_img_2') {
//                 console.log('files.ext_img_2[0] : ', files.ext_img_2[0]?.location);
//             }
//         }

//         res.status(201).json({ status: 1, message: `Images upload successfully.` });
//     } catch (e) {
//         res.status(500).json({ status: 0, message: e });
//     }
// }