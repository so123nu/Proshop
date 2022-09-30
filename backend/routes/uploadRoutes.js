import path from 'path';
import express from 'express';
import multer from 'multer';


const router = express.Router()

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})


function checkFileType(file, cb) {
    const fileTypes = '/jpg|jpeg|png/'
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimeType)

    if (extname && mimeType) {
        return cb(null, true)
    } else {
        return cb(new Error(err))
    }
}

const upload = multer({
    storage,
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb)
    // },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})


router.post('/', upload.single('image'), (req, res) => {

    res.send(`/${req.file.path}`)
})


export default router;