// South Asian number system: কোটি/লক্ষ/হাজার (crore/lakh/thousand)
// Supports 0 through 9,99,99,999 (just under 10 crore)

const ONES: string[] = [
  'শূন্য','এক','দুই','তিন','চার','পাঁচ','ছয়','সাত','আট','নয়',
  'দশ','এগারো','বারো','তেরো','চৌদ্দ','পনেরো','ষোলো','সতেরো','আঠারো','উনিশ',
  'বিশ','একুশ','বাইশ','তেইশ','চব্বিশ','পঁচিশ','ছাব্বিশ','সাতাশ','আটাশ','উনত্রিশ',
  'ত্রিশ','একত্রিশ','বত্রিশ','তেত্রিশ','চৌত্রিশ','পঁয়ত্রিশ','ছত্রিশ','সাতত্রিশ','আটত্রিশ','উনচল্লিশ',
  'চল্লিশ','একচল্লিশ','বিয়াল্লিশ','তেতাল্লিশ','চৌচল্লিশ','পঁয়তাল্লিশ','ছেচল্লিশ','সাতচল্লিশ','আটচল্লিশ','উনপঞ্চাশ',
  'পঞ্চাশ','একান্ন','বায়ান্ন','তিপান্ন','চুয়ান্ন','পঞ্চান্ন','ছাপান্ন','সাতান্ন','আটান্ন','উনষাট',
  'ষাট','একষট্টি','বাষট্টি','তেষট্টি','চৌষট্টি','পঁয়ষট্টি','ছেষট্টি','সাতষট্টি','আটষট্টি','উনসত্তর',
  'সত্তর','একাত্তর','বাহাত্তর','তিয়াত্তর','চুয়াত্তর','পঁচাত্তর','ছিয়াত্তর','সাতাত্তর','আটাত্তর','উননব্বই',
  'আশি','একাশি','বিরাশি','তিরাশি','চুরাশি','পঁচাশি','ছিয়াশি','সাতাশি','আটাশি','উননব্বই',
  'নব্বই','একানব্বই','বিরানব্বই','তিরানব্বই','চুরানব্বই','পঁচানব্বই','ছিয়ানব্বই','সাতানব্বই','আটানব্বই','নিরানব্বই',
];

const HUNDREDS: string[] = [
  '','একশো','দুইশো','তিনশো','চারশো','পাঁচশো','ছয়শো','সাতশো','আটশো','নয়শো',
];

function twoDigit(n: number): string {
  return ONES[n] ?? '';
}

function threeDigit(n: number): string {
  if (n === 0) return '';
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(HUNDREDS[h]);
  if (rem > 0) parts.push(twoDigit(rem));
  return parts.join(' ');
}

export function numberToWords(num: number): string {
  if (!Number.isInteger(num) || num < 0) {
    throw new RangeError('numberToWords accepts non-negative integers only');
  }
  if (num === 0) return 'শূন্য';
  if (num > 999_99_99_999) {
    throw new RangeError('numberToWords supports up to 999,99,99,999 (just under 1000 crore)');
  }

  const parts: string[] = [];

  const crore = Math.floor(num / 1_00_00_000);
  num %= 1_00_00_000;
  const lakh = Math.floor(num / 1_00_000);
  num %= 1_00_000;
  const hazar = Math.floor(num / 1_000);
  num %= 1_000;
  const rest = num;

  if (crore > 0) parts.push(threeDigit(crore) + ' কোটি');
  if (lakh > 0)  parts.push(twoDigit(lakh) + ' লক্ষ');
  if (hazar > 0) parts.push(threeDigit(hazar) + ' হাজার');
  if (rest > 0)  parts.push(threeDigit(rest));

  return parts.join(' ');
}
