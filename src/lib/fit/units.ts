import type { UnitSystem } from '../../types';

export const CM_PER_INCH = 2.54;

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number, decimals = 1): number {
  const inches = cm / CM_PER_INCH;
  return Number(inches.toFixed(decimals));
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number, decimals = 1): number {
  const cm = inches * CM_PER_INCH;
  return Number(cm.toFixed(decimals));
}

/**
 * Format a value stored in cm according to active unit system
 */
export function formatMeasurement(
  cmValue: number | undefined | null,
  unit: UnitSystem,
  options?: { decimals?: number; showUnit?: boolean }
): string {
  if (cmValue === undefined || cmValue === null || Number.isNaN(cmValue)) {
    return '--';
  }

  const decimals = options?.decimals ?? (unit === 'in' ? 1 : 1);
  const showUnit = options?.showUnit ?? true;

  if (unit === 'in') {
    const val = cmToInches(cmValue, decimals);
    return showUnit ? `${val} in` : `${val}`;
  }

  const val = Number(cmValue.toFixed(decimals));
  return showUnit ? `${val} cm` : `${val}`;
}

/**
 * Format millimeters to active unit (cm or in)
 */
export function formatMm(
  mmValue: number | undefined | null,
  unit: UnitSystem,
  options?: { showUnit?: boolean }
): string {
  if (mmValue === undefined || mmValue === null || Number.isNaN(mmValue)) {
    return '--';
  }

  const cmValue = mmValue / 10;
  return formatMeasurement(cmValue, unit, options);
}
