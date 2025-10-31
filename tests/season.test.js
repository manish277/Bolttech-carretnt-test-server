import { describe, test, expect } from '@jest/globals';
import { getSeason } from '../src/utils/season.js';

describe('getSeason', () => {
  describe('Peak Season (June 1 - September 15)', () => {
    test('should return peak for June 1', () => {
      expect(getSeason('2024-06-01')).toBe('peak');
    });

    test('should return peak for August 31', () => {
      expect(getSeason('2024-08-31')).toBe('peak');
    });

    test('should return peak for September 15', () => {
      expect(getSeason('2024-09-15')).toBe('peak');
    });
  });

  describe('Mid Season (March 1 - May 31, September 16 - October 31)', () => {
    test('should return mid for March 1', () => {
      expect(getSeason('2024-03-01')).toBe('mid');
    });

    test('should return mid for September 16', () => {
      expect(getSeason('2024-09-16')).toBe('mid');
    });

    test('should return mid for October 15', () => {
      expect(getSeason('2024-10-15')).toBe('mid');
    });

    test('should return mid for October 31', () => {
      expect(getSeason('2024-10-31')).toBe('mid');
    });
  });

  describe('Off Season (November 1 - February 29)', () => {
    test('should return off for November 1', () => {
      expect(getSeason('2024-11-01')).toBe('off');
    });

    test('should return off for February 15', () => {
      expect(getSeason('2024-02-15')).toBe('off');
    });

    test('should return off for February 29 (leap year)', () => {
      expect(getSeason('2024-02-29')).toBe('off');
    });
  });

  describe('Boundary conditions', () => {
    test('September 15 should be peak (inclusive)', () => {
      expect(getSeason('2024-09-15')).toBe('peak');
    });
    test('June 1 should be peak (inclusive)', () => {
      expect(getSeason('2024-06-01')).toBe('peak');
    });

    test('February 29 should be off (inclusive)', () => {
      expect(getSeason('2024-02-29')).toBe('off');
    });

    test('March 1 should be mid (inclusive)', () => {
      expect(getSeason('2024-03-01')).toBe('mid');
    });

    test('November 1 should be off (inclusive)', () => {
      expect(getSeason('2024-11-01')).toBe('off');
    });

    test('October 31 should be mid (inclusive)', () => {
      expect(getSeason('2024-10-31')).toBe('mid');
    });
  });
});

