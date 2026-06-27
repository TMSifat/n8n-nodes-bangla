import { describe, it, expect } from 'vitest';
import { formatDate } from '../nodes/Bangla/helpers/dateFormat.js';

describe('formatDate', () => {
  it('uses default format D MMMM YYYY', () => {
    expect(formatDate('2024-03-15')).toBe('15 মার্চ 2024');
  });

  it('formats January correctly', () => {
    expect(formatDate('2024-01-01')).toBe('1 জানুয়ারি 2024');
  });

  it('formats December correctly', () => {
    expect(formatDate('2024-12-31')).toBe('31 ডিসেম্বর 2024');
  });

  it('outputs Bangla digits when banglaDigits=true', () => {
    const result = formatDate('2024-03-15', { banglaDigits: true });
    expect(result).toContain('মার্চ');
    expect(result).not.toContain('15');
    expect(result).toContain('১৫');
    expect(result).toContain('২০২৪');
  });

  it('accepts a Date object', () => {
    const d = new Date(2025, 5, 27); // June 27, 2025 (months 0-indexed)
    expect(formatDate(d)).toBe('27 জুন 2025');
  });

  it('throws on invalid date string', () => {
    expect(() => formatDate('not-a-date')).toThrow(RangeError);
  });

  it('respects custom format string', () => {
    expect(formatDate('2024-06-15', { format: 'DD/MM/YYYY' })).toBe('15/06/2024');
  });
});
