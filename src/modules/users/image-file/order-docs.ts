import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "rc_certificate") {
            cb(null, './public/service-package/rc-certificate');
        }
        if (file.fieldname === "insurance_copy") {
            cb(null, "./public/service-package/insurance-copy");
        }
    },
    filename: function (req, file, cb) {
        const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg|pdf)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg, Png or PDF file only.'));
        }
        cb(null, true);
    },
    storage
});


export default upload;