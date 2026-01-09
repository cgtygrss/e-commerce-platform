const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', require('./routes/productRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/countries', require('./routes/countryRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));
app.use('/returns', require('./routes/returnRoutes'));
app.use('/shipping', require('./routes/shippingRoutes'));

app.get('/', (req, res) => {
    res.send('Lâl API is running');
});

// Database Connection
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lal_jewelry');
        console.log('MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

startServer();
