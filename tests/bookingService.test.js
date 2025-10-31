import { describe, test, expect } from '@jest/globals';
import { getAllBookings, createBooking } from '../src/services/bookingService.js';

describe('BookingService', () => {
  describe('getAllBookings', () => {
    test('should return all bookings', async () => {
      const result = await getAllBookings();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('createBooking', () => {
    test('should create a booking successfully', async () => {
      const bookingData = {
        userId: 5000,
        carId: 1,
        from: '2027-03-01',
        to: '2027-03-05',
        licenseExpiry: '2028-12-31'
      };

      const result = await createBooking(bookingData);

      expect(result).toHaveProperty('id');
      expect(result.userId).toBe(5000);
      expect(result.carId).toBe(1);
      expect(result.from).toBe('2027-03-01');
      expect(result.to).toBe('2027-03-05');
      expect(result.licenseExpiry).toBe('2028-12-31');
    });

    test('should throw error for missing userId', async () => {
      const bookingData = {
        carId: 1,
        from: '2024-01-15',
        to: '2024-01-20',
        licenseExpiry: '2025-06-30'
      };

      await expect(createBooking(bookingData)).rejects.toThrow('Missing required fields');
    });

    test('should throw error when license expires before booking ends', async () => {
      const bookingData = {
        userId: 5001,
        carId: 1,
        from: '2027-01-15',
        to: '2027-01-20',
        licenseExpiry: '2027-01-10'
      };

      await expect(createBooking(bookingData)).rejects.toThrow('License expires before booking ends');
    });

    test('should allow booking when license expires on booking end date', async () => {
      const bookingData = {
        userId: 5002,
        carId: 1,
        from: '2027-01-15',
        to: '2027-01-20',
        licenseExpiry: '2027-01-20'
      };

      const result = await createBooking(bookingData);
      expect(result).toHaveProperty('id');
    });

    test('should throw error when user has overlapping booking', async () => {
      // Create first booking
      await createBooking({
        userId: 5003,
        carId: 1,
        from: '2027-01-15',
        to: '2027-01-20',
        licenseExpiry: '2028-06-30'
      });

      // Try overlapping booking
      const overlappingBooking = {
        userId: 5003,
        carId: 2,
        from: '2027-01-18',
        to: '2027-01-25',
        licenseExpiry: '2028-06-30'
      };

      await expect(createBooking(overlappingBooking)).rejects.toThrow('already has a booking');
    });
  });
});
