require('dotenv').config();
const mongoose = require('mongoose');

async function resetDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Fetching collections...');
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            console.log(`Dropping collection: ${collection.collectionName}`);
            await collection.drop();
        }

        console.log('Database reset complete. Starting from 0.');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting database:', err);
        process.exit(1);
    }
}

resetDatabase();
