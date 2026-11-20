import QRCode from 'qrcode';

/**
 * Generates a base64 Data URL for a QR Code
 */
export async function generateQRCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#07111F',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

