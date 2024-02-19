const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Order = require('../models/ordersSchema');
const User = require('../models/usersSchema');

const getAll = async (req, res) => {
    try {
        const user = await User.find();
        const response = {
            totalCount: user.length,
            user: user
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching user' });
    }
};

const getSingle = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching User:', error);
        res.status(500).json({ error: 'An error occurred while fetching the User' });
    }
};

const createUser = async (req, res) => {
    try {
        const { displayName, emails } = req.session.user;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username: displayName }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('default_password', 10);

        // Create a new user document in the database
        const newUser = new User({
            username: displayName,
            email: email,
            password: hashedPassword, // Set password to null
            role: 'user'    // Set role to user
        });

        await newUser.save();
        res.status(201).json({ message: `User ${newUser.username} created successfully` });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const newPassword = req.body.newPassword;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }
        // Hash the new password before storing it in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'An error occurred while changing the password' });
    }
};

const setAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const user = await User.findByIdAndUpdate(userId, { role: 'admin' });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(404).json({ error: 'Admin role already assigned' });
        }

        res.status(200).json({ message: 'User role set to admin successfully' });
    } catch (error) {
        console.error('Error setting admin role:', error);
        res.status(500).json({ error: 'An error occurred while setting admin role' });
    }
};

const setUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const user = await User.findByIdAndUpdate(userId, { role: 'user' });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'user') {
            return res.status(404).json({ error: 'User role already assigned' });
        }

        res.status(200).json({ message: 'User role set to user successfully' });
    } catch (error) {
        console.error('Error setting user role:', error);
        res.status(500).json({ error: 'An error occurred while setting user role' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete all orders associated with the user
        await Order.deleteMany({ userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        const response = 'User and associated orders deleted successfully';
        res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).json({ error: 'An error occurred while deleting the User' });
    }
};

module.exports = {
    getAll,
    getSingle,
    changePassword,
    setAdmin,
    setUser,
    createUser,
    deleteUser
};