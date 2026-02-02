import express, { Request, Response, Router } from 'express';
import Country, { ICountry } from '../models/Country';

const router: Router = express.Router();

// @desc    Get all countries
// @route   GET /countries
// @access  Public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const countries = await Country.find({})
      .select('name code phoneCode phoneFormat phonePlaceholder flag')
      .sort('name');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get cities by country code
// @route   GET /countries/:code/cities
// @access  Public
router.get('/:code/cities', async (req: Request<{ code: string }>, res: Response): Promise<void> => {
  try {
    const country = await Country.findOne({ code: req.params.code.toUpperCase() }).select('cities');
    if (country) {
      res.json(country.cities.sort());
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get country by code
// @route   GET /countries/:code
// @access  Public
router.get('/:code', async (req: Request<{ code: string }>, res: Response): Promise<void> => {
  try {
    const country = await Country.findOne({ code: req.params.code.toUpperCase() });
    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
