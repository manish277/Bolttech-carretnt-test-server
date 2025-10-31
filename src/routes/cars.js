import express from 'express';
import { getAllCars } from '../services/carService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to dates are required' });
    }

    const cars = await getAllCars(from, to);
    res.status(200).json({ 
      message: 'Cars retrieved successfully', 
      data: cars 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
