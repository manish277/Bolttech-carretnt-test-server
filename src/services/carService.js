import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import { getSeason } from '../utils/season.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const carsPath = path.join(__dirname, '../../data/cars.json');
const bookingsPath = path.join(__dirname, '../../data/bookings.json');

export const getAllCars = async (from, to) => {
  try {
    const [cars, bookings] = await Promise.all([
      fs.readJson(carsPath),
      fs.readJson(bookingsPath)
    ]);
    const fromDate = dayjs(from);
    const toDate = dayjs(to);
    const days = toDate.diff(fromDate, 'day');

    if (days <= 0) {
      throw new Error('Invalid date range');
    }

    const availableCars = cars.map(car => {
      const overlappingCount = bookings.filter(
        b => b.carId === car.id &&
          dayjs(b.from).isBefore(toDate) &&
          dayjs(b.to).isAfter(fromDate)
      ).length;
      const availableStock = Math.max(0, car.stock - overlappingCount);
      const season = getSeason(fromDate);
      const dailyRate = car.prices[season];
      const totalPrice = dailyRate * days;
      return {
        ...car,
        availableStock,
        totalPrice: Number(totalPrice.toFixed(2)),
        avgPerDay: Number(dailyRate.toFixed(2))
      };
    });

    return availableCars;
  } catch (error) {
    throw error;
  }
};
