import { describe, test, expect } from '@jest/globals';
import { getAllCars } from '../src/services/carService.js';

describe('CarService', () => {
  describe('getAllCars', () => {
    test('should return cars with pricing for peak season', async () => {
      const result = await getAllCars('2024-06-10', '2024-06-15');
      const days = 5;

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      const car = result[0];
      expect(car).toHaveProperty('totalPrice');
      expect(car).toHaveProperty('avgPerDay');
      expect(car).toHaveProperty('prices');
      expect(car.prices).toHaveProperty('peak');
      
      expect(car.totalPrice).toBeCloseTo(car.prices.peak * days, 2);
      expect(car.avgPerDay).toBeCloseTo(car.prices.peak, 2);
    });

    test('should return cars with pricing for mid season', async () => {
      const result = await getAllCars('2024-04-10', '2024-04-15');
      const days = 5;

      expect(result.length).toBeGreaterThan(0);
      const car = result[0];
      
      expect(car.totalPrice).toBeCloseTo(car.prices.mid * days, 2);
      expect(car.avgPerDay).toBeCloseTo(car.prices.mid, 2);
    });

    test('should return cars with pricing for off season', async () => {
      const result = await getAllCars('2024-12-10', '2024-12-15');
      const days = 5;

      expect(result.length).toBeGreaterThan(0);
      const car = result[0];
      
      expect(car.totalPrice).toBeCloseTo(car.prices.off * days, 2);
      expect(car.avgPerDay).toBeCloseTo(car.prices.off, 2);
    });

    test('should preserve all car properties', async () => {
      const result = await getAllCars('2024-06-01', '2024-06-11');

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('brand');
      expect(result[0]).toHaveProperty('model');
      expect(result[0]).toHaveProperty('stock');
      expect(result[0]).toHaveProperty('prices');
      expect(result[0]).toHaveProperty('totalPrice');
      expect(result[0]).toHaveProperty('avgPerDay');
    });

    test('should throw error for invalid date range', async () => {
      await expect(getAllCars('2024-06-15', '2024-06-10')).rejects.toThrow('Invalid date range');
    });

    test('should throw error when from equals to', async () => {
      await expect(getAllCars('2024-06-10', '2024-06-10')).rejects.toThrow('Invalid date range');
    });
  });
});
