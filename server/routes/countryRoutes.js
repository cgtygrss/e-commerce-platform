const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// @desc    Get all countries
// @route   GET /countries
// @access  Public
router.get('/', async (req, res) => {
    try {
        const countries = await Country.find({}).select('name code phoneCode phoneFormat phonePlaceholder flag').sort('name');
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get cities by country code
// @route   GET /countries/:code/cities
// @access  Public
router.get('/:code/cities', async (req, res) => {
    try {
        const country = await Country.findOne({ code: req.params.code.toUpperCase() }).select('cities');
        if (country) {
            res.json(country.cities.sort());
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get country by code
// @route   GET /countries/:code
// @access  Public
router.get('/:code', async (req, res) => {
    try {
        const country = await Country.findOne({ code: req.params.code.toUpperCase() });
        if (country) {
            res.json(country);
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
