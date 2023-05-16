const mongoose = require('mongoose');
const { Schema, model } = mongoose

const postSchema = new Schema({
    title: {
        type: String
    },
    summary: {
        type: String
    },
    content: {
        type: String
    },
    cover: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId, ref:'User'
    }
}, {timestamps: true});

module.exports = model('Post', postSchema);