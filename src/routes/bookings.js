import express from 'express';
import { getAllBookings, createBooking } from '../services/bookingService.js';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json({ 
      message: 'Bookings retrieved successfully', 
      data: bookings 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBooking = await createBooking(req.body);
    res.status(201).json({ 
      message: 'Booking created successfully', 
      data: newBooking 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
