import { getInitialSeedData } from '../utils/seedData.js';
import { generateQRCodeDataUrl } from '../utils/qrGenerator.js';

/**
 * High-performance, reactive In-Memory Database store.
 * Operates seamlessly when local MongoDB service is unavailable,
 * mirroring Mongoose collections with identical schema structures.
 */
class MemoryDatabase {
  public users: any[] = [];
  public notices: any[] = [];
  public noticeHistories: any[] = [];
  public paymentRecords: any[] = [];
  public incidents: any[] = [];
  public verificationLogs: any[] = [];
  public learningProgress: any[] = [];
  private initialized = false;

  public async init() {
    if (this.initialized) return;
    const seed = await getInitialSeedData();
    this.users = [...seed.users];
    this.notices = [...seed.notices];
    this.noticeHistories = [...seed.noticeHistories];
    this.paymentRecords = [...seed.paymentRecords];
    this.incidents = [...seed.incidents];

    // Generate QR codes for initial notices
    for (const notice of this.notices) {
      if (!notice.qrCodeUrl) {
        const payload = JSON.stringify({
          noticeId: notice.noticeId,
          contentHash: notice.contentHash,
          title: notice.title,
          issuer: notice.issuer,
          v: notice.version
        });
        notice.qrCodeUrl = await generateQRCodeDataUrl(payload);
      }
    }

    this.initialized = true;
    console.log('✅ In-Memory Fallback Database initialized with rich Vishnu campus seed data.');
  }
}

export const memoryDb = new MemoryDatabase();

