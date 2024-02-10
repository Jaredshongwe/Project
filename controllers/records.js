const mongoose = require('mongoose');
const Record = require('../models/recordsSchema');
const Inventory = require('../models/inventorySchema');


const getAll = async (req, res) => {
    try {
        const records = await Record.find();
        const response = {
            totalCount: records.length,
            records: records
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'An error occurred while fetching records' });
    }
};

const getSingle = async (req, res) => {
    try {
        const recordId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(recordId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const record = await Record.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({ error: 'An error occurred while fetching the record' });
    }
};

const createRecord = async (req, res) => {
    try {
        const { albumName, artist, releaseYear, genre, price, description, condition } = req.body;

        // Check if a record with the same album name already exists
        let existingInventory = await Inventory.findOne({ albumName });

        if (existingInventory) {
            // If a record with the same album name exists, increment its quantity in stock
            existingInventory.quantityInStock += 1;
            existingInventory.dateUpdated = new Date();
            await existingInventory.save();

            const record = new Record({
                albumName,
                artist,
                releaseYear,
                genre,
                price,
                description,
                condition
            });
            await record.save();

            const response = 'Record create and inventory quantity updated successfully';
            return res.status(200).json({ message: response });
        }

        // If no inventory entry with the same album name exists, create a new record and inventory entry
        const record = new Record({
            albumName,
            artist,
            releaseYear,
            genre,
            price,
            description,
            condition
        });

        await record.save();

        // Create inventory entry
        const inventory = new Inventory({
            albumName,
            quantityInStock: 1, // Initial quantity in stock for new records
            dateUpdated: new Date() // Set the current date as the date updated
        });

        await inventory.save();

        const response = 'Record created successfully, inventory item added';
        res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ error: 'An error occurred while creating the record' });
    }
};

const updateRecord = async (req, res) => {
    try {
        const recordId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(recordId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const record = await Record.findByIdAndUpdate(recordId, {
            albumName: req.body.albumName,
            artist: req.body.artist,
            releaseYear: req.body.releaseYear,
            genre: req.body.genre,
            price: req.body.price,
            description: req.body.description,
            condition: req.body.condition
        });

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const response = 'Record updated successfully';
        res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'An error occurred while updating the record' });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const recordId = req.params.id;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(recordId)) {
            return res.status(400).json({ error: 'Invalid ID format: please check that ID is valid' });
        }

        const record = await Record.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const albumName = record.albumName;

        // Find the corresponding inventory entry
        const inventory = await Inventory.findOne({ albumName });

        if (inventory) {
            // If inventory entry exists, decrement the quantity in stock
            if (inventory.quantityInStock > 0) {
                inventory.quantityInStock -= 1;
                await inventory.save();
            }
        }

        // Delete the record
        await Record.findByIdAndDelete(recordId);

        const response = 'Record deleted successfully';
        res.status(200).json({ message: response });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'An error occurred while deleting the record' });
    }
};


module.exports = {
    getAll,
    getSingle,
    createRecord,
    updateRecord,
    deleteRecord
};
