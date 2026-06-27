import { describe, it, expect } from 'vitest';
import { digitConvert } from '../nodes/Bangla/helpers/digitConvert.js';

describe('digitConvert', () => {
  describe('bangla-to-latin', () => {
    it('converts all Bangla digits to Latin', () => {
      expect(digitConvert('০১২৩৪৫৬৭৮৯', 'bangla-to-latin')).toBe('0123456789');
    });

    it('leaves Latin digits unchanged', () => {
      expect(digitConvert('0123', 'bangla-to-latin')).toBe('0123');
    });

    it('converts mixed text correctly', () => {
      expect(digitConvert('আমার নম্বর ০১৭১২৩৪৫৬৭৮', 'bangla-to-latin')).toBe('আমার নম্বর 01712345678');
    });

    it('handles empty string', () => {
      expect(digitConvert('', 'bangla-to-latin')).toBe('');
    });
  });

  describe('latin-to-bangla', () => {
    it('converts all Latin digits to Bangla', () => {
      expect(digitConvert('0123456789', 'latin-to-bangla')).toBe('০১২৩৪৫৬৭৮৯');
    });

    it('leaves Bangla digits unchanged', () => {
      expect(digitConvert('০১২৩', 'latin-to-bangla')).toBe('০১২৩');
    });

    it('converts mixed text correctly', () => {
      expect(digitConvert('phone: 01712345678', 'latin-to-bangla')).toBe('phone: ০১৭১২৩৪৫৬৭৮');
    });

    it('is inverse of bangla-to-latin', () => {
      const original = '০১২৩৪৫৬৭৮৯';
      const roundTrip = digitConvert(digitConvert(original, 'bangla-to-latin'), 'latin-to-bangla');
      expect(roundTrip).toBe(original);
    });
  });
});
