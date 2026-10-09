import type { BikeFrame } from '../../types';

export const CSV_HEADERS = [
  'brand',
  'model',
  'year',
  'size',
  'seatTubeCT',
  'stack',
  'reach',
  'effTT',
  'headTube',
  'wheelbase',
  'sourceUrl',
  'verified',
] as const;

/**
 * Converts a list of BikeFrames into a standard CSV string
 */
export function exportFramesToCsv(frames: BikeFrame[]): string {
  const headerLine = CSV_HEADERS.join(',');
  const lines = frames.map(f => {
    return [
      `"${f.brand.replace(/"/g, '""')}"`,
      `"${f.model.replace(/"/g, '""')}"`,
      f.year,
      `"${f.size.replace(/"/g, '""')}"`,
      f.seatTubeCT,
      f.stack,
      f.reach,
      f.effTT,
      f.headTube,
      f.wheelbase,
      `"${(f.sourceUrl || '').replace(/"/g, '""')}"`,
      f.verified ? 'true' : 'false',
    ].join(',');
  });

  return [headerLine, ...lines].join('\n');
}

/**
 * Parses CSV text into an array of BikeFrame objects
 */
export function parseFramesFromCsv(csvText: string): BikeFrame[] {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length <= 1) return [];

  // Parse header
  const headerCols = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

  const frames: BikeFrame[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple regex splitter respecting quoted strings
    const cols = splitCsvLine(rawLine);
    if (cols.length < 5) continue;

    const rowObj: Record<string, string> = {};
    headerCols.forEach((head, idx) => {
      rowObj[head] = cols[idx] || '';
    });

    const brand = rowObj['brand'] || 'Unknown Brand';
    const model = rowObj['model'] || 'Road Model';
    const year = parseInt(rowObj['year'], 10) || new Date().getFullYear();
    const size = rowObj['size'] || '54';
    const seatTubeCT = parseFloat(rowObj['seattubect'] || rowObj['seattube'] || '500') || 500;
    const stack = parseFloat(rowObj['stack'] || '540') || 540;
    const reach = parseFloat(rowObj['reach'] || '380') || 380;
    const effTT = parseFloat(rowObj['efftt'] || rowObj['toptube'] || '540') || 540;
    const headTube = parseFloat(rowObj['headtube'] || '140') || 140;
    const wheelbase = parseFloat(rowObj['wheelbase'] || '985') || 985;
    const sourceUrl = rowObj['sourceurl'] || '';
    const verified = rowObj['verified']?.toLowerCase() === 'true';

    frames.push({
      id: `frame_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      brand,
      model,
      year,
      size,
      seatTubeCT,
      stack,
      reach,
      effTT,
      headTube,
      wheelbase,
      sourceUrl,
      verified,
    });
  }

  return frames;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}
