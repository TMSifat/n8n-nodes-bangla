import { digitConvert } from './digitConvert.js';

const BANGLA_MONTHS: string[] = [
  'জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন',
  'জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর',
];

export interface DateFormatOptions {
  banglaDigits?: boolean;   // default false
  format?: string;          // default 'D MMMM YYYY'
}

export function formatDate(input: string | Date, options: DateFormatOptions = {}): string {
  const banglaDigits = options.banglaDigits ?? false;
  const fmt = options.format ?? 'D MMMM YYYY';

  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) {
    throw new RangeError(`Invalid date: ${input}`);
  }

  const day   = date.getDate();
  const month = date.getMonth();      // 0-indexed
  const year  = date.getFullYear();

  let result = fmt
    .replace('YYYY', String(year))
    .replace('YY',   String(year).slice(-2))
    .replace('MMMM', BANGLA_MONTHS[month])
    .replace('MM',   String(month + 1).padStart(2, '0'))
    .replace('M',    String(month + 1))
    .replace('DD',   String(day).padStart(2, '0'))
    .replace('D',    String(day));

  if (banglaDigits) {
    result = digitConvert(result, 'latin-to-bangla');
  }

  return result;
}
