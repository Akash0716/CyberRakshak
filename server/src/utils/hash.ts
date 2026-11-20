import crypto from 'crypto';

/**
 * Calculates SHA-256 hash of a text string or buffer
 */
export function calculateSHA256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generates structured notice content hash based on core integrity fields
 */
export function generateNoticeIntegrityHash(fields: {
  title: string;
  department: string;
  issuer: string;
  description: string;
  expiryDate: string | Date;
  category: string;
}): string {
  const normalized = [
    fields.title.trim().toLowerCase(),
    fields.department.trim().toLowerCase(),
    fields.issuer.trim().toLowerCase(),
    fields.description.trim().replace(/\r\n/g, '\n'),
    new Date(fields.expiryDate).toISOString().split('T')[0],
    fields.category.trim().toLowerCase()
  ].join('||');

  return calculateSHA256(normalized);
}

