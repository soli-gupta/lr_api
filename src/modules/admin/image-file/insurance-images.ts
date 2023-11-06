import multer from "multer";


const storage = multer.diskStorage({
    destination: './public/insurance',
    filename: function (req, file, cb) {
        const uniquShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');

        cb(null, file.fieldname + '-' + uniquShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|svg)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg, Png, Pdf or SVG file.'));
        }
        cb(null, true);
    },
    storage
});


export default upload;

