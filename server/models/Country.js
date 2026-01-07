const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }, // ISO 3166-1 alpha-2
    phoneCode: { type: String, required: true }, // e.g., "+1", "+90"
    phoneFormat: { type: String, required: true }, // e.g., "XXX XXX XXXX" or "XXX XXX XX XX"
    phonePlaceholder: { type: String, required: true }, // e.g., "555 123 4567"
    flag: { type: String }, // emoji flag
    cities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
