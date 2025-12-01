const dotenv = require('dotenv');
dotenv.config();
console.log('Env loaded');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
    // Necklaces
    {
        name: 'Ethereal Gold Chain',
        description: 'A delicate 18k gold chain that captures the essence of minimalism. Perfect for layering.',
        price: 129.00,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop'],
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
        name: 'Vintage Locket Necklace',
        description: 'Heirloom-inspired gold locket with intricate floral engravings.',
        price: 185.00,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'], // Placeholder, swapping for variety
        isFeatured: false
    },

    // Rings
    {
        name: 'Celestial Diamond Ring',
        description: 'Handcrafted ring featuring a constellation of ethically sourced diamonds set in platinum.',
        price: 299.00,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Vintage Rose Gold Band',
        description: 'Intricately designed rose gold band with floral motifs. A timeless piece.',
        price: 110.00,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2080&auto=format&fit=crop'],
        isFeatured: false
    },
    {
        name: 'Minimalist Signet Ring',
        description: 'Sleek and modern gold signet ring, perfect for engraving.',
        price: 145.00,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1589674781759-c21c379563e1?q=80&w=2069&auto=format&fit=crop'],
        isFeatured: false
    },

    // Earrings
    {
        name: 'Aurora Pearl Earrings',
        description: 'Luminous freshwater pearls suspended from gold hooks. A classic addition to any collection.',
        price: 89.00,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1887&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Golden Hoop Earrings',
        description: 'Classic thick gold hoops that elevate any outfit. Lightweight and comfortable.',
        price: 75.00,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=2062&auto=format&fit=crop'],
        isFeatured: false
    },
    {
        name: 'Diamond Studs',
        description: 'Brilliant round-cut diamond studs in a 14k white gold setting.',
        price: 350.00,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1596944924616-00f3f29948dd?q=80&w=2070&auto=format&fit=crop'],
        isFeatured: false
    },

    // Bracelets
    {
        name: 'Golden Hour Bracelet',
        description: 'A chunky gold chain bracelet that makes a bold statement. Inspired by the warm glow of sunset.',
        price: 159.00,
        category: 'Bracelets',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'],
        isFeatured: true
    },
    {
        name: 'Dainty Tennis Bracelet',
        description: 'A continuous line of cubic zirconia stones set in sterling silver.',
        price: 95.00,
        category: 'Bracelets',
        images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop'], // Reusing hero image style for variety
        isFeatured: false
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zetuli_jewelry');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Seed Products
        await Product.insertMany(products);
        console.log('Seeded products');

        // Seed Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        const adminPassword = await bcrypt.hash('admin123', salt);

        const users = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                isAdmin: false
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                isAdmin: false
            },
            {
                name: 'Admin User',
                email: 'admin@zetuli.com',
                password: adminPassword,
                isAdmin: true
            }
        ];

        await User.insertMany(users);
        console.log('Seeded users');

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
