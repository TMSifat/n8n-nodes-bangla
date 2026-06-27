const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';
const LATIN_DIGITS  = '0123456789';

export type DigitDirection = 'bangla-to-latin' | 'latin-to-bangla';

export function digitConvert(text: string, direction: DigitDirection): string {
  if (direction === 'bangla-to-latin') {
    return text.replace(/[০-৯]/g, (ch) => LATIN_DIGITS[BANGLA_DIGITS.indexOf(ch)]);
  }
  return text.replace(/[0-9]/g, (ch) => BANGLA_DIGITS[LATIN_DIGITS.indexOf(ch)]);
}
