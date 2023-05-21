import User from '../modals/userModel.js'
import Media from '../modals/mediaModel.js'
import bcrypt from 'bcrypt'
import Grid from 'gridfs-stream';
import dotent from 'dotenv'
import mongoose from 'mongoose';
import JWT from 'jsonwebtoken'
import { deleteAllUserFilesController } from './mediaController.js';
dotent.config()

const conn = mongoose.connection;
let gfs, gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'profiles' })
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('profiles')
});


export const userRegisterController = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(200).json({ message: 'Email, Password, FirstNam, LastName are required', success: false })
        }
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(200).json({ message: 'User Already Exists Please Login', success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({ firstName, lastName, email, password: hashedPassword, profile: req.file?.filename })
        return res.status(201).json({ message: 'User Registered Successfully.', success: true })
    } catch (error) {
        return res.status(500).json({ message: 'Error while Register the user.', error: error.message, success: false })
    }
}


export const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({ message: 'Email, Password are required', success: false })
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(200).json({ message: 'invalid login credentials.', success: false })
        }
        const match = await bcrypt.compare(password, user?.password)
        if (!match) {
            return res.status(200).json({ message: 'invalid login credentials.', success: false })
        }
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET)
        return res.status(200).json({ message: 'User Logged In Successfully.', success: true, token, user })
    } catch (error) {
        return res.status(500).json({ message: 'Error while login the user.', error, success: false })
    }
}


export const userProfileController = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        if (!file) {
            return res.status(200).json({ message: 'Profile Does Not Exist.', error, success: false })
        }
        const readStream = gridfsBucket.openDownloadStream(file._id);
        res.set("Content-type", file.contentType)
        readStream.pipe(res);
    } catch (error) {
        return res.status(500).json({ message: 'Error while getting the video.', error, success: false })
    }
}

export const userUpdateController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, newPassword } = req.body;
        if (!email || !password) {
            return res.status(200).json({ message: 'Email, Password are required', success: false })
        }
        const user = await User.findOne({ email: email })
        const match = await bcrypt.compare(password, user?.password)
        if (!match) {
            return res.status(200).json({ message: 'invalid password.', success: false })
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await User.findByIdAndUpdate(user?._id, { firstName, lastName, email, password: hashedPassword, profile: req.file?.filename })
            return res.status(201).json({ message: 'User Updated Successfully.', success: true })
        }
        await User.findByIdAndUpdate(user?._id, { firstName, lastName, email, profile: req.file?.filename })
        return res.status(201).json({ message: 'User Updated Successfully.', success: true })
    } catch (error) {
        return res.status(500).json({ message: 'Error while updating the user.', error, success: false })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ message: 'Email, Password are required', success: false })
        }
        const user = await User.findOne({ email: email })
        const match = await bcrypt.compare(password, user?.password)
        if (!match) {
            return res.status(200).json({ message: 'invalid password.', success: false })
        }
        await User.findByIdAndDelete(user._id)
        await deleteAllUserFilesController(req.userId)
        await Media.deleteMany({ userId: req.userId })
        return res.status(202).json({ message: 'User Deleted Successfully.', success: true, user })
    } catch (error) {
        return res.status(500).json({ message: 'Error while Deleting the user.', error, success: false })
    }
}
