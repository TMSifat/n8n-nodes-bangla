import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { digitConvert }          from './helpers/digitConvert.js';
import { numberToWords }         from './helpers/numberToWords.js';
import { normalize }             from './helpers/normalize.js';
import { formatDate }            from './helpers/dateFormat.js';
import { transliterateRuleBased, transliterateOllama } from './helpers/transliterate/index.js';

export class Bangla implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bangla',
    name: 'bangla',
    icon: 'file:bangla.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Bangla text toolkit — digit convert, number-to-words, normalize, date format, transliterate',
    defaults: {
      name: 'Bangla',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // ─── OPERATION SELECTOR ────────────────────────────────────────────────
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Digit Convert',
            value: 'digitConvert',
            description: 'Convert digits between Bengali (০-৯) and Latin (0-9)',
            action: 'Convert digits',
          },
          {
            name: 'Number to Bangla Words',
            value: 'numberToWords',
            description: 'Convert an integer to Bangla words (South Asian system)',
            action: 'Number to Bangla words',
          },
          {
            name: 'Normalize & Clean',
            value: 'normalize',
            description: 'NFC normalize, strip invisible characters, collapse spaces',
            action: 'Normalize and clean text',
          },
          {
            name: 'Date Format',
            value: 'dateFormat',
            description: 'Format a date with Bangla month names',
            action: 'Format date with Bangla months',
          },
          {
            name: 'Transliterate (BETA)',
            value: 'transliterate',
            description: 'Convert Banglish (romanised Bengali) to Bangla script — best-effort, BETA quality',
            action: 'Transliterate Banglish to Bangla',
          },
        ],
        default: 'digitConvert',
      },

      // ─── SHARED: TEXT INPUT ────────────────────────────────────────────────
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Input text to process',
        displayOptions: {
          show: {
            operation: ['digitConvert', 'normalize', 'transliterate'],
          },
        },
      },

      // ─── DIGIT CONVERT OPTIONS ─────────────────────────────────────────────
      {
        displayName: 'Direction',
        name: 'direction',
        type: 'options',
        options: [
          { name: 'Bengali → Latin', value: 'bangla-to-latin' },
          { name: 'Latin → Bengali', value: 'latin-to-bangla' },
        ],
        default: 'bangla-to-latin',
        displayOptions: { show: { operation: ['digitConvert'] } },
      },

      // ─── NUMBER TO WORDS OPTIONS ───────────────────────────────────────────
      {
        displayName: 'Number',
        name: 'number',
        type: 'number',
        default: 0,
        description: 'Non-negative integer to convert (0 – 999,99,99,999)',
        displayOptions: { show: { operation: ['numberToWords'] } },
      },

      // ─── NORMALIZE OPTIONS ─────────────────────────────────────────────────
      {
        displayName: 'Keep Joiners (ZWJ / ZWNJ)',
        name: 'keepJoiners',
        type: 'boolean',
        default: true,
        description: 'Whether to preserve Zero-Width Joiner (U+200D) and Zero-Width Non-Joiner (U+200C) — required for Bangla conjuncts',
        displayOptions: { show: { operation: ['normalize'] } },
      },

      // ─── DATE FORMAT OPTIONS ───────────────────────────────────────────────
      {
        displayName: 'Date',
        name: 'date',
        type: 'string',
        default: '',
        description: 'ISO 8601 date string or any format parseable by JavaScript Date()',
        displayOptions: { show: { operation: ['dateFormat'] } },
      },
      {
        displayName: 'Format',
        name: 'dateFormatStr',
        type: 'string',
        default: 'D MMMM YYYY',
        description: 'Date format string — D=day, MMMM=Bangla month, YYYY=4-digit year',
        displayOptions: { show: { operation: ['dateFormat'] } },
      },
      {
        displayName: 'Bangla Digits',
        name: 'banglaDigits',
        type: 'boolean',
        default: false,
        description: 'Whether to output numerals in Bengali digits (০-৯)',
        displayOptions: { show: { operation: ['dateFormat'] } },
      },

      // ─── TRANSLITERATE OPTIONS ─────────────────────────────────────────────
      {
        displayName: 'Engine',
        name: 'engine',
        type: 'options',
        options: [
          {
            name: 'Rule-Based (Default)',
            value: 'rule-based',
            description: 'Local phonetic rule engine — works offline, no external service',
          },
          {
            name: 'Ollama (Local LLM)',
            value: 'ollama',
            description: 'Uses a local Ollama instance (localhost:11434). Falls back to rule-based if Ollama is unreachable.',
          },
        ],
        default: 'rule-based',
        displayOptions: { show: { operation: ['transliterate'] } },
      },
      {
        displayName: 'Ollama Host',
        name: 'ollamaHost',
        type: 'string',
        default: 'http://localhost:11434',
        displayOptions: { show: { operation: ['transliterate'], engine: ['ollama'] } },
      },
      {
        displayName: 'Ollama Model',
        name: 'ollamaModel',
        type: 'string',
        default: 'llama3.1',
        displayOptions: { show: { operation: ['transliterate'], engine: ['ollama'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let outputJson: IDataObject = {};

        if (operation === 'digitConvert') {
          const text      = this.getNodeParameter('text', i)      as string;
          const direction = this.getNodeParameter('direction', i) as 'bangla-to-latin' | 'latin-to-bangla';
          outputJson = { result: digitConvert(text, direction), input: text, operation, direction };
        }

        else if (operation === 'numberToWords') {
          const num = this.getNodeParameter('number', i) as number;
          outputJson = { result: numberToWords(Math.trunc(num)), input: num, operation };
        }

        else if (operation === 'normalize') {
          const text        = this.getNodeParameter('text', i)        as string;
          const keepJoiners = this.getNodeParameter('keepJoiners', i) as boolean;
          outputJson = { result: normalize(text, { keepJoiners }), input: text, operation, keepJoiners };
        }

        else if (operation === 'dateFormat') {
          const dateStr     = this.getNodeParameter('date', i)          as string;
          const fmt         = this.getNodeParameter('dateFormatStr', i) as string;
          const banglaDigit = this.getNodeParameter('banglaDigits', i)  as boolean;
          outputJson = {
            result: formatDate(dateStr, { format: fmt, banglaDigits: banglaDigit }),
            input: dateStr,
            operation,
          };
        }

        else if (operation === 'transliterate') {
          const text   = this.getNodeParameter('text', i)   as string;
          const engine = this.getNodeParameter('engine', i) as string;

          if (engine === 'ollama') {
            const host  = this.getNodeParameter('ollamaHost', i)  as string;
            const model = this.getNodeParameter('ollamaModel', i) as string;
            const res   = await transliterateOllama(text, { host, model });
            outputJson  = { result: res.result, engine: res.engine, input: text, operation, ...(res.note ? { note: res.note } : {}) };
          } else {
            outputJson = { result: transliterateRuleBased(text), engine: 'rule-based', input: text, operation };
          }
        }

        else {
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
        }

        returnData.push({ json: outputJson, pairedItem: { item: i } });
      } catch (err) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (err as Error).message ?? String(err) },
            pairedItem: { item: i },
          });
        } else {
          throw err;
        }
      }
    }

    return [returnData];
  }
}
