import Media from '../modals/mediaModel.js'
import Grid from 'gridfs-stream';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config()

const conn = mongoose.connection;
let gfs, gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'media' })
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('media')
});

export const uploadMediaController = async (req, res) => {
    try {
        const { keywords, visible } = req.body
        await Media({
            filename: req.file.filename,
            keywords,
            visible,
            userId: req.userId,
            contentType: req.file.contentType
        }).save()
        return res.status(201).json({ message: 'Media Uploded Successfully.', success: true })
    } catch (error) {
        return res.status(500).json({ message: 'Error while Uploading the media.', error: error.message, success: false })
    }
}

export const downloadMediaController = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        if (!file) {
            return res.status(200).json({ message: 'Media Does Not Exist.', error, success: false })
        }
        const readStream = gridfsBucket.openDownloadStream(file._id);
        res.set("Content-type", file.contentType)
        readStream.pipe(res);
    } catch (error) {
        return res.status(500).json({ message: 'Error while getting the Media.', error, success: false })
    }
}

export const getMediaController = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        if (!file) {
            return res.status(500).send({ message: 'File Note Exist.' })
        }
        const range = req.headers.range;
        if (range && file?.contentType.includes('video')) {
            const videoSize = file.length;
            const start = Number(range.replace(/\D/g, ""));
            const end = videoSize - 1;
            const contentLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": file.contentType,
            };
            const readStream = gridfsBucket.openDownloadStream(file?._id, { start, end })
            res.writeHead(206, headers);
            readStream.pipe(res);
        } else {
            const readStream = gridfsBucket.openDownloadStream(file._id);
            res.set("Content-type", file.contentType)
            readStream.pipe(res);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error while getting the Media.', error, success: false })
    }
}

export const getAllMediaController = async (req, res) => {
    try {
        const files = await Media.find({ visible: 'public' }).sort({ createdAt: 'descending' }).limit(9)
        return res.status(200).json({ message: 'All Media Fetched Successfully.', success: true, files })
    } catch (error) {
        return res.status(500).json({ message: 'Error while All the Media Content.', error, success: false })
    }
}

export const getUserMediaController = async (req, res) => {
    try {
        const files = await Media.find({ userId: req.userId }).sort({ createdAt: 'descending' })
        return res.status(200).json({ message: 'All User Media Fetched Successfully.', success: true, files })
    } catch (error) {
        return res.status(500).json({ message: 'Error while All the Media Content.', error, success: false })
    }
}

export const deleteMediaController = async (req, res) => {
    try {
        const file = await Media.findByIdAndDelete(req.params.id)
        const gridFsFile = await gfs.files.findOne({ filename: file?.filename })
        gridfsBucket.delete(gridFsFile._id);
        return res.status(200).json({ message: 'Media Deleted Successfully', success: true })
    } catch (error) {
        return res.status(500).json({ message: 'Error while getting the Media.', error, success: false })
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const files = await Media.find({ $or: [{ keywords: { $regex: keyword, $options: "i" }, visible: 'public' }] }).sort({ createdAt: 'descending' })
        if (files) {
            return res.status(200).json({ message: 'Searched files fetched successfully.', success: true, files })
        }
        return res.status(200).json({ message: 'Searched files Not Found', success: false })
    } catch (error) {
        return res.status(500).json({ message: 'Error while fetching search files', error, success: false })
    }
}


export const loadMoreFilesController = async (req, res) => {
    try {
        const perPage = 9;
        const page = req.params.page ? req.params.page : 1;
        const files = await Media.find({ visible: 'public' }).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: 'descending' })
        if (files) {
            return res.status(200).json({ message: 'More files fetched successfully.', success: true, files })
        }
        return res.status(200).json({ message: 'More files dont exist.', success: false })
    } catch (error) {
        return res.status(500).json({ message: 'Error while loading more files', error, success: false })
    }
}

export const editMediaController = async (req, res) => {
    try {
        const { keywords, visibility } = req.body
        if (keywords || visibility) {
            await Media.findByIdAndUpdate(req.params.id, {
                keywords: keywords,
                visible: visibility
            })
            return res.status(200).json({ message: 'Media Details Updated Successfully.', success: true })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error while updating media details.', error, success: false })
    }
}

export const deleteAllUserFilesController = async (userId) => {
    try {
        const files = await Media.find({ userId: userId })
        files.forEach(async (file) => {
            const gridFsFile = await gfs.files.findOne({ filename: file?.filename })
            await gridfsBucket.delete(gridFsFile._id)
        })
        return true;
    } catch (error) {
        return res.status(500).json({ message: 'Error while Deleting All the user Media.', error, success: false })
    }
}