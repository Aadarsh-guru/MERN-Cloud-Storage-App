import { Router } from "express";
import dotenv from "dotenv"
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import { requireSignIn } from '../middlewares/authMiddleware.js'
import { deleteMediaController, downloadMediaController, editMediaController, getAllMediaController, getMediaController, getUserMediaController, loadMoreFilesController, searchProductController, uploadMediaController } from "../controller/mediaController.js";
const router = Router();
dotenv.config()

const upload = multer({
    storage: new GridFsStorage({
        url: process.env.MONGO_URI,
        file: (req, file) => {
            return {
                bucketName: "media",
                filename: `${Date.now()}.${file.originalname.split('.').pop()}`
            }
        }
    })
})

router.post('/upload', requireSignIn, upload.single('files'), uploadMediaController)

router.get('/get/:filename', getMediaController)

router.get('/get-all', getAllMediaController)

router.get('/get-user-media', requireSignIn, getUserMediaController)

router.delete('/delete/:id', requireSignIn, deleteMediaController)

router.put('/edit/:id', requireSignIn, editMediaController)

router.get('/search/:keyword', searchProductController)

router.get('/more-files/:page', loadMoreFilesController)

router.get('/download/:filename', downloadMediaController)

export default router;