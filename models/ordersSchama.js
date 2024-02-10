const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    recordId: {
        type: mongoose.Schema.Types.ObjectId,
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
    }
}, { collection: 'Orders' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
