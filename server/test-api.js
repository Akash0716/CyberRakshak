// In-process End-to-end integration test runner for CyberRakshak 3.0
import './dist/index.js';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  // Give Express and in-memory DB 2.5 seconds to initialize
  await wait(2500);

  const baseUrl = 'http://127.0.0.1:5000/api';
  console.log('\n=======================================================');
  console.log('🧪 RUNNING CYBERRAKSHAK 3.0 E2E INTEGRATION TEST SUITE');
  console.log('📡 Probing endpoints at:', baseUrl);
  console.log('=======================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}:`, err.message);
    }
  }

  // 1. Health
  await test('System Health Check', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('Status not healthy');
  });

  // 2. Demo 1 - Genuine Notice
  await test('DEMO 1: Genuine Notice Verification', async () => {
    const res = await fetch(`${baseUrl}/demo/demo-1-genuine`);
    const data = await res.json();
    if (data.result !== 'VERIFIED') throw new Error(`Expected VERIFIED, got ${data.result}`);
    if (!data.originalNotice) throw new Error('Missing original notice details');
  });

  // 3. Demo 2 - Fake Notice Detection
  await test('DEMO 2: Detect Fake Notice with Tamper Breakdown', async () => {
    const res = await fetch(`${baseUrl}/demo/demo-2-fake`);
    const data = await res.json();
    if (data.result !== 'WARNING') throw new Error(`Expected WARNING, got ${data.result}`);
    if (!data.mismatches || data.mismatches.length === 0) throw new Error('Expected mismatches to be detected');
  });

  // 4. Demo 3 - Payment Mismatch
  await test('DEMO 3: Payment Change Guard Protection', async () => {
    const res = await fetch(`${baseUrl}/demo/demo-3-payment-mismatch`);
    const data = await res.json();
    if (data.result !== 'MISMATCH') throw new Error(`Expected MISMATCH, got ${data.result}`);
    if (!data.mismatchedFields) throw new Error('Expected mismatched fields details');
  });

  // 5. Demo 4 - Incident Simulation
  await test('DEMO 4: Incident Reporting Simulation', async () => {
    const res = await fetch(`${baseUrl}/demo/demo-4-incident`);
    const data = await res.json();
    if (!data.caseId || !data.caseId.startsWith('CR-INC-')) throw new Error('Invalid caseId generated');
  });

  // 6. Direct Notice Verification Endpoint (Public)
  await test('Public Smart Notice Verification', async () => {
    const res = await fetch(`${baseUrl}/notices/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noticeId: 'VIT-NOT-2026-0891' })
    });
    const data = await res.json();
    if (data.result !== 'VERIFIED') throw new Error(`Expected VERIFIED, got ${data.result}`);
  });

  // 7. Student Login & JWT Authentication
  let studentToken = '';
  await test('Student Login Authentication', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@vishnu.edu.in', password: 'Student@123' })
    });
    const data = await res.json();
    if (!data.token) throw new Error('No JWT token returned');
    studentToken = data.token;
  });

  // 8. Payment Verification with Token
  await test('Payment Change Guard Verification API', async () => {
    const res = await fetch(`${baseUrl}/payments/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        beneficiary: 'Vishnu Institute of Technology General Fund',
        upiId: 'vishnu.fees@okaxis',
        accountNumber: '30982348921',
        purpose: 'Tuition and College Development Fee',
        amount: 25000
      })
    });
    const data = await res.json();
    if (data.result !== 'MATCH') throw new Error(`Expected MATCH, got ${data.result}`);
  });

  // 9. Cyber AI Assistant Analysis (English)
  await test('Cyber AI Assistant Analysis (English)', async () => {
    const res = await fetch(`${baseUrl}/ai/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        content: 'VIT Alert: Your exam registration is cancelled due to KYC deficit. Click https://vit-fees-portal.xyz/kyc immediately to submit OTP.',
        language: 'en'
      })
    });
    const data = await res.json();
    if (!data.analysis || !data.analysis.riskLevel) throw new Error('Invalid analysis output');
    if (data.analysis.riskLevel !== 'High') throw new Error(`Expected High risk, got ${data.analysis.riskLevel}`);
  });

  // 10. Cyber AI Assistant Analysis (Telugu)
  await test('Cyber AI Assistant Analysis (Telugu)', async () => {
    const res = await fetch(`${baseUrl}/ai/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        content: 'అభినందనలు! మీరు రూ. 25,000 బహుమతి గెలుచుకున్నారు. వెంటనే మీ బ్యాంక్ అకౌంట్ మరియు OTP నమోదు చేయండి.',
        language: 'te'
      })
    });
    const data = await res.json();
    if (!data.analysis || data.analysis.language !== 'te') throw new Error('Expected Telugu output');
    if (data.analysis.riskLevel !== 'High') throw new Error(`Expected High risk, got ${data.analysis.riskLevel}`);
  });

  // 11. Learning Centre Lessons
  await test('Cyber Learning Centre Lessons API', async () => {
    const res = await fetch(`${baseUrl}/learning/lessons`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (data.count < 7) throw new Error(`Expected at least 7 lessons, found ${data.count}`);
  });

  // 12. Incidents List API
  await test('Cyber Incidents Desk API', async () => {
    const res = await fetch(`${baseUrl}/incidents`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!Array.isArray(data.incidents)) throw new Error('Expected incidents array');
  });

  console.log(`\n=======================================================`);
  console.log(`🎉 TEST SUMMARY: ${passed} / ${total} TESTS PASSED SUCCESSFULLY!`);
  console.log(`=======================================================\n`);

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
