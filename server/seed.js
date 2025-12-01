const dotenv = require('dotenv');
dotenv.config();
console.log('Env loaded');

const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        name: 'Ethereal Gold Necklace',
        description: 'A delicate 18k gold necklace that captures the essence of starlight. Perfect for evening wear.',
        price: 129.00,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Celestial Diamond Ring',
        description: 'Handcrafted ring featuring a constellation of ethically sourced diamonds set in platinum.',
        price: 299.00,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Aurora Pearl Earrings',
        description: 'Luminous freshwater pearls suspended from gold hooks. A classic addition to any collection.',
        price: 89.00,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1887&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Golden Hour Bracelet',
        description: 'A chunky gold chain bracelet that makes a bold statement. Inspired by the warm glow of sunset.',
        price: 159.00,
        category: 'Bracelets',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Midnight Sapphire Pendant',
        description: 'Deep blue sapphire pendant surrounded by a halo of diamonds. Elegant and mysterious.',
        price: 450.00,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1602751584552-8ba420552259?q=80&w=1887&auto=format&fit=crop'],
        isFeatured: false
    },
    {
        name: 'Vintage Rose Gold Band',
        description: 'Intricately designed rose gold band with floral motifs. A timeless piece.',
        price: 110.00,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2080&auto=format&fit=crop'],
        isFeatured: false
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cgtygrss:cagatay479@websites.ipz7kfb.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB Connected for Seeding');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('Seeded products');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Seeding Error:', err);
        process.exit(1);
    });
