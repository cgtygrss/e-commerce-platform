const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const run = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/selene_jewelry');
        console.log('Connected.');

        console.log('Querying products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();
