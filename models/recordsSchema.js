const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: [true, 'Album name is required']
    },
    artist: {
        type: String,
        required: [true, 'Artist is required']
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    condition: {
        type: String,
        required: [true, 'Description is required'],
        enum: ['New', 'Used', 'Like New', 'Good', 'Fair'],
        default: 'New'
    }
}, { collection: 'Records' });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
