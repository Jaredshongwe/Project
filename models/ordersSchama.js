const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    albumName: {
        type: mongoose.Schema.Types.ObjectId,
    },
    condition: {
        type: String,
        required: [true, 'Description is required'],
        enum: ['New', 'Used', 'Like New', 'Good', 'Fair'],
        default: 'New'
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    orderDate: {
        type: Date,
    },
    totalPrice: {
        type: Number,
    },
    orderStatus: {
        type: String,
        required: [true, 'Description is required'],
        enum: ['Requested', 'Delivered', 'Cancelled'],
        default: 'New'
    }
}, { collection: 'Orders' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
