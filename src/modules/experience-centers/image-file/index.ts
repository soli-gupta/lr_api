import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/experience-center',
    filename: function (req, file, cb) {
        const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg or Png file!'));
        }
        cb(null, true);
    },
    storage
});

export default upload;