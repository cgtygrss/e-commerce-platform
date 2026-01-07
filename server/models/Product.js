const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    color: { type: String, default: 'Gold' },
    material: { type: String, default: 'Gold' },
    images: [{ type: String }], // Array of image URLs
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
