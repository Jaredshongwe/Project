
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

        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching Inventory:', error);
        res.status(500).json({ error: 'An error occurred while fetching the Inventory' });
    }
};


const deleteInventory = async (req, res) => {
    try {
        const inventoryId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        if (inventory.quantityInStock > 0) {
            return res.status(404).json({ error: 'There are still records in this Inventory' });
        }

        // Delete the inventory
        await Inventory.findByIdAndDelete(inventoryId);

        const response = 'Inventory deleted successfully';
        res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error deleting Inventory:', error);
        res.status(500).json({ error: 'An error occurred while deleting the Inventory' });
    }
};

module.exports = {
    getAll,
    getSingle,
    deleteInventory
};
