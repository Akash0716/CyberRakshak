import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { isUsingFallbackDB } from '../config/db.js';
import { LearningProgressModel } from '../models/LearningProgress.js';
import { memoryDb } from '../services/memoryDbFallback.js';

export interface Lesson {
  id: string;
  order: number;
  title: string;
  titleTe: string;
  category: string;
  description: string;
  descriptionTe: string;
  readTime: string;
  realisticExample: string;
  realisticExampleTe: string;
  safetyTips: string[];
  safetyTipsTe: string[];
  quiz: {
    question: string;
    questionTe: string;
    options: string[];
    optionsTe: string[];
    correctIndex: number;
    explanation: string;
    explanationTe: string;
  }[];
}

const LESSONS: Lesson[] = [
  {
    id: 'phishing',
    order: 1,
    title: 'Understanding Phishing & Fake Links',
    titleTe: 'ఫిషింగ్ మరియు నకిలీ లింక్‌లను అర్థం చేసుకోవడం',
    category: 'Web Security',
    description: 'Learn how cybercriminals create identical login pages and fake domains to steal student credentials.',
    descriptionTe: 'సైబర్ నేరస్థులు విద్యార్థుల లాగిన్ వివరాలను దొంగిలించడానికి నకిలీ వెబ్‌సైట్లను ఎలా సృష్టిస్తారో తెలుసుకోండి.',
    readTime: '4 mins',
    realisticExample: 'An SMS arrives: "Your exam registration fee is pending! Click vit-login-result.xyz to clear dues within 1 hour." The real domain is vishnu.edu.in.',
    realisticExampleTe: 'ఎస్ఎమ్ఎస్ వస్తుంది: "మీ పరీక్ష ఫీజు పెండింగ్‌లో ఉంది! గంటలో చెల్లించడానికి vit-login-result.xyz క్లిక్ చేయండి." నిజమైన కళాశాల డొమైన్ vishnu.edu.in మాత్రమే.',
    safetyTips: [
      'Always inspect the domain name in the address bar carefully.',
      'Vishnu Institute will only ever communicate from @vishnu.edu.in.',
      'Look out for hyphenated or misspelt domains (.xyz, .top, .club).'
    ],
    safetyTipsTe: [
      'బ్రౌజర్ అడ్రస్ బార్‌లోని డొమైన్ పేరును ఎల్లప్పుడూ జాగ్రత్తగా గమనించండి.',
      'కళాశాల ఎల్లప్పుడూ @vishnu.edu.in నుండి మాత్రమే అధికారిక సమాచారం పంపుతుంది.',
      'అనుమానాస్పద డొమైన్ల (.xyz, .top) జోలికి వెళ్లకండి.'
    ],
    quiz: [
      {
        question: 'Which of the following is an official and trusted Vishnu Institute portal link?',
        questionTe: 'ఈ క్రింది వాటిలో విష్ణు ఇన్స్టిట్యూట్ యొక్క అధికారిక పోర్టల్ ఏది?',
        options: [
          'http://vishnu-student-portal.xyz/login',
          'https://www.vishnu.edu.in/portal',
          'http://vit-bhimavaram-fees.net',
          'https://tinyurl.com/vit-results-2026'
        ],
        optionsTe: [
          'http://vishnu-student-portal.xyz/login',
          'https://www.vishnu.edu.in/portal',
          'http://vit-bhimavaram-fees.net',
          'https://tinyurl.com/vit-results-2026'
        ],
        correctIndex: 1,
        explanation: 'Only domains ending exactly in vishnu.edu.in with valid HTTPS are authentic institutional websites.',
        explanationTe: 'ఖచ్చితంగా vishnu.edu.in తో ముగిసే HTTPS వెబ్‌సైట్లు మాత్రమే అధికారికమైనవి.'
      }
    ]
  },
  {
    id: 'otp_fraud',
    order: 2,
    title: 'How OTP & Credential Fraud Works',
    titleTe: 'OTP మరియు పాస్‌వర్డ్ మోసం ఎలా జరుగుతుంది?',
    category: 'Authentication',
    description: 'Demystifying OTP harvesting scripts, SIM swapping, and urgent social engineering telephone traps.',
    descriptionTe: 'ఓటీపీ మోసాలు, సిమ్ స్వాపింగ్ మరియు అత్యవసర ఫోన్ కాల్ ఉచ్చుల గురించి తెలుసుకోండి.',
    readTime: '5 mins',
    realisticExample: 'A caller claiming to be from the State Bank of India campus branch asks you to read out a 6-digit number to stop an illegal transaction.',
    realisticExampleTe: 'క్యాంపస్ ఎస్బీఐ బ్రాంచ్ నుండి మాట్లాడుతున్నామని చెప్పి, మోసపూరిత లావాదేవీని ఆపడానికి 6 అంకెల ఓటీపీ అడుగుతారు.',
    safetyTips: [
      'Bank officers and college staff will NEVER ask for your OTP.',
      'OTP is your digital signature for authorizing a debit, not a receipt confirmation.',
      'Immediately lock your debit card / netbanking if you inadvertently gave an OTP.'
    ],
    safetyTipsTe: [
      'బ్యాంక్ అధికారులు లేదా కళాశాల సిబ్బంది ఎప్పుడూ OTP అడగరు.',
      'OTP అంటే మీ ఖాతా నుండి డబ్బు కట్ కావడానికి ఇచ్చే అనుమతి.',
      'పొరపాటున OTP చెబితే వెంటనే కార్డును బ్లాక్ చేయండి.'
    ],
    quiz: [
      {
        question: 'A college staff member calls claiming they need your OTP to process your scholarship refund. What should you do?',
        questionTe: 'స్కాలర్‌షిప్ డబ్బు జమ చేయడానికి కళాశాల సిబ్బంది OTP అడిగితే మీరు ఏమి చేయాలి?',
        options: [
          'Provide it immediately so the money credits quickly',
          'Refuse firmly, hang up, and verify directly in person at the Accounts office',
          'Give an incorrect OTP to trick them',
          'Share only 4 digits of the OTP'
        ],
        optionsTe: [
          'డబ్బులు త్వరగా రావడానికి వెంటనే OTP చెప్పాలి',
          'స్పష్టంగా తిరస్కరించి, అకౌంట్స్ కార్యాలయానికి వెళ్లి నేరుగా సంప్రదించాలి',
          'తప్పుడు OTP చెప్పాలి',
          'సగం అంకెలు మాత్రమే చెప్పాలి'
        ],
        correctIndex: 1,
        explanation: 'Official staff never require your confidential authentication OTP to deposit money into your account.',
        explanationTe: 'మీ ఖాతాలో డబ్బు వేయడానికి ఎవరికీ మీ వ్యక్తిగత OTP అవసరం ఉండదు.'
      }
    ]
  },
  {
    id: 'upi_safety',
    order: 3,
    title: 'UPI Payment Safety & QR Traps',
    titleTe: 'యూపీఐ (UPI) చెల్లింపుల భద్రత & క్యూఆర్ కోడ్ మోసాలు',
    category: 'Financial Safety',
    description: 'Master the fundamental rule of UPI: You never enter a PIN to receive funds.',
    descriptionTe: 'యూపీఐ ప్రాథమిక సూత్రం: డబ్బు అందుకోవడానికి ఎప్పుడూ పిన్ ఎంటర్ చేయకూడదు.',
    readTime: '4 mins',
    realisticExample: 'A buyer on OLX sends a QR code stating "Scan this to receive Rs. 3,500 advance for your textbooks."',
    realisticExampleTe: 'పుస్తకాల కోసం అడ్వాన్స్ ఇస్తున్నామని చెప్పి క్యూఆర్ కోడ్ స్కాన్ చేసి పిన్ ఎంటర్ చేయమని అడుగుతారు.',
    safetyTips: [
      'Scanning a QR code always DEBITS money from your bank account.',
      'To receive money, you only need to provide your UPI ID or mobile number.',
      'Always verify official college UPI handles in CyberRakshak Payment Change Guard.'
    ],
    safetyTipsTe: [
      'QR కోడ్ స్కాన్ చేసి పిన్ ఎంటర్ చేస్తే డబ్బులు కట్ అవుతాయి.',
      'డబ్బులు తీసుకోవడానికి మీ మొబైల్ నెంబర్ లేదా UPI ఐడీ మాత్రమే సరిపోతుంది.',
      'అధికారిక కళాశాల UPI ఐడీలను CyberRakshak లో ధృవీకరించుకోండి.'
    ],
    quiz: [
      {
        question: 'When is entering your 4 or 6 digit UPI PIN required?',
        questionTe: 'యూపీఐ పిన్ (UPI PIN) ఎప్పుడు ఎంటర్ చేయాల్సి ఉంటుంది?',
        options: [
          'Only when transferring or paying money out of your account',
          'When receiving a refund or cashback award',
          'When verifying your account balance from a friend',
          'When scanning any college notice board'
        ],
        optionsTe: [
          'మీ ఖాతా నుండి ఇతరులకు డబ్బులు పంపేటప్పుడు మాత్రమే',
          'క్యాష్‌బ్యాక్ లేదా రీఫండ్ పొందేటప్పుడు',
          'స్నేహితుని నుంచి బ్యాలెన్స్ చూసుకునేటప్పుడు',
          'కాలేజీ నోటీస్ బోర్డు స్కాన్ చేసేటప్పుడు'
        ],
        correctIndex: 0,
        explanation: 'Entering a UPI PIN authorizes a debit transaction. You NEVER need to enter a PIN to receive or credit money.',
        explanationTe: 'ఖాతా నుండి డబ్బు వెళ్లడానికి మాత్రమే యూపీఐ పిన్ అవసరం. డబ్బు రావడానికి పిన్ అవసరం లేదు.'
      }
    ]
  },
  {
    id: 'fake_qr_codes',
    order: 4,
    title: 'Identifying Fake & Pasted QR Codes',
    titleTe: 'నకిలీ మరియు స్టిక్కర్ అతికించిన క్యూఆర్ కోడ్లను గుర్తించడం',
    category: 'Physical Security',
    description: 'Criminals paste fraudulent QR stickers on cafeteria counters and notice boards over genuine ones.',
    descriptionTe: 'క్యాంటీన్లలో లేదా నోటీస్ బోర్డులపై నిజమైన క్యూఆర్ కోడ్లపై నకిలీ స్టిక్కర్లు అతికిస్తారు.',
    readTime: '3 mins',
    realisticExample: 'A fraudster pasted a personal Paytm QR sticker over the campus bookstore official payment desk.',
    realisticExampleTe: 'కళాశాల పుస్తకాల దుకాణం కౌంటర్‌పై ఉన్న అధికారిక క్యూఆర్ కోడ్ పైన వ్యక్తిగత స్టిక్కర్ అంటించడం.',
    safetyTips: [
      'Feel the QR board: Check if a sticker has been pasted over the original acrylic display.',
      'Confirm the displayed merchant name on your UPI app matches the store before confirming.',
      'Use CyberRakshak Smart Notice Verification to scan authentic encrypted notices.'
    ],
    safetyTipsTe: [
      'క్యూఆర్ కోడ్‌ను పరిశీలించండి: అసలు బోర్డుపై ఏదైనా స్టిక్కర్ అంటించారా అని తనిఖీ చేయండి.',
      'చెల్లించే ముందు దుకాణం పేరు లేదా కళాశాల పేరు స్క్రీన్‌పై సరిగ్గా ఉందో లేదో చూడండి.',
      'అధికారిక నోటీసుల కోసం CyberRakshak QR స్కానర్‌ను ఉపయోగించండి.'
    ],
    quiz: [
      {
        question: 'You are paying at the college cafeteria and notice a sticker peeling off on top of the original payment acrylic board. What is the safest course of action?',
        questionTe: 'క్యాంటీన్ క్యూఆర్ బోర్డుపై నకిలీ స్టిక్కర్ ఉన్నట్లు గుర్తిస్తే మీరు ఏమి చేయాలి?',
        options: [
          'Scan it anyway as long as the payment goes through',
          'Alert the vendor, do not scan, and verify the official UPI ID directly',
          'Peel it off yourself without telling anyone',
          'Enter half the amount'
        ],
        optionsTe: [
          'పర్వాలేదని అలాగే స్కాన్ చేసి చెల్లించాలి',
          'వెండర్‌ను అప్రమత్తం చేసి, స్కాన్ చేయకుండా అధికారిక UPI ఐడీ అడగాలి',
          'ఎవరికీ చెప్పకుండా దాన్ని తీసేయాలి',
          'సగం డబ్బు మాత్రమే చెల్లించాలి'
        ],
        correctIndex: 1,
        explanation: 'QR replacement is a common retail fraud technique. Always alert the vendor and confirm their official handle.',
        explanationTe: 'క్యూఆర్ స్థానంలో నకిలీ స్టిక్కర్లు అంటించడం సాధారణ మోసం. వెంటనే దుకాణదారునికి తెలియజేయాలి.'
      }
    ]
  },
  {
    id: 'fake_customer_care',
    order: 5,
    title: 'Fake Customer-Care & Search Engine Poisoning',
    titleTe: 'నకిలీ కస్టమర్ కేర్ నంబర్లు మరియు మోసాలు',
    category: 'Social Engineering',
    description: 'Why you should never trust phone numbers found directly on Google Maps or unofficial forums.',
    descriptionTe: 'గూగుల్ లేదా సోషల్ మీడియాలో కనిపించే అపరిచిత కస్టమర్ కేర్ నంబర్లను ఎందుకు నమ్మకూడదు?',
    readTime: '4 mins',
    realisticExample: 'Searching "Bhimavaram Railway ticket refund number" leads to a fake mobile number where the fraudster installs AnyDesk on your phone.',
    realisticExampleTe: 'గూగుల్‌లో నకిలీ నంబర్ చూసి ఫోన్ చేస్తే, వారు మీ ఫోన్‌లో AnyDesk లేదా TeamViewer యాప్ ఎక్కించమని మోసం చేస్తారు.',
    safetyTips: [
      'Only call numbers listed inside the official app or on certified government websites.',
      'Never install remote screen-sharing tools like AnyDesk or RustDesk at a caller request.',
      'National Cybercrime Helpline is always 1930.'
    ],
    safetyTipsTe: [
      'అధికారిక యాప్ లేదా వెబ్‌సైట్లలో మాత్రమే కస్టమర్ కేర్ నంబర్లను చూడండి.',
      'ఫోన్‌లో మాట్లాడేవారి మాట విని AnyDesk, TeamViewer వంటి రిమోట్ యాప్‌లను ఇన్‌స్టాల్ చేయవద్దు.',
      'జాతీయ సైబర్‌క్రైమ్ హెల్ప్‌లైన్ నంబర్ 1930.'
    ],
    quiz: [
      {
        question: 'A customer-care executive asks you to download "QuickSupport" or "AnyDesk" to fix your failed college fee transaction. What should you do?',
        questionTe: 'కస్టమర్ కేర్ అధికారి మీ ఫీజు సమస్య పరిష్కారానికి AnyDesk యాప్ ఇన్‌స్టాల్ చేయమంటే ఏం చేయాలి?',
        options: [
          'Install it right away and share the 9-digit remote access code',
          'Refuse and disconnect immediately; these tools grant complete remote control over your phone and banking apps',
          'Install it but turn off Wi-Fi',
          'Ask them for their Aadhaar card first'
        ],
        optionsTe: [
          'వెంటనే ఇన్‌స్టాల్ చేసి 9 అంకెల కోడ్ చెప్పాలి',
          'వెంటనే కాల్ కట్ చేయాలి; ఆ యాప్స్ మీ ఫోన్‌ను పూర్తిగా వారి ఆధీనంలోకి తీసుకుంటాయి',
          'ఇన్‌స్టాల్ చేసి వైఫై ఆపేయాలి',
          'ముందుగా వారి ఆధార్ కార్డు అడగాలి'
        ],
        correctIndex: 1,
        explanation: 'Legitimate banks and college offices will never request remote access into your personal smartphone.',
        explanationTe: 'నిజమైన బ్యాంకులు ఎప్పుడూ మీ ఫోన్‌ను రిమోట్‌గా యాక్సెస్ చేయడానికి యాప్‌లు ఎక్కించమని అడగవు.'
      }
    ]
  },
  {
    id: 'password_security',
    order: 6,
    title: 'Password Security & Multi-Factor Authentication',
    titleTe: 'పాస్‌వర్డ్ భద్రత మరియు 2-స్టెప్ వెరిఫికేషన్',
    category: 'Account Security',
    description: 'Constructing unbreakable passphrases and protecting student portal logins.',
    descriptionTe: 'బలమైన పాస్‌వర్డ్‌లను ఎలా తయారు చేసుకోవాలో మరియు ఖాతాలను ఎలా భద్రపరుచుకోవాలో తెలుసుకోండి.',
    readTime: '3 mins',
    realisticExample: 'A student uses their roll number "22PA1A0542" as their college WiFi, portal, and email password.',
    realisticExampleTe: 'విద్యార్థులు తమ రోల్ నంబర్‌నే అన్ని అకౌంట్లకు పాస్‌వర్డ్‌గా వాడటం వల్ల ఇతరులు సులభంగా లాగిన్ అవ్వగలరు.',
    safetyTips: [
      'Use passphrases of at least 12 characters combining words, numbers, and symbols.',
      'Never reuse your college email password for third-party games or shopping apps.',
      'Enable two-factor authentication (2FA) wherever supported.'
    ],
    safetyTipsTe: [
      'కనీసం 12 అక్షరాలతో కూడిన బలమైన పాస్‌వర్డ్‌లను వాడండి.',
      'కళాశాల ఈమెయిల్ పాస్‌వర్డ్‌ను ఇతర యాప్‌లకు ఎప్పుడూ వాడవద్దు.',
      'అన్ని ఖాతాలకు తప్పనిసరిగా 2FA (టూ-ఫ్యాక్టర్ వెరిఫికేషన్) ఆన్ చేయండి.'
    ],
    quiz: [
      {
        question: 'Which of the following is the strongest and most resilient password?',
        questionTe: 'ఈ క్రింది వాటిలో అత్యంత బలమైన మరియు సురక్షితమైన పాస్‌వర్డ్ ఏది?',
        options: [
          'Priya@123',
          '22PA1A0542',
          'Bhimavaram#2026!SkyMango',
          'password2026'
        ],
        optionsTe: [
          'Priya@123',
          '22PA1A0542',
          'Bhimavaram#2026!SkyMango',
          'password2026'
        ],
        correctIndex: 2,
        explanation: 'Length and unexpected word combinations with mixed character types form resilient, brute-force-proof passphrases.',
        explanationTe: 'పొడవైన పదాలు, ప్రత్యేక గుర్తులు మరియు సంఖ్యల కలయిక హ్యాకర్ల నుండి పూర్తి రక్షణ ఇస్తుంది.'
      }
    ]
  },
  {
    id: 'social_engineering',
    order: 7,
    title: 'Social Engineering & Impersonation Defense',
    titleTe: 'సోషల్ ఇంజనీరింగ్ మరియు మోసపూరిత వలల నుండి రక్షణ',
    category: 'Behavioral Cyber Defense',
    description: 'Understanding how attackers exploit urgency, authority, fear, and campus rumors to manipulate students.',
    descriptionTe: 'అధికారం, అత్యవసరత మరియు భయాన్ని ఉపయోగించి విద్యార్థులను ఎలా తప్పుదోవ పట్టిస్తారో గ్రహించండి.',
    readTime: '5 mins',
    realisticExample: 'A WhatsApp message claiming to be the College Principal threatens suspension unless you immediately complete an unverified questionnaire.',
    realisticExampleTe: 'ప్రిన్సిపాల్ గారి పేరిట నకిలీ సందేశం వచ్చి, తక్షణమే లింక్ ఓపెన్ చేయకపోతే సస్పెండ్ చేస్తామని బెదిరించడం.',
    safetyTips: [
      'Step back and breathe: High-pressure urgency is the #1 telltale sign of social engineering.',
      'Verify notices through the CyberRakshak Two-Person Approved Notice Desk.',
      'Report forged circulars promptly on the Cyber Incident Desk.'
    ],
    safetyTipsTe: [
      'కంగారు పడకండి: అత్యవసరం అని భయపెట్టడమే సైబర్ నేరస్థుల ప్రధాన వ్యూహం.',
      'నోటీసుల నిజనిజాలను ఎల్లప్పుడూ CyberRakshak పోర్టల్‌లో ధృవీకరించుకోండి.',
      'నకిలీ నోటీసులు కనిపిస్తే వెంటనే ఇన్సిడెంట్ డెస్క్‌లో రిపోర్ట్ చేయండి.'
    ],
    quiz: [
      {
        question: 'What is the primary psychological weapon exploited by social engineers and cyber fraudsters?',
        questionTe: 'సైబర్ మోసగాళ్లు బాధితులను లొంగదీసుకోవడానికి వాడే ప్రధాన ఆయుధం ఏది?',
        options: [
          'Extreme mathematical encryption',
          'Artificial urgency, fear of penalty, and panic-inducing threats',
          'Advanced artificial intelligence quantum processors',
          'Slow email notifications'
        ],
        optionsTe: [
          'గణిత సంబంధిత ఎన్‌క్రిప్షన్',
          'అత్యవసరత, జరిమానా భయం మరియు భయాందోళనలు సృష్టించడం',
          'క్వాంటం ప్రాసెసర్లు',
          'నెమ్మదిగా వచ్చే ఈమెయిల్స్'
        ],
        correctIndex: 1,
        explanation: 'Fraudsters rely on provoking emotional panic so victims act impulsively without verifying facts.',
        explanationTe: 'భయం లేదా అత్యవసరత సృష్టించి ఆలోచించే సమయం ఇవ్వకుండా మోసం చేయడమే వారి వ్యూహం.'
      }
    ]
  }
];

export function getLessons(req: AuthRequest, res: Response): void {
  res.json({
    success: true,
    count: LESSONS.length,
    lessons: LESSONS
  });
}

export async function submitQuizScore(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { lessonId, score, totalQuestions } = req.body;
    const userId = req.user?.userId || 'usr_guest';

    if (!lessonId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      res.status(400).json({ success: false, message: 'lessonId, score, and totalQuestions are required.' });
      return;
    }

    let progress: any = null;
    if (isUsingFallbackDB()) {
      progress = memoryDb.learningProgress.find(p => p.userId === userId);
      if (!progress) {
        progress = {
          userId,
          completedLessons: [],
          quizScores: [],
          badgesEarned: []
        };
        memoryDb.learningProgress.push(progress);
      }

      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }

      progress.quizScores.push({
        lessonId,
        score,
        totalQuestions,
        completedAt: new Date()
      });

      // Award badge if score is 100%
      if (score === totalQuestions && !progress.badgesEarned.includes(`master_${lessonId}`)) {
        progress.badgesEarned.push(`master_${lessonId}`);
      }
      if (progress.completedLessons.length >= LESSONS.length && !progress.badgesEarned.includes('campus_cyber_champion')) {
        progress.badgesEarned.push('campus_cyber_champion');
      }
    } else {
      try {
        progress = await LearningProgressModel.findOne({ userId });
        if (!progress) {
          progress = new LearningProgressModel({
            userId,
            completedLessons: [],
            quizScores: [],
            badgesEarned: []
          });
        }

        if (!progress.completedLessons.includes(lessonId)) {
          progress.completedLessons.push(lessonId);
        }

        progress.quizScores.push({
          lessonId,
          score,
          totalQuestions,
          completedAt: new Date()
        });

        if (score === totalQuestions && !progress.badgesEarned.includes(`master_${lessonId}`)) {
          progress.badgesEarned.push(`master_${lessonId}`);
        }
        if (progress.completedLessons.length >= LESSONS.length && !progress.badgesEarned.includes('campus_cyber_champion')) {
          progress.badgesEarned.push('campus_cyber_champion');
        }

        await progress.save();
      } catch {
        // Fallback
      }
    }

    res.json({
      success: true,
      message: 'Quiz score registered successfully.',
      progress
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUserProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'usr_guest';

    let progress: any = null;
    if (isUsingFallbackDB()) {
      progress = memoryDb.learningProgress.find(p => p.userId === userId) || {
        userId,
        completedLessons: [],
        quizScores: [],
        badgesEarned: []
      };
    } else {
      try {
        progress = await LearningProgressModel.findOne({ userId }).lean() || {
          userId,
          completedLessons: [],
          quizScores: [],
          badgesEarned: []
        };
      } catch {
        progress = {
          userId,
          completedLessons: [],
          quizScores: [],
          badgesEarned: []
        };
      }
    }

    res.json({
      success: true,
      progress,
      totalLessons: LESSONS.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

