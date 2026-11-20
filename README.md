# CYBERRAKSHAK 3.0 – CAMPUS TRUSTDESK
### Centralized Campus Digital-Trust & Cybersecurity Protection Platform
**Vishnu Institute of Technology, Bhimavaram**  
*A Community Service Project engineered by 11 CSE Students*

---

## 1. Project Overview & Origin

CyberRakshak 3.0 is a production-grade full-stack cybersecurity application built specifically to protect the academic community of **Vishnu Institute of Technology, Bhimavaram** against escalating digital threats, payment frauds, forged institutional circulars, and phishing traps.

### The 6 Core Problems Identified in Our Community Survey
1. **Phishing Attacks & Deceptive Links**: Urgent SMS/WhatsApp messages claiming exam cancellation or KYC deficits designed to steal student portal credentials.
2. **OTP & UPI Payment Fraud**: Deceptive prompts coercing students into entering their UPI PIN under the false premise of receiving cashbacks or canteen refunds.
3. **Fake Customer-Care Calls**: Impersonators masquerading as bank branch managers or exam controllers demanding sensitive credentials.
4. **Counterfeit & Pasted QR Scams**: Malicious QR codes pasted over official payment counters at campus cafeterias and bookstores.
5. **Reporting Friction & Stigma**: Difficulty reporting cyber incidents promptly, causing delays in freezing fraudulent transactions within the golden 2-hour window.
6. **Language Barriers in Threat Intelligence**: Technical cybersecurity alerts written exclusively in English, leaving non-technical staff and students vulnerable.

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Custom Dark Navy `#07111F` Cyber Design System), Lucide React, React Router v6, Axios, Recharts (Analytics), `html5-qrcode` (Live Camera & File QR scanner), `jspdf` & `jspdf-autotable` (Structured Trust Receipts), `canvas-confetti`.
- **Backend**: Node.js, Express.js, TypeScript, REST APIs, JWT authentication, `bcryptjs` password hashing, Role-Based Access Control (RBAC), `qrcode`, `uuid`.
- **Database**: MongoDB with Mongoose ODM + **Intelligent Reactive In-Memory Fallback Database** that automatically seeds realistic campus data and operates seamlessly if a local MongoDB service is offline.
- **AI Integration**: Google Gemini API (`@google/generative-ai` SDK) with bilingual English and Telugu threat assessment, heuristic fallback advisory, and safety guardrails.
- **Integrations**: National Cybercrime Helpline **1930** integration, `cybercrime.gov.in` escalation protocol, SHA-256 cryptographic notice digest.

---

## 3. Architecture & Folder Structure

```
CyberRakshak/
├── client/                      # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── assets/              # Icons and brand vectors
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Navbar, Sidebar, Footer, EmergencyBanner, Modal, Toast
│   │   │   ├── notice/          # QRScannerModal, NoticeReceiptModal, NoticeTimeline
│   │   │   └── payment/         # PaymentReceiptModal
│   │   ├── context/             # AuthContext, AccessibilityContext, ToastContext
│   │   ├── layouts/             # MainLayout, DashboardLayout
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, LiveDemoPage
│   │   │   ├── dashboards/      # StudentDashboard, AdminDashboard, ApproverDashboard
│   │   │   ├── NoticeVerificationPage.tsx
│   │   │   ├── PaymentGuardPage.tsx
│   │   │   ├── CyberAssistantPage.tsx
│   │   │   ├── IncidentDeskPage.tsx
│   │   │   └── LearningCentrePage.tsx
│   │   ├── services/            # Axios API client with interceptors
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # PDF receipt generators, translations (en/te)
│   ├── tailwind.config.js       # Cybersecurity theme (#07111F, cyan, neon blue)
│   └── vite.config.ts           # Dev server & reverse proxy
│
├── server/                      # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/              # Environment variables & MongoDB connection
│   │   ├── controllers/         # Auth, Notice, Payment, AI, Incident, Learning, Demo
│   │   ├── middleware/          # JWT authentication, role authorization, errorHandler
│   │   ├── models/              # User, Notice, NoticeHistory, PaymentRecord, Incident, VerificationLog, LearningProgress
│   │   ├── routes/              # Express API route modules
│   │   ├── services/            # Gemini API, Notice Verification (SHA-256), In-Memory DB
│   │   └── utils/               # Seed data, QR code generator, Cryptographic hash
│   ├── .env.example             # Configuration template
│   └── tsconfig.json            # Strict TypeScript configuration
└── README.md                    # Project documentation
```

---

## 4. User Roles & Access Control

1. **Student** (`student@vishnu.edu.in` / `Student@123`):
   - Access Student Security Dashboard with metrics.
   - Verify notices via Notice ID or live device Camera QR scanner.
   - Verify payment targets against official Vishnu accounts.
   - Interact with bilingual Cyber AI Assistant.
   - Submit cyber incident reports with Case Reference tracking.
   - Access 7-module Cyber Learning Centre and complete quizzes.

2. **Administrator** (`admin@vishnu.edu.in` / `Admin@123`):
   - Draft and create official college notices (automatically queued for independent approval).
   - Revoke notices with required administrative reasoning.
   - Manage registered campus payment accounts.
   - Review submitted incidents, update status, and attach internal remediation remarks.
   - Access real-time Recharts analytics (incident trends & notice status breakdown).

3. **Independent Approver** (`approver@vishnu.edu.in` / `Approver@123`):
   - Review pending notices submitted by administrators (Dual-Authorization protocol).
   - Approve notice (signs with cryptographic approver seal & publishes circular).
   - Reject notice (with mandatory rejection reason recorded in immutable audit log).
   - Request modifications.

---

## 5. Priority Features Breakdown

### Priority Feature 1: Smart Notice Verification
- **Dual-Approval Workflow**: `Created` → `Pending Review` → `Approved` → `Published`. Administrators cannot unilaterally publish sensitive circulars.
- **Cryptographic Tamper Detection**: Evaluates submitted circular details against original SHA-256 digests. Flags altered titles, fake payment UPI IDs, changed dates, or modified descriptions.
- **Six Verdict States**: `VERIFIED`, `WARNING` (tampered), `REJECTED`, `EXPIRED`, `REVOKED`, `NOT_FOUND`.
- **Notice History Audit Trail**: Tracks who created, reviewed, approved, published, or revoked circulars with exact timestamps.
- **Trust Decision Receipt**: Downloadable official PDF receipt with verification reference, digital seal, and recommended student actions.

### Priority Feature 2: Payment Change Guard
- **Approved Account Registry**: Pre-registers Vishnu Institute tuition, examination, and hostel bank details.
- **Live Comparison Engine**: Students input beneficiary name, UPI ID, or account number; system checks for spoofing or variation.
- **Verdict States**: `MATCH`, `MISMATCH` (alerts potential fraud e.g. `vishnu.fee.payment@okaxis` vs `vishnu.fees@okaxis`), and `REVIEW_REQUIRED`.
- **Safety Guarantee**: CyberRakshak never initiates payments, connects to bank APIs, or stores card CVVs or OTPs.

### Priority Feature 3: Cyber AI Assistant (Google Gemini)
- Conversational chat interface analyzing suspicious text, SMS, URLs, or phone call descriptions.
- Multi-dimensional diagnosis: Risk Level (`Low`, `Medium`, `High`), Threat Score (0–100), Suspicious Indicators, Plain Language Explanation, Recommended Next Steps, Safety Precautions.
- **Bilingual**: Toggle between English and Telugu (తెలుగు) seamlessly.
- **Advisory Fallback**: Built-in intelligent advisory engine ensures full functionality during evaluations even if external API keys are unavailable.

### Priority Feature 4: Cyber Incident Desk
- Reporting for 8 categories: Phishing, OTP Fraud, UPI Fraud, Fake Customer-Care, QR Scams, Fake Notices, Identity Theft, Other.
- Generates unique institutional case tracking number (e.g. `CR-INC-2026-4019`).
- Escalation guidance for National Cybercrime Reporting Helpline **1930** and direct link to `cybercrime.gov.in`.

### Priority Feature 5: Cyber Learning Centre
- 7 interactive curriculum modules with English & Telugu content:
  1. Understanding Phishing
  2. How OTP Fraud Works
  3. UPI Payment Safety
  4. Identifying Fake QR Codes
  5. Fake Customer-Care Scams
  6. Password & Account Security
  7. Social Engineering Defense
- Interactive quizzes, instant answer validation, confetti celebrations, and champion badges.

### Priority Feature 6: Accessibility Mode
- Font size switcher (Normal / Large A+ font).
- High-contrast mode for visually impaired users.
- English & Telugu bilingual switcher.

---

## 6. Section 12: Mandatory Live Demonstration Mode

Navigate to `/demo` in the application for one-click live presentations:

1. **DEMO 1 – Genuine Notice**:
   - Button: *Verify Genuine Notice*
   - Verifies registered exam fee circular `VIT-NOT-2026-0891`.
   - Result: `VERIFIED`, shows author, approver, and SHA-256 hash.

2. **DEMO 2 – Detect Fake Notice**:
   - Button: *Detect Fake Notice*
   - Intercepts an altered circular with tampered UPI and dates.
   - Result: `WARNING`, displays side-by-side mismatch matrix highlighting exact discrepancies.

3. **DEMO 3 – Payment Protection**:
   - Button: *Test Payment Protection*
   - Compares official UPI `vishnu.fees@okaxis` against fake `vishnu.fee.payment@okaxis`.
   - Result: `MISMATCH`, critical warning to hold funds.

4. **DEMO 4 – Simulate Cyber Incident**:
   - Button: *Simulate Cyber Incident*
   - Submits a simulated phishing attack, generates unique Case Reference `CR-INC-2026-XXXX`, and displays 1930 emergency advisory.

---

## 7. Quick Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm
- MongoDB (Optional: app automatically uses embedded reactive in-memory database fallback if MongoDB is not running locally)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd CyberRakshak

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/cyberrakshak
JWT_SECRET=cyberrakshak_campus_trustdesk_jwt_secret_key_2026

# Optional: Google Gemini API Key for Cyber AI Assistant
# If left blank, the integrated advisory engine executes seamlessly
GEMINI_API_KEY=
```

### 3. Run Application

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs at: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs at: http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 8. Pre-Seeded Evaluation Credentials

| Role | Email | Password | Pre-loaded Name |
|---|---|---|---|
| **Student** | `student@vishnu.edu.in` | `Student@123` | Priya Sharma (22PA1A0542) |
| **Administrator** | `admin@vishnu.edu.in` | `Admin@123` | Dr. K. Srinivas Rao (Dean) |
| **Approver** | `approver@vishnu.edu.in` | `Approver@123` | Prof. P. V. Ramana (TrustDesk) |

*You can also click the instant role buttons on `/login` to log in with one click.*

---

## 9. API Documentation Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new campus account | No |
| `POST` | `/api/auth/login` | Sign in & receive JWT session | No |
| `GET` | `/api/auth/profile` | Retrieve active authenticated profile | Yes (JWT) |
| `POST` | `/api/notices/verify` | Smart notice verification (ID, QR, tamper) | No (Open access) |
| `GET` | `/api/notices` | Browse official notices | Yes (JWT) |
| `POST` | `/api/notices` | Draft new notice (queues for approval) | Yes (Admin) |
| `POST` | `/api/notices/:id/status` | Approve / Reject circular | Yes (Approver) |
| `POST` | `/api/notices/:id/revoke` | Formally revoke circular | Yes (Admin) |
| `POST` | `/api/payments/verify` | Payment Change Guard verification | Yes (JWT) |
| `GET` | `/api/payments/records` | Get approved campus payment accounts | Yes (JWT) |
| `POST` | `/api/ai/analyze` | Gemini AI threat intelligence (EN & TE) | Yes (JWT) |
| `GET` | `/api/ai/scenarios` | Pre-built test threat scenarios | Yes (JWT) |
| `POST` | `/api/incidents` | Submit cyber incident report | Yes (JWT) |
| `GET` | `/api/incidents` | List incident cases | Yes (JWT) |
| `GET` | `/api/learning/lessons` | 7 bilingual cyber lessons & quizzes | Yes (JWT) |
| `POST` | `/api/learning/quiz` | Record quiz scores & badges | Yes (JWT) |
| `GET` | `/api/demo/:scenarioId` | Execute Section 12 evaluation demo | No (Public) |

---

## 10. Community Impact & Ethical Commitment

CyberRakshak 3.0 was created with deep commitment to community welfare at Vishnu Institute of Technology. All payment records, spoofing simulations, and circular examples are demonstrative representations engineered to build practical student vigilance against cyber threats.

