import multer from "multer";

const storage = multer.diskStorage({
   //  destination: './public/sell/car-certificate',
     destination: (req, file, cb) => {        
        if (file.fieldname === "rc_registration_certificate") { // if uploading resume
          cb(null, './public/sell/car-certificate');
        }
         if(file.fieldname === "car_insurance") { // else uploading image
           cb(null, './public/sell/car-insurance');
        }
    },
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + getFileName);
    }
});


const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|Jpeg|png|pdf)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg and Png file!'));
        }
        cb(null, true)
    },
    storage: storage
});

// const storage1 = multer.diskStorage({
//     destination: './public/sell/car-certificate',
//     filename: function (req, file, cb) {
//         const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
//         cb(null, file.fieldname + '-' + getFileName);
//     }
// });


// const upload1 = multer({
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|joeg|png)$/)) {
//             return cb(new Error('Please upload Jpg, Jpeg and Png file!'));
//         }
//         cb(null, true)
//     },
//     storage: storage1
// });

export default upload;