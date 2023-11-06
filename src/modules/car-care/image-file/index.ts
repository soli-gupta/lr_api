import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/car-care-category',
    filename: function (req, file, cb) {
        const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const getFileName = file.originalname.toLocaleLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg, Png or Svg Image only!'));
        }
        cb(null, true);
    },
    storage: storage,
});


export default upload;