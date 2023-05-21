import mongoose from "mongoose";

const fileSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    visible: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Media = mongoose.model('file', fileSchema);

export default Media;