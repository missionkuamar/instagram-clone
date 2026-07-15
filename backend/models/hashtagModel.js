// models/hashtagModel.js - Minimal Version
import mongoose from 'mongoose';

const hashtagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    count: {
        type: Number,
        default: 0
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true
});

// Index for faster searches
hashtagSchema.index({ tag: 1 });

const Hashtag = mongoose.model('Hashtag', hashtagSchema);

export default Hashtag;