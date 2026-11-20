import { Request, Response } from 'express';
import { analyzeCyberThreat } from '../services/geminiService.js';

export async function analyzeContent(req: Request, res: Response): Promise<void> {
  try {
    const { content, language = 'en' } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Content string is required for cybersecurity analysis.'
      });
      return;
    }

    const lang = (language === 'te' ? 'te' : 'en') as 'en' | 'te';
    const analysis = await analyzeCyberThreat(content, lang);

    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Analysis failed.' });
  }
}

export function getSampleScenarios(req: Request, res: Response): void {
  const scenarios = [
    {
      id: 'phishing_sms',
      title: 'Phishing SMS Alert (Exam KYC)',
      category: 'Phishing',
      sampleText: 'VIT Campus Alert: Your semester exam registration is on hold due to KYC deficit. Click https://vit-fees-portal.xyz/kyc?id=9021 immediately to update Aadhaar or your exam hall ticket will be cancelled within 2 hours.',
      language: 'en'
    },
    {
      id: 'upi_reverse_qr',
      title: 'Fake Vendor QR Refund Scam',
      category: 'UPI Fraud',
      sampleText: 'Hi bro, campus canteen refund of Rs. 450 is ready. Scan this QR code and click PAY with your UPI PIN to receive the money directly into your account.',
      language: 'en'
    },
    {
      id: 'fake_customer_care',
      title: 'Fake SBI Customer Care Helpline',
      category: 'Fake Customer-Care',
      sampleText: 'Dear customer, your SBI YONO account has been suspended for KYC. Contact immediate customer support helpline 98234-99812 to reactivate. Do not ignore.',
      language: 'en'
    },
    {
      id: 'telugu_phishing',
      title: 'తెలుగు ఫిషింగ్ సందేశం (Telugu Urgent Lottery Scam)',
      category: 'Lottery Scam',
      sampleText: 'అభినందనలు! మీరు రూ. 25,000 విద్యార్థి ప్రోత్సాహక బహుమతి గెలుచుకున్నారు. వెంటనే https://free-scholarship-vit.top లింక్‌ను ఓపెన్ చేసి మీ బ్యాంక్ అకౌంట్ మరియు OTP నమోదు చేయండి.',
      language: 'te'
    }
  ];

  res.json({
    success: true,
    scenarios
  });
}

