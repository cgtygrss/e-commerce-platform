const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

// Color and material mappings for existing products
const productUpdates = {
    'Ethereal Gold Chain': { color: 'Gold', material: 'Gold' },
    'Midnight Sapphire Pendant': { color: 'Blue', material: 'White Gold' },
    'Vintage Locket Necklace': { color: 'Gold', material: 'Gold' },
    'Celestial Diamond Ring': { color: 'Silver', material: 'Platinum' },
    'Vintage Rose Gold Band': { color: 'Rose Gold', material: 'Rose Gold' },
    'Minimalist Signet Ring': { color: 'Gold', material: 'Gold' },
    'Aurora Pearl Earrings': { color: 'White', material: 'Pearl' },
    'Golden Hoop Earrings': { color: 'Gold', material: 'Gold' },
    'Diamond Studs': { color: 'Silver', material: 'White Gold' },
    'Golden Hour Bracelet': { color: 'Gold', material: 'Gold' },
    'Dainty Tennis Bracelet': { color: 'Silver', material: 'Sterling Silver' },
};

const updateProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        for (const [name, updates] of Object.entries(productUpdates)) {
            const result = await Product.updateOne(
                { name: name },
                { $set: updates }
            );
            if (result.modifiedCount > 0) {
                console.log(`Updated: ${name} -> Color: ${updates.color}, Material: ${updates.material}`);
            } else if (result.matchedCount > 0) {
                console.log(`Already up to date: ${name}`);
            } else {
                console.log(`Not found: ${name}`);
            }
        }

        console.log('\nUpdate complete!');
        
        // Verify updates
        const products = await Product.find({}, 'name color material').lean();
        console.log('\nVerification:');
        products.forEach(p => console.log(`${p.name} -> Color: ${p.color || 'MISSING'} | Material: ${p.material || 'MISSING'}`));

        mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Update Error:', err.message);
        process.exit(1);
    }
};

updateProducts();
