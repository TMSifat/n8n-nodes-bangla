import { describe, it, expect } from 'vitest';
import { normalize } from '../nodes/Bangla/helpers/normalize.js';

describe('normalize', () => {
  it('NFC normalizes text', () => {
    // NFD form of "ক" (ka + combining)
    const nfd = 'কা'; // ক + া (already NFC, just checking it stays)
    expect(normalize(nfd)).toBe(nfd.normalize('NFC'));
  });

  it('strips zero-width space (U+200B)', () => {
    expect(normalize('বাং​লা')).toBe('বাংলা');
  });

  it('strips BOM (U+FEFF)', () => {
    expect(normalize('﻿হ্যালো')).toBe('হ্যালো');
  });

  it('strips soft hyphen (U+00AD)', () => {
    expect(normalize('বাং­লা')).toBe('বাংলা');
  });

  it('preserves ZWJ (U+200D) by default (keepJoiners=true)', () => {
    const withZWJ = 'ক‍খ';
    expect(normalize(withZWJ)).toBe(withZWJ);
  });

  it('preserves ZWNJ (U+200C) by default (keepJoiners=true)', () => {
    const withZWNJ = 'ক‌খ';
    expect(normalize(withZWNJ)).toBe(withZWNJ);
  });

  it('strips ZWJ when keepJoiners=false', () => {
    const withZWJ = 'ক‍খ';
    expect(normalize(withZWJ, { keepJoiners: false })).toBe('কখ');
  });

  it('strips ZWNJ when keepJoiners=false', () => {
    const withZWNJ = 'ক‌খ';
    expect(normalize(withZWNJ, { keepJoiners: false })).toBe('কখ');
  });

  it('collapses repeated spaces', () => {
    expect(normalize('বাংলা   টেক্সট')).toBe('বাংলা টেক্সট');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalize('  বাংলা  ')).toBe('বাংলা');
  });

  it('strips stray control characters', () => {
    // U+0003 (ETX control char)
    expect(normalize('বাংলা\x03টেক্সট')).toBe('বাংলাটেক্সট');
  });

  it('preserves newlines', () => {
    expect(normalize('লাইন এক\nলাইন দুই')).toBe('লাইন এক\nলাইন দুই');
  });

  it('handles empty string', () => {
    expect(normalize('')).toBe('');
  });
});
