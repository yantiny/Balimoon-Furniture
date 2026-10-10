import crypto from 'crypto';

/**
 * Generates a unique, non-sequential order code format: BMF-YYYYMMDD-XXXX
 * Example: BMF-20261009-A49E
 */
export function generateOrderCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomBytes = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BMF-${dateStr}-${randomBytes}`;
}
