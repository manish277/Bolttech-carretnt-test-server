import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingsPath = path.join(__dirname, '../../data/bookings.json');
const carsPath = path.join(__dirname, '../../data/cars.json');

export const getAllBookings = async () => {
  try {
    const bookings = await fs.readJson(bookingsPath);
    return bookings;
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const { userId, carId, from, to, licenseExpiry } = bookingData;
    
    if (!userId || !carId || !from || !to || !licenseExpiry) {
      throw new Error('Missing required fields');
    }

    const fromDate = dayjs(from);
    const toDate = dayjs(to);
    const expiry = dayjs(licenseExpiry);

    // Disallow bookings that start in the past (relative to today)
    const today = dayjs().startOf('day');
    if (fromDate.isBefore(today)) {
      throw new Error('Cannot create booking in the past');
    }

    if (expiry.isBefore(toDate)) {
      throw new Error('License expires before booking ends');
    }

    const [bookings, cars] = await Promise.all([
      fs.readJson(bookingsPath),
      fs.readJson(carsPath)
    ]);

    const car = cars.find(c => c.id === Number(carId));
    if (!car) {
      throw new Error('Car not found');
    }

    const overlap = bookings.find(
      b => b.userId === userId &&
        dayjs(b.from).isBefore(toDate) &&
        dayjs(b.to).isAfter(fromDate)
    );
    
    if (overlap) {
      throw new Error('User already has a booking in this date range');
    }

    // Enforce stock: count overlapping bookings for this car in the range
    const overlappingForCar = bookings.filter(
      b => b.carId === Number(carId) &&
        dayjs(b.from).isBefore(toDate) &&
        dayjs(b.to).isAfter(fromDate)
    ).length;
    if (overlappingForCar >= car.stock) {
      throw new Error('No stock available for selected dates');
    }

    const newBooking = {
      id: Date.now(),
      userId,
      carId,
      from,
      to,
      licenseExpiry,
      carBrand: car.brand,
      carModel: car.model
    };
    bookings.push(newBooking);
    await fs.writeJson(bookingsPath, bookings, { spaces: 2 });

    return newBooking;
  } catch (error) {
    throw error;
  }
};
