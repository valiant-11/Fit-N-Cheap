import { describe, it, expect } from 'vitest';
import { exportFramesToCsv, parseFramesFromCsv } from './csv';
import type { BikeFrame } from '../../types';

describe('Frame CSV Utilities', () => {
  const sampleFrames: BikeFrame[] = [
    {
      id: 'f1',
      brand: 'Cervelo',
      model: 'R5',
      year: 2024,
      size: '54',
      seatTubeCT: 500,
      stack: 550,
      reach: 385,
      effTT: 545,
      headTube: 140,
      wheelbase: 985,
      sourceUrl: 'https://example.com/cervelo-r5',
      verified: true,
    },
  ];

  it('exports frames to valid CSV string', () => {
    const csv = exportFramesToCsv(sampleFrames);
    expect(csv).toContain('brand,model,year,size');
    expect(csv).toContain('"Cervelo","R5",2024,"54",500,550,385');
  });

  it('parses valid CSV string back into BikeFrame objects', () => {
    const csv = `brand,model,year,size,seatTubeCT,stack,reach,effTT,headTube,wheelbase,sourceUrl,verified
"Specialized","Tarmac SL8",2024,"56",520,565,395,562,150,995,"https://example.com",true`;

    const parsed = parseFramesFromCsv(csv);
    expect(parsed.length).toBe(1);
    expect(parsed[0].brand).toBe('Specialized');
    expect(parsed[0].model).toBe('Tarmac SL8');
    expect(parsed[0].stack).toBe(565);
    expect(parsed[0].reach).toBe(395);
    expect(parsed[0].verified).toBe(true);
  });
});
