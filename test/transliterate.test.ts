import { describe, it, expect } from 'vitest';
import { transliterateRuleBased } from '../nodes/Bangla/helpers/transliterate/ruleBased.js';

describe('transliterateRuleBased', () => {
  it('transliterates "ami" to আমি', () => {
    expect(transliterateRuleBased('ami')).toBe('আমি');
  });

  it('transliterates "valo" to ভালো', () => {
    expect(transliterateRuleBased('valo')).toBe('ভালো');
  });

  it('transliterates "achi" to আছি', () => {
    expect(transliterateRuleBased('achi')).toBe('আছি');
  });

  it('transliterates "ami valo achi" as a phrase', () => {
    const result = transliterateRuleBased('ami valo achi');
    expect(result).toBe('আমি ভালো আছি');
  });

  it('transliterates "dhonnobad" to ধন্যবাদ', () => {
    expect(transliterateRuleBased('dhonnobad')).toBe('ধন্যবাদ');
  });

  it('preserves punctuation and numbers', () => {
    const result = transliterateRuleBased('ami 100 taka dibo');
    expect(result).toContain('আমি');
    expect(result).toContain('100');
  });

  it('is not case-sensitive for common words', () => {
    expect(transliterateRuleBased('Ami')).toBe('আমি');
    expect(transliterateRuleBased('AMI')).toBe('আমি');
  });

  it('preserves non-Latin text unchanged', () => {
    const bangla = 'বাংলা';
    expect(transliterateRuleBased(bangla)).toBe(bangla);
  });
});
