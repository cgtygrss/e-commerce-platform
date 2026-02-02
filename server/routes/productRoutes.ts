import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const router: Router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /products called');
    console.log('Mongoose ReadyState:', mongoose.connection.readyState);

    const { category } = req.query;
    const query: { category?: string } = {};
    if (category) {
      query.category = category as string;
    }
    const products = await Product.find(query);
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get featured products
router.get('/featured/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;