import { Router } from "express";
import dotenv from "dotenv"
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import { userRegisterController, userLoginController, userProfileController, userUpdateController, deleteUserController } from '../controller/userController.js'
import { requireSignIn } from '../middlewares/authMiddleware.js'
const router = Router();
dotenv.config()

const upload = multer({
    storage: new GridFsStorage({
        url: process.env.MONGO_URI,
        file: (req, file) => {
            return {
                bucketName: "profiles",
                filename: `${Date.now()}.${file.originalname.split('.').pop()}`
            }
        }
    }),
    fileFilter: function (req, file, callback) {
        if (!file.mimetype.includes('image')) {
            return callback(Error('Only Images are allowed.'), false)
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1000000
    }
})

router.post('/register', upload.single('profile'), userRegisterController)

router.post('/login', userLoginController)

router.get('/user-profile/:filename', userProfileController)

router.put('/update', requireSignIn, upload.single('profile'), userUpdateController)

router.post('/delete-user', requireSignIn, deleteUserController)


export default router;