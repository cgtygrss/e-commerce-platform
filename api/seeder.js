const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bijuteri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const products = [
    {
        name: "Gold Vermeil Ring",
        price: 129,
        category: "Rings",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Handcrafted with precision, this 18k gold vermeil ring features a timeless design.",
        specs: [{ label: "Material", value: "18k Gold Vermeil" }, { label: "Weight", value: "4.5g" }],
        isBestseller: true
    },
    {
        name: "Pearl Drop Earrings",
        price: 89,
        category: "Earrings",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Elegant pearl drop earrings suitable for any occasion.",
        specs: [{ label: "Material", value: "Freshwater Pearl" }],
        isBestseller: true
    },
    {
        name: "Diamond Pendant",
        price: 299,
        category: "Necklaces",
        image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A stunning diamond pendant that captures the light.",
        specs: [{ label: "Carat", value: "0.5ct" }],
        isBestseller: true
    },
    {
        name: "Stackable Gold Band",
        price: 79,
        category: "Rings",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Perfect for stacking or wearing alone.",
        specs: [{ label: "Width", value: "2mm" }],
        isBestseller: false
    },
    {
        name: "Silver Chain Bracelet",
        price: 149,
        category: "Bracelets",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A classic silver chain bracelet.",
        specs: [{ label: "Length", value: "7 inches" }],
        isBestseller: false
    },
    {
        name: "Rose Gold Hoops",
        price: 99,
        category: "Earrings",
        image: "https://images.unsplash.com/photo-1630019852942-e5e1237d3d52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Chic rose gold hoops for everyday wear.",
        specs: [{ label: "Diameter", value: "20mm" }],
        isBestseller: false
    },
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
