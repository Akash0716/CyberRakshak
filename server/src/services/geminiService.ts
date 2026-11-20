import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';

export interface AIAnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  riskScore: number; // 0 to 100
  category: string;
  indicators: string[];
  explanation: string;
  recommendedSteps: string[];
  safetyPrecautions: string[];
  disclaimer: string;
  source: 'gemini_api' | 'demo_advisory_engine';
  language: 'en' | 'te';
}

const TELUGU_TEMPLATES = {
  highRisk: {
    title: 'తీవ్రమైన సైబర్ మోసం ముప్పు (High Risk)',
    explanation: 'ఈ సందేశం లేదా లింక్‌లో అత్యవసర చెల్లింపులు, నకిలీ ఆఫర్లు లేదా రహస్య వివరాలు అడిగే అనుమానాస్పద సంకేతాలు ఉన్నాయి.',
    precautions: [
      'ఎట్టి పరిస్థితుల్లోనూ OTP, పాస్‌వర్డ్ లేదా UPI పిన్ ఎవరికీ చెప్పవద్దు.',
      'అనుమానాస్పద లింక్‌లపై క్లిక్ చేయవద్దు లేదా అపరిచిత యాప్‌లను ఇన్‌స్టాల్ చేయవద్దు.',
      'అధికారిక కళాశాల ట్రస్ట్‌డెస్క్ లేదా సంబంధిత విభాగాన్ని మాత్రమే సంప్రదించండి.',
      'తక్షణ సహాయం కోసం జాతీయ సైబర్‌క్రైమ్ హెల్ప్‌లైన్ 1930 కు కాల్ చేయండి.'
    ]
  },
  mediumRisk: {
    title: 'మధ్యస్థ ముప్పు (Medium Risk)',
    explanation: 'ఇందులో అస్పష్టమైన వివరాలు లేదా ధృవీకరించబడని చెల్లింపు అభ్యర్థనలు ఉండవచ్చు. మరింత జాగ్రత్త అవసరం.',
    precautions: [
      'వివరాలను ధృవీకరించే వరకు ఎలాంటి చెల్లింపులు చేయవద్దు.',
      'అధికారిక వెబ్‌సైట్ ద్వారా మాత్రమే లాగిన్ అవ్వండి.'
    ]
  },
  lowRisk: {
    title: 'తక్కువ ముప్పు లేదా సాధారణ సందేశం (Low Risk)',
    explanation: 'ఈ సమాచారంలో ప్రత్యక్ష సైబర్ మోసపూరిత సంకేతాలు కనిపించలేదు. అయితే ప్రామాణిక భద్రతా నియమాలను పాటించండి.',
    precautions: [
      'ఎల్లప్పుడూ అధికారిక నోటీసుల కోసం CyberRakshak QR కోడ్ ధృవీకరణను ఉపయోగించండి.'
    ]
  }
};

/**
 * Heuristic fallback advisor when Gemini API key is not present or offline
 */
function analyzeWithHeuristics(content: string, language: 'en' | 'te'): AIAnalysisResult {
  const lower = content.toLowerCase();
  const indicators: string[] = [];
  let score = 15;

  // Pattern detection
  if (/otp|one time password|cvv|pin|passcode|పాస్వర్డ్|ఓటిపి/i.test(lower)) {
    indicators.push('Demands sensitive credential (OTP / PIN / Password)');
    score += 40;
  }
  if (/urgent|immediately|within 10 minutes|account suspended|blocked|arrest|పోలీస్|బ్లాక్/i.test(lower)) {
    indicators.push('Artificial urgency and panic-inducing coercion tactics');
    score += 25;
  }
  if (/lottery|won|cashback|prize|reward|free gift|ఉచితం|బహుమతి/i.test(lower)) {
    indicators.push('Unrealistic financial reward or lottery hook');
    score += 25;
  }
  if (/tinyurl|bit\.ly|ngrok|\.xyz|\.top|\.ru|free-gift|login-portal/i.test(lower) || /http[s]?:\/\/[^\s]+/i.test(lower)) {
    indicators.push('Suspicious or obfuscated external URL link');
    score += 30;
  }
  if (/customer care|helpline|support desk|refund|ఎయిర్‌టెల్|బ్యాంక్/i.test(lower) && /\+91[0-9]{10}|[0-9]{10}/.test(lower)) {
    indicators.push('Unofficial mobile number masquerading as institutional customer support');
    score += 25;
  }
  if (/scan.*qr.*receive|receive.*qr/i.test(lower)) {
    indicators.push('QR-Code Scam: Classic trick claiming you must scan a QR to RECEIVE money');
    score += 40;
  }

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (score >= 60) riskLevel = 'High';
  else if (score >= 35) riskLevel = 'Medium';

  const isTelugu = language === 'te';

  let explanation = '';
  let precautions: string[] = [];
  let recommendedSteps: string[] = [];

  if (riskLevel === 'High') {
    explanation = isTelugu
      ? TELUGU_TEMPLATES.highRisk.explanation + ' గుర్తింపు పొందిన ముప్పు అంశాలు: ' + indicators.join(', ')
      : `High-risk indicators identified. The content uses psychological triggers such as urgent deadlines, request for sensitive credentials, or unverified payment redirection. Indicators: ${indicators.join(', ')}.`;

    precautions = isTelugu
      ? TELUGU_TEMPLATES.highRisk.precautions
      : [
          'Never reveal OTP, passwords, or UPI PINs over call, chat, or external web forms.',
          'Do NOT click the suspicious URL or download any attachments/remote APKs.',
          'Verify with the official Vishnu Institute administrative desk or exam cell.',
          'If funds were fraudulently debited, immediately dial 1930 (National Cybercrime Reporting Helpline).'
        ];

    recommendedSteps = isTelugu
      ? [
          'ఈ నెంబర్ లేదా లింక్‌ను వెంటనే బ్లాక్ చేయండి.',
          'CyberRakshak Incident Desk లో రిపోర్ట్ సమర్పించండి.',
          'స్నేహితులు లేదా సహ విద్యార్థులను అప్రమత్తం చేయండి.'
        ]
      : [
          'Block the sender on WhatsApp / SMS / Email immediately.',
          'File an incident report on the CyberRakshak Incident Desk for campus records.',
          'Cross-check any fee payment request against the Payment Change Guard.'
        ];
  } else if (riskLevel === 'Medium') {
    explanation = isTelugu
      ? TELUGU_TEMPLATES.mediumRisk.explanation
      : 'Moderate risk detected. The text contains unsolicited requests or unverified institutional claims that require validation.';

    precautions = isTelugu
      ? TELUGU_TEMPLATES.mediumRisk.precautions
      : [
          'Verify sender email/domain ending with @vishnu.edu.in.',
          'Check the official college notice board before taking action.'
        ];

    recommendedSteps = isTelugu
      ? ['వివరాలను సంబంధిత విభాగానికి తెలియజేయండి.']
      : ['Verify with your department coordinator before clicking or sharing.'];
  } else {
    explanation = isTelugu
      ? TELUGU_TEMPLATES.lowRisk.explanation
      : 'No blatant fraud markers detected. However, cyber hygiene is always advised when handling links or financial queries.';

    precautions = isTelugu
      ? TELUGU_TEMPLATES.lowRisk.precautions
      : ['Always verify notices using the CyberRakshak QR scan and Notice ID verification tool.'];

    recommendedSteps = isTelugu
      ? ['సురక్షితంగా కొనసాగండి.']
      : ['Proceed safely. Confirm with college staff if unsure.'];
  }

  return {
    riskLevel,
    riskScore: Math.min(score, 100),
    category: indicators.length > 0 ? indicators[0] : 'General Inquiry',
    indicators: indicators.length > 0 ? indicators : ['No acute threats identified in text structure.'],
    explanation,
    recommendedSteps,
    safetyPrecautions: precautions,
    disclaimer: 'Advisory notice: This automated analysis does not guarantee 100% scam detection. Always exercise cautious judgment.',
    source: 'demo_advisory_engine',
    language
  };
}

export async function analyzeCyberThreat(content: string, language: 'en' | 'te' = 'en'): Promise<AIAnalysisResult> {
  // If Gemini API Key is available, use Google GenAI SDK
  if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are the CyberRakshak 3.0 Campus AI Security Analyst for Vishnu Institute of Technology, Bhimavaram.
Analyze the following user-submitted message, email, SMS, URL, or incident description for cybersecurity risks (phishing, UPI/OTP fraud, fake notices, social engineering, impersonation).

Target Language: ${language === 'te' ? 'Telugu (తెలుగు)' : 'English'}

Provide an advisory security analysis. Return strictly valid JSON with this exact schema:
{
  "riskLevel": "Low" | "Medium" | "High",
  "riskScore": number (0-100),
  "category": "string",
  "indicators": ["string", "string"],
  "explanation": "string (in ${language === 'te' ? 'Telugu' : 'English'})",
  "recommendedSteps": ["string", "string"],
  "safetyPrecautions": ["string", "string"],
  "disclaimer": "This analysis is automated and advisory. Never share OTP or passwords."
}

User Content to Analyze:
"""
${content}
"""
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      // Extract json block
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: parsed.riskLevel || 'Medium',
          riskScore: parsed.riskScore || 50,
          category: parsed.category || 'Threat Analysis',
          indicators: parsed.indicators || ['Suspicious message pattern'],
          explanation: parsed.explanation || 'Analysis completed.',
          recommendedSteps: parsed.recommendedSteps || ['Exercise caution'],
          safetyPrecautions: parsed.safetyPrecautions || ['Do not share confidential credentials'],
          disclaimer: 'This analysis is advisory. Never share OTPs or confidential details.',
          source: 'gemini_api',
          language
        };
      }
    } catch (err: any) {
      console.warn('Gemini API call failed or rate-limited. Falling back to internal advisory engine:', err.message);
    }
  }

  // Graceful fallback to heuristic advisory engine
  return analyzeWithHeuristics(content, language);
}
