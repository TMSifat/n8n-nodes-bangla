export interface NormalizeOptions {
  keepJoiners?: boolean; // default true — preserves ZWJ (U+200D) and ZWNJ (U+200C)
}

// Control chars to strip: U+0000-U+0008, U+000B, U+000C, U+000E-U+001F, U+007F
// (tab U+0009, LF U+000A, CR U+000D are kept)
const STRIP_CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

// Zero-width space (U+200B), BOM (U+FEFF), soft hyphen (U+00AD)
const STRIP_INVISIBLE = /[​﻿­]/g;

// Joiners: ZWNJ (U+200C) and ZWJ (U+200D) — only stripped when keepJoiners=false
const STRIP_JOINERS = /[‌‍]/g;

export function normalize(text: string, options: NormalizeOptions = {}): string {
  const keepJoiners = options.keepJoiners !== false; // default true

  // NFC Unicode normalization
  let result = text.normalize('NFC');

  // Strip BOM, ZWSP, soft hyphen
  result = result.replace(STRIP_INVISIBLE, '');

  // Strip stray control characters (preserves tab, LF, CR)
  result = result.replace(STRIP_CONTROL, '');

  // Optionally strip joiners (default: keep them — they are meaningful in Bangla)
  if (!keepJoiners) {
    result = result.replace(STRIP_JOINERS, '');
  }

  // Collapse repeated horizontal whitespace (preserve newlines)
  result = result.replace(/[^\S\n]+/g, ' ');

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
}
