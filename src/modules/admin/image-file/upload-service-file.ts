import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/upload_service_file',
    filename: function (req, file, cb) {
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xlsx|csv)$/)) {
            return cb(new Error('Please upload xlsx or csv file!'));
        }
        cb(null, true);
    },
    storage
});

export default upload;