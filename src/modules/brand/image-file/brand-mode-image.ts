import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/brands/model',
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + getFileName);
    }
});


const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|gif|svg)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg, Png and GIF file!'));
        }
        cb(null, true);
    },
    storage
});

export default upload;