import { describe, it, expect } from 'vitest';
import { numberToWords } from '../nodes/Bangla/helpers/numberToWords.js';

describe('numberToWords', () => {
  it('converts zero', () => {
    expect(numberToWords(0)).toBe('শূন্য');
  });

  it('converts single digits', () => {
    expect(numberToWords(1)).toBe('এক');
    expect(numberToWords(9)).toBe('নয়');
  });

  it('converts teens', () => {
    expect(numberToWords(11)).toBe('এগারো');
    expect(numberToWords(19)).toBe('উনিশ');
  });

  it('converts tens', () => {
    expect(numberToWords(10)).toBe('দশ');
    expect(numberToWords(20)).toBe('বিশ');
    expect(numberToWords(99)).toBe('নিরানব্বই');
  });

  it('converts hundreds', () => {
    expect(numberToWords(100)).toBe('একশো');
    expect(numberToWords(200)).toBe('দুইশো');
    expect(numberToWords(125)).toBe('একশো পঁচিশ');
  });

  it('converts thousands', () => {
    expect(numberToWords(1000)).toBe('এক হাজার');
    expect(numberToWords(1500)).toBe('এক হাজার পাঁচশো');
    expect(numberToWords(5000)).toBe('পাঁচ হাজার');
  });

  it('converts exact lakh (100,000)', () => {
    expect(numberToWords(100_000)).toBe('এক লক্ষ');
  });

  it('converts lakh range', () => {
    // 250,000 = 2 lakh 50 thousand
    expect(numberToWords(250_000)).toBe('দুই লক্ষ পঞ্চাশ হাজার');
    // 2,500,000 = 25 lakh exactly
    expect(numberToWords(2_500_000)).toBe('পঁচিশ লক্ষ');
    // 1,500,000 = 15 lakh exactly
    expect(numberToWords(1_500_000)).toBe('পনেরো লক্ষ');
  });

  it('converts exact crore (10,000,000)', () => {
    expect(numberToWords(10_000_000)).toBe('এক কোটি');
  });

  it('converts crore range', () => {
    expect(numberToWords(50_000_000)).toBe('পাঁচ কোটি');
  });

  it('converts mixed large numbers', () => {
    // 1,23,45,678 → 1 crore 23 lakh 45 thousand 678
    const result = numberToWords(12345678);
    expect(result).toContain('কোটি');
    expect(result).toContain('লক্ষ');
  });

  it('throws on negative numbers', () => {
    expect(() => numberToWords(-1)).toThrow(RangeError);
  });

  it('throws on non-integers', () => {
    expect(() => numberToWords(1.5)).toThrow(RangeError);
  });
});
