const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

const seedOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Get specific user and products
        const user = await User.findById('695e58b857d34273eb902dbc').lean();
        const products = await Product.find({}).lean();

        if (!user) {
            console.log('User not found. Please check the user ID.');
            process.exit(1);
        }

        if (products.length === 0) {
            console.log('No products found. Please seed products first.');
            process.exit(1);
        }

        console.log(`Found user: ${user.name} ${user.surname} and ${products.length} products`);

        // Clear existing orders for this user
        await Order.deleteMany({ user: user._id });
        console.log('Cleared existing orders for this user');

        // Create mock orders for the user
        const mockOrders = [];

        // Create 5 orders for the user
        const numOrders = 5;

        for (let i = 0; i < numOrders; i++) {
            // Pick 1-3 random products
            const numItems = Math.floor(Math.random() * 3) + 1;
            const orderItems = [];
            let itemsPrice = 0;

            for (let j = 0; j < numItems; j++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 2) + 1;
                
                orderItems.push({
                    name: randomProduct.name,
                    qty: qty,
                    image: randomProduct.images?.[0] || 'https://via.placeholder.com/150',
                    price: randomProduct.price,
                    product: randomProduct._id
                });
                
                itemsPrice += randomProduct.price * qty;
            }

            const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% tax
            const shippingPrice = itemsPrice > 200 ? 0 : 15;
            const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

            // Random dates within last 3 months
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90));

            const isPaid = Math.random() > 0.2; // 80% paid
            const isDelivered = isPaid && Math.random() > 0.4; // 60% of paid orders delivered

            const order = {
                user: user._id,
                orderItems,
                shippingAddress: {
                    address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                    city: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'][Math.floor(Math.random() * 5)],
                    postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
                    country: 'Turkey'
                },
                paymentMethod: ['PayPal', 'Credit Card', 'Bank Transfer'][Math.floor(Math.random() * 3)],
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt: isPaid ? orderDate : undefined,
                isDelivered,
                deliveredAt: isDelivered ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000) : undefined,
                createdAt: orderDate,
                updatedAt: orderDate
            };

            if (isPaid) {
                order.paymentResult = {
                    id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    status: 'COMPLETED',
                    update_time: orderDate.toISOString(),
                    email_address: user.email
                };
            }

            mockOrders.push(order);
        }

        // Insert orders
        await Order.insertMany(mockOrders);
        console.log(`\nCreated ${mockOrders.length} mock orders for ${user.name} ${user.surname}`);

        // Show summary
        console.log('\nOrders summary:');
        mockOrders.forEach((order, idx) => {
            const status = order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending');
            console.log(`  Order ${idx + 1}: $${order.totalPrice.toFixed(2)} - ${status} - ${order.orderItems.length} items`);
        });

        mongoose.disconnect();
        console.log('\nDone!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err.message);
        process.exit(1);
    }
};

seedOrders();
