import { transliterateRuleBased } from './ruleBased.js';

export interface OllamaOptions {
  host?:  string; // default http://localhost:11434
  model?: string; // default llama3.1
}

export interface TransliterateResult {
  result: string;
  engine: 'ollama' | 'rule-based';
  note?:  string;
}

export async function transliterateOllama(
  text: string,
  options: OllamaOptions = {},
): Promise<TransliterateResult> {
  const host  = options.host  ?? 'http://localhost:11434';
  const model = options.model ?? 'llama3.1';

  const prompt =
    `You are a Banglish to Bangla transliterator. ` +
    `Convert the following Banglish (romanised Bengali) text to Bangla script. ` +
    `Return ONLY the Bangla text, nothing else.\n\nInput: ${text}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response: Response;
    try {
      response = await fetch(`${host}/api/generate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ model, prompt, stream: false }),
        signal:  controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Ollama HTTP ${response.status}`);
    }

    const data = await response.json() as { response?: string };
    const ollamaResult = (data.response ?? '').trim();

    if (!ollamaResult) throw new Error('Empty response from Ollama');

    return { result: ollamaResult, engine: 'ollama' };
  } catch (err: unknown) {
    const note =
      `Ollama unreachable or failed (${(err as Error).message ?? err}); ` +
      `fell back to rule-based engine.`;
    return {
      result: transliterateRuleBased(text),
      engine: 'rule-based',
      note,
    };
  }
}
