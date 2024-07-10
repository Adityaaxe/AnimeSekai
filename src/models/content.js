const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
        unique:true
    },
    description: {
        type: String,
        required:true,
    },
    sub: {
        type: String,
        required:true
    },
    dub: {
        type: String,
        required:true
    },
    duration: {
        type: String,
        required:true
    },
    genres: [{
        type: String
    }],
    iscarousel: {
        type: Boolean,
        default: false
    },
    episodes:[{
        type: String,
    }],
    poster: {
        type: String,
    },
    vcard: {
        type: String,
        required:true
    },
    hcard: {
        type: String,
        required:true
    }

}, {timestamps: true});

// Creating Collection

const UploadContent = new mongoose.model("Content", contentSchema);

module.exports = UploadContent;