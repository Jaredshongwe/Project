
const mongoose = require('mongoose');
const Inventory = require('../models/inventorySchema');

const getAll = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        const response = {
            totalCount: inventory.length,
            inventory: inventory
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Inventory:', error);
        res.status(500).json({ error: 'An error occurred while fetching Inventory' });
    }
};

const getSingle = async (req, res) => {
    try {
        const inventoryId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const record = await Inventory.findById(inventoryId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching Record:', error);
        res.status(500).json({ error: 'An error occurred while fetching the Record' });
    }
};

module.exports = {
    getAll,
    getSingle,
};
