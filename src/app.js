import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import carsRoute from './routes/cars.js';
import bookingsRoute from './routes/bookings.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ 
  message: 'Bolttech Car Rental API running!',
  data: { status: 'active' }
}));
app.use('/api/cars', carsRoute);
app.use('/api/bookings', bookingsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
