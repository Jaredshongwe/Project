const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let database;

const initDb = (callback) => {
    if (database) {
        console.log('DB is already initialized');
        return callback(null, database);
    }

    mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
        .then((db) => {
            database = db;
            console.log('Connected to the database');
            callback(null, database);
        })
        .catch((err) => {
            console.error('Error connecting to the database:', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};
