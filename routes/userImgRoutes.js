import express from 'express'
import userImgController from '../controllers/userImgController.js'
import middleware from '../middleware/middleware.js'
import multer, { diskStorage } from 'multer'
import path from 'path'

const storage = diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'images')
    },
    filename: (_req, file, cb) => {
        file.originalname = file.originalname.slice(0, file.originalname.indexOf('.') + 1) + 'webp'
        file.mimetype = 'image/webp'
        const random = Math.random() * 876876
        cb(null, random + path.extname(file.originalname))
    }
})

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png|gif|webp/

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb)
    }
})

const router = express.Router()

router.post('/create', middleware, upload.array('images', 3), userImgController.createImg)
router.get('/', middleware, userImgController.getUserImgs)

export default router