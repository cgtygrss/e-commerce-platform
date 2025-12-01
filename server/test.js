const mongoose = require('mongoose');
console.log('Mongoose loaded');
try {
    const dotenv = require('dotenv');
    console.log('Dotenv loaded');
    dotenv.config();
    console.log('Env loaded');
} catch (e) {
    console.log('Dotenv error', e);
}

console.log('Test complete');
