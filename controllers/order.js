const mongoose = require('mongoose');
const Order = require('../models/ordersSchema');
const Record = require('../models/recordsSchema');
const Inventory = require('../models/inventorySchema');
const User = require('../models/usersSchema');


const getAll = async (req, res) => {
    try {
        const order = await Order.find();
        const response = {
            totalCount: order.length,
            order: order
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'An error occurred while fetching order' });
    }
};

const getSingle = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching Order:', error);
        res.status(500).json({ error: 'An error occurred while fetching the Order' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { albumName, condition, quantity } = req.body;


        const record = await Record.findOne({ albumName });
        const inventory = await Inventory.findOne({ albumName });

        // Check if the album exists in the database
        if (!record) {
            return res.status(404).json({ error: 'Album not found' });
        }

        // Check if the album is available in the specified condition
        if (record.condition !== condition) {
            return res.status(400).json({ error: `${albumName} not available in ${condition} condition` });
        }

        // Check if the requested quantity is available
        if (inventory.quantityInStock < quantity) {
            return res.status(400).json({ error: `Insufficient quantity available for ${albumName}` });
        }

        // Calculate total price
        const totalPrice = record.price * quantity;

        // Get the userId from the current user logged into the session
        const { displayName, emails } = req.session.user;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        // Check if a user with the same username or email already exists
        const loggedInUser = await User.findOne({ $or: [{ username: displayName }, { email }] });

        const userId = loggedInUser._id;

        // Create a new order entry
        const order = new Order({
            userId,
            albumName,
            condition,
            quantity,
            orderDate: new Date(),
            totalPrice,
            orderStatus: 'Requested'
        });

        inventory.quantityInStock -= 1;
        inventory.dateUpdated = new Date();
        await inventory.save();

        await order.save();

        res.status(201).json({ message: `Order placed successfully, Order ID: ${order._id}` });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderStatus } = req.body;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // If the order status is changed to "Cancelled", increment the quantity in stock
        if (orderStatus === 'Cancelled') {
            const inventory = await Inventory.findOne({ albumName: updatedOrder.albumName });
            if (inventory) {
                inventory.quantityInStock += updatedOrder.quantity;
                inventory.dateUpdated = new Date();
                await inventory.save();
            }
        }

        // If the order status is changed to "Delivered", delete the record from the database
        if (orderStatus === 'Delivered') {
            const record = await Record.findOneAndDelete({
                albumName: updatedOrder.albumName,
                condition: updatedOrder.condition
            });
            if (!record) {
                console.log('Record not found for deletion');
            }
        }

        res.status(200).json({ message: `Order status updated successfully to ${updatedOrder.orderStatus}` });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'An error occurred while updating the order status' });
    }
};

const findByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the provided user ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format: please check that ID is valid' });
        }

        // Find all orders made by the specified user
        const userOrders = await Order.find({ userId });

        res.status(200).json({ totalCount: userOrders.length, orders: userOrders });
    } catch (error) {
        console.error('Error finding orders by user:', error);
        res.status(500).json({ error: 'An error occurred while finding orders by user' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        // Find the order by ID and delete it
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'An error occurred while deleting the order' });
    }
};


module.exports = {
    getAll,
    getSingle,
    createOrder,
    updateOrderStatus,
    findByUser,
    deleteOrder
};

