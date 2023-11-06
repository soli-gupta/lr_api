import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "logo") {
            cb(null, './public/brands');
        }
        if (file.fieldname === "make_model_variant_excel") {
            cb(null, './public/brands/excel');
        }

    },
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        //make_model_variant_excel
        if (file.fieldname === "logo") {
            if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
                return cb(new Error('Please upload Jpg, Jpeg, Png and SVG Image only!'));
            }
            cb(null, true);
        }
        if (file.fieldname === "make_model_variant_excel") {
            if (!file.originalname.match(/\.(xlsx|csv|xls)$/)) {
                return cb(new Error('Please upload Xlxs and CSV files only.'));
            }
            cb(null, true);
        }
    },
    storage
})

export default upload;