import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import { getSeason } from '../utils/season.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const carsPath = path.join(__dirname, '../../data/cars.json');

export const getAllCars = async (from, to) => {
  try {
    const cars = await fs.readJson(carsPath);
    const fromDate = dayjs(from);
    const toDate = dayjs(to);
    const days = toDate.diff(fromDate, 'day');

    if (days <= 0) {
      throw new Error('Invalid date range');
    }

    const availableCars = cars.map(car => {
      const season = getSeason(fromDate);
      const dailyRate = car.prices[season];
      const totalPrice = dailyRate * days;
      return {
        ...car,
        totalPrice: Number(totalPrice.toFixed(2)),
        avgPerDay: Number(dailyRate.toFixed(2))
      };
    });

    return availableCars;
  } catch (error) {
    throw error;
  }
};
