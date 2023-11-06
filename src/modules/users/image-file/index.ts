import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/user/profile',
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + getFileName);
    }
});


const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|joeg|png)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg and Png file!'));
        }
        cb(null, true)
    },
    storage: storage
});

export default upload;