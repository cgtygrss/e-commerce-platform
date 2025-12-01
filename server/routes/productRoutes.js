const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        console.log('GET /products called');
        console.log('Mongoose ReadyState:', mongoose.connection.readyState);

        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query);
        console.log(`Found ${products.length} products`);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
