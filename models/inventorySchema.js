const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    quantityInStock: {
        type: Number,
        required: [true, 'Quantity in stock is required']
    },
    dateUpdated: {
        type: Date,
    },
    albumName: {
        type: String,
        required: [true, 'Album name is required']
    }
}, { collection: 'Inventory' });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
