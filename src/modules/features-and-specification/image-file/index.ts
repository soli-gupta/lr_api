import multer from "multer";


const storage = multer.diskStorage({
    destination: './public/feature-specification/',
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + getFileName);
    }
});


const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            return cb(new Error('Pelase upload Jpg, Jpeg, Png or Svg image only!'));
        }
        cb(null, true);
    },
    storage: storage
});

export default upload;