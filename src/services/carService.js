import fs from 'fs-extra';
import dayjs from 'dayjs';
import { getSeason } from '../utils/season.js';

export const getAllCars = async (from, to) => {
  try {
    const cars = await fs.readJson('data/cars.json');
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
