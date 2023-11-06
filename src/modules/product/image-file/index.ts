import multer from "multer";
import multerS3 from 'multer-s3';
import { S3Client, S3 } from '@aws-sdk/client-s3'
import { AWS_S3_ACCESS_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_BUCKET_NAME, AWS_ACL } from "../../../config";
import crypto from 'crypto'

// const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// const s3 = new S3Client({
//     region: `${AWS_REGION_NAME}`,
//     credentials: {
//         accessKeyId: `${AWS_S3_ACCESS_ID}`,
//         secretAccessKey: `${AWS_S3_SECRET_ACCESS_KEY}`,
//     },
// });


// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: `${AWS_BUCKET_NAME}`,
//         // bucket: "Lr-live",
//         acl: `${AWS_ACL}`,
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: (req, file, cb) => {
//             const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//             const imageStorageName = generateFileName() + '_' + uniqueShuffix;
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



const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: `AKIASEWJYHJ3N5LRSNCG`,
        secretAccessKey: `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`,
    },
});


const upload = multer({
    storage: multerS3({
        s3,
        bucket: "bucket-7vbln7",
        // bucket: "Lr-live",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const getFileName = file.originalname.toLocaleLowerCase().replace(/ /g, '-');

            const imageStorageName = generateFileName() + '_' + getFileName;
            cb(null, imageStorageName);
        }
    }),
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg|pdf|JPG|JPEG)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg, Png or Svg Image only!'));
        }
        cb(null, true);
    },
});


export default upload;



// metadata: (req, file, cb) => {
//     cb(null, { fieldname: file.fieldname });
// },



// const storage = multerS3({
//     s3: s3, // s3 instance
//     bucket: "Lr-live", // change it as per your project requirement
//     acl: "public-read", // storage access type
//     metadata: (req, file, cb) => {
//         cb(null, { fieldname: file.fieldname })
//     },
//     key: (req, file, cb) => {
//         const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const getFileName = file.originalname.toLocaleLowerCase().replace(/ /g, '-');
//         const fileName = file.fieldname + '-' + uniqueShuffix + '-' + getFileName;

//         cb(null, fileName);
//     }
// })


// const storage = multer.diskStorage({
//     destination: './public/products',
//     filename: function (req, file, cb) {
//         const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const getFileName = file.originalname.toLocaleLowerCase().replace(/ /g, '-');
//         cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
//     }
// });

// const upload = multer({
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|svg|pdf)$/)) {
//             return cb(new Error('Please upload Jpg, Jpeg, Png or Svg Image only!'));
//         }
//         cb(null, true);
//     },
//     storage: storage,
// });


// CTE19303W	LRDELHI@1426	New Delhi
// CTE61216B	RIDECHAND7	Chandigarh
// CTE54840S	PURCHASE14@	Lucknow
// CTE36222X	GAZALA@1982	Hyderabad
// CTE64807T	LUXRIDEGUR	Gurgaon
// CTE64808R	LUXRIDENOI	Noida
// CTE64809B	LUXRIDEFAR	Faridabad
// CTE64810A	LUXRIDEGHZ	Ghaziabad
// CTE64811C	LUXRIDEKAR	Karnal
// CTE64828D	LUXRIDEPAN	Panipat
// CTE64829V	LUXRIDEAMB	Ambala
// CTE64830G	LUXRIDEYAM	Yamuna Nagar
// CTE64831H	LUXRIDEMOH	Mohali
// CTE64832I	LUXRIDEZIR	Zirakpur
// CTE64833X	LUXRIDEPAC	Panchkula
// CTE64834V	LUXRIDECNB	Kanpur
// CTE64835Q	LUXRIDEAGR	Agra
// CTE64836F	LUXRIDEMER	Meerut
// CTE64837H	LUXRIDELUD	Ludhiana
// CTE64853T	LUXRIDEJAL	Jalandhar
// CTE64854Q	LUXRIDEPAL	Patiala
// CTE64855D	LUXRIDEAMR	Amritsar
// CTE64856U	LUXRIDEJAM	Jammu