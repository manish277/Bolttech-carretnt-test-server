import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingsPath = path.join(__dirname, '../../data/bookings.json');

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

    if (expiry.isBefore(toDate)) {
      throw new Error('License expires before booking ends');
    }

    const bookings = await fs.readJson(bookingsPath);

    const overlap = bookings.find(
      b => b.userId === userId &&
        dayjs(b.from).isBefore(toDate) &&
        dayjs(b.to).isAfter(fromDate)
    );
    
    if (overlap) {
      throw new Error('User already has a booking in this date range');
    }

    const newBooking = { id: Date.now(), userId, carId, from, to, licenseExpiry };
    bookings.push(newBooking);
    await fs.writeJson(bookingsPath, bookings, { spaces: 2 });

    return newBooking;
  } catch (error) {
    throw error;
  }
};
