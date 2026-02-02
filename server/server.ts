import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import countryRoutes from './routes/countryRoutes';
import paymentRoutes from './routes/paymentRoutes';
import returnRoutes from './routes/returnRoutes';
import shippingRoutes from './routes/shippingRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/countries', countryRoutes);
app.use('/payment', paymentRoutes);
app.use('/returns', returnRoutes);
app.use('/shipping', shippingRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Velora API is running');
});

// Database Connection
const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/velora_jewelry');
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