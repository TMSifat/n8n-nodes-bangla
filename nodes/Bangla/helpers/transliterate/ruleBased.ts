/**
 * Banglish → Bangla rule-based phonetic transliterator.
 * Mapping follows Avro-style phonetic conventions.
 */

// Order matters: longer patterns must come before shorter ones
const PHONETIC_MAP: [string, string][] = [
  // Vowels (independent)
  ['aa',  'আ'],  ['a',   'অ'],
  ['ee',  'ই'],  ['ii',  'ঈ'],  ['i',  'ই'],
  ['uu',  'উ'],  ['u',   'উ'],
  ['e',   'এ'],
  ['oi',  'ওই'], ['o',   'ও'],
  ['ou',  'ঔ'],

  // Consonant clusters / digraphs (must come before single-char versions)
  ['kh',  'খ'],
  ['gh',  'ঘ'],
  ['chh', 'ছ'],  ['ch',  'চ'],
  ['jh',  'ঝ'],
  ['dh',  'ধ'],  ['Dh',  'ঢ'],
  ['th',  'থ'],  ['Th',  'ঠ'],
  ['ph',  'ফ'],
  ['bh',  'ভ'],
  ['sh',  'শ'],  ['Sh',  'ষ'],
  ['ng',  'ং'],

  // Single consonants
  ['k',   'ক'],
  ['g',   'গ'],
  ['j',   'জ'],
  ['t',   'ত'],  ['T',   'ট'],
  ['d',   'দ'],  ['D',   'ড'],
  ['n',   'ন'],  ['N',   'ণ'],
  ['p',   'প'],
  ['b',   'ব'],
  ['m',   'ম'],
  ['y',   'য'],
  ['r',   'র'],
  ['l',   'ল'],
  ['v',   'ভ'],
  ['w',   'ও'],
  ['s',   'স'],
  ['h',   'হ'],
  ['z',   'জ'],
  ['f',   'ফ'],
  ['c',   'ক'],
  ['q',   'ক'],
  ['x',   'ক্স'],

  // Common word-final schwa
  ['a',   'া'],
];

// Standalone word-level dictionary for common Banglish words
// Overrides pure phonetic conversion for well-known forms
const WORD_DICT: Record<string, string> = {
  ami:    'আমি',
  tumi:   'তুমি',
  apni:   'আপনি',
  valo:   'ভালো',
  bhalo:  'ভালো',
  achi:   'আছি',
  ache:   'আছে',
  acho:   'আছো',
  ki:     'কি',
  keno:   'কেন',
  na:     'না',
  haa:    'হ্যাঁ',
  ha:     'হ্যাঁ',
  je:     'যে',
  se:     'সে',
  tar:    'তার',
  amar:   'আমার',
  tomar:  'তোমার',
  apnar:  'আপনার',
  shuvo:  'শুভ',
  shubho: 'শুভ',
  asha:   'আশা',
  bhai:   'ভাই',
  bon:    'বোন',
  maa:    'মা',
  baba:   'বাবা',
  kothai: 'কোথায়',
  kothay: 'কোথায়',
  boro:   'বড়',
  choto:  'ছোট',
  din:    'দিন',
  rat:    'রাত',
  shokol: 'সকল',
  dhonnobad: 'ধন্যবাদ',
  salam:  'সালাম',
  bolun:  'বলুন',
  bolo:   'বলো',
};

function phoneticWord(word: string): string {
  // Check dictionary first (case-insensitive lookup)
  const lookup = WORD_DICT[word.toLowerCase()];
  if (lookup) return lookup;

  // Character-level phonetic mapping
  let result = '';
  let i = 0;
  const lower = word.toLowerCase();

  while (i < lower.length) {
    let matched = false;
    for (const [pattern, bangla] of PHONETIC_MAP) {
      if (lower.startsWith(pattern, i)) {
        result += bangla;
        i += pattern.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += lower[i];
      i++;
    }
  }

  return result;
}

export function transliterateRuleBased(text: string): string {
  // Process word by word, preserving punctuation/spaces
  return text.replace(/\b[a-zA-Z]+\b/g, (word) => phoneticWord(word));
}
