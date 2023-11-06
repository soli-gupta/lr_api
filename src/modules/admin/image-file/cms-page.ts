import multer from "multer";

const storage = multer.diskStorage({
    destination: './public/cms-page',
    filename: function (req, file, cb) {
        const uniqueShuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const getFileName = file.originalname.toLowerCase().replace(/ /g, '-');
        cb(null, file.fieldname + '-' + uniqueShuffix + '-' + getFileName);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            return cb(new Error('Please upload Jpg, Jpeg or Png file!'));
        }
        cb(null, true);
    },
    storage
});

// .fields([
//     {
//         name: 'why_choose_luxury',
//         maxCount: 1
//     },
//     {
//         name: 'selling_your_car',
//         maxCount: 1,
//     },
//     {
//         name: 'banner',
//         maxCount: 1
//     }
// ]);

export default upload;