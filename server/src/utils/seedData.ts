import bcrypt from 'bcryptjs';
import { generateNoticeIntegrityHash } from './hash.js';

export async function getInitialSeedData() {
  const studentPassword = await bcrypt.hash('Student@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const approverPassword = await bcrypt.hash('Approver@123', 10);

  const users = [
    {
      _id: 'usr_student_01',
      name: 'Priya Sharma',
      email: 'student@vishnu.edu.in',
      passwordHash: studentPassword,
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: '22PA1A0542',
      createdAt: new Date('2026-01-10')
    },
    {
      _id: 'usr_admin_01',
      name: 'Dr. K. Srinivas Rao',
      email: 'admin@vishnu.edu.in',
      passwordHash: adminPassword,
      role: 'administrator',
      department: 'Academic Affairs & Examinations',
      studentId: '',
      createdAt: new Date('2025-11-01')
    },
    {
      _id: 'usr_approver_01',
      name: 'Prof. P. V. Ramana',
      email: 'approver@vishnu.edu.in',
      passwordHash: approverPassword,
      role: 'approver',
      department: 'Independent Trust & Governance Desk',
      studentId: '',
      createdAt: new Date('2025-11-01')
    }
  ];

  const genuineIntegrityHash = generateNoticeIntegrityHash({
    title: 'Semester Examination Fee & Hall Ticket Release - March 2026',
    department: 'Examination Cell & Academic Affairs',
    issuer: 'Dr. K. Srinivas Rao, Controller of Examinations',
    description: 'All B.Tech CSE, IT, ECE, and AI students must clear their semester examination fees through official bank details only. Hall tickets will be issued starting March 25th.',
    expiryDate: '2027-04-30',
    category: 'Examination'
  });

  const pendingIntegrityHash = generateNoticeIntegrityHash({
    title: 'Hostel Maintenance & Mess Dues Clearance - Spring 2026',
    department: 'Hostel Administration',
    issuer: 'Chief Warden Office',
    description: 'Residents of VIT Hostels (Boys Block A/B/C and Girls Block 1/2) are requested to verify their mess accounts and clear remaining balances before the final semester break.',
    expiryDate: '2026-05-15',
    category: 'Hostel'
  });

  const expiredIntegrityHash = generateNoticeIntegrityHash({
    title: 'Supplementary Lab Evaluation Winter 2025',
    department: 'Department of CSE',
    issuer: 'HOD CSE',
    description: 'Special practical exam evaluation for eligible 3rd-year students enrolled in operating systems and compiler design laboratories.',
    expiryDate: '2025-12-15',
    category: 'Academic'
  });

  const revokedIntegrityHash = generateNoticeIntegrityHash({
    title: 'Outdated Annual Cultural Fest Vendor Registration',
    department: 'Student Affairs',
    issuer: 'Student Welfare Committee',
    description: 'Registration portal for external food and merchandise stalls during the annual college cultural festival.',
    expiryDate: '2026-03-01',
    category: 'Events'
  });

  const notices = [
    {
      _id: 'not_01',
      noticeId: 'VIT-NOT-2026-0891',
      title: 'Semester Examination Fee & Hall Ticket Release - March 2026',
      description: 'All B.Tech CSE, IT, ECE, and AI students must clear their semester examination fees through official bank details only. Hall tickets will be issued starting March 25th.',
      category: 'Examination',
      department: 'Examination Cell & Academic Affairs',
      issuer: 'Dr. K. Srinivas Rao, Controller of Examinations',
      issuerId: 'usr_admin_01',
      approver: 'Prof. P. V. Ramana, Verification Authority',
      approverId: 'usr_approver_01',
      version: 1,
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      contentHash: genuineIntegrityHash,
      priority: 'urgent',
      status: 'published',
      expiryDate: new Date('2027-04-30'),
      publishedAt: new Date('2026-02-15T10:00:00Z'),
      paymentDetailsReferenced: {
        beneficiary: 'Vishnu Institute of Technology Exam Fund',
        upiId: 'vishnu.exams@okaxis',
        accountMasked: 'XXXX-XXXX-4589',
        purpose: 'End-Semester Examination Fee',
        amount: 2500
      },
      createdAt: new Date('2026-02-14T09:00:00Z'),
      updatedAt: new Date('2026-02-15T10:00:00Z')
    },
    {
      _id: 'not_02',
      noticeId: 'VIT-NOT-2026-0902',
      title: 'Hostel Maintenance & Mess Dues Clearance - Spring 2026',
      description: 'Residents of VIT Hostels (Boys Block A/B/C and Girls Block 1/2) are requested to verify their mess accounts and clear remaining balances before the final semester break.',
      category: 'Hostel',
      department: 'Hostel Administration',
      issuer: 'Chief Warden Office',
      issuerId: 'usr_admin_01',
      version: 1,
      fileHash: 'a7c93e4810243b9e4a3b839c0019284719284719284719284719284719284719',
      contentHash: pendingIntegrityHash,
      priority: 'high',
      status: 'pending_review',
      expiryDate: new Date('2026-05-15'),
      paymentDetailsReferenced: {
        beneficiary: 'Vishnu Institute Hostel Welfare Society',
        upiId: 'vishnu.hostel@okaxis',
        accountMasked: 'XXXX-XXXX-1190',
        purpose: 'Hostel Accommodation and Mess Charges'
      },
      createdAt: new Date('2026-02-18T11:00:00Z'),
      updatedAt: new Date('2026-02-18T11:00:00Z')
    },
    {
      _id: 'not_03',
      noticeId: 'VIT-NOT-2025-0312',
      title: 'Supplementary Lab Evaluation Winter 2025',
      description: 'Special practical exam evaluation for eligible 3rd-year students enrolled in operating systems and compiler design laboratories.',
      category: 'Academic',
      department: 'Department of CSE',
      issuer: 'HOD CSE',
      issuerId: 'usr_admin_01',
      approver: 'Prof. P. V. Ramana, Verification Authority',
      approverId: 'usr_approver_01',
      version: 1,
      fileHash: 'f49b109283740192847192837401928374019283740192837401928374019283',
      contentHash: expiredIntegrityHash,
      priority: 'medium',
      status: 'published',
      expiryDate: new Date('2025-12-15'), // Expired
      publishedAt: new Date('2025-11-20T10:00:00Z'),
      createdAt: new Date('2025-11-19T08:00:00Z'),
      updatedAt: new Date('2025-11-20T10:00:00Z')
    },
    {
      _id: 'not_04',
      noticeId: 'VIT-NOT-2026-0744',
      title: 'Outdated Annual Cultural Fest Vendor Registration',
      description: 'Registration portal for external food and merchandise stalls during the annual college cultural festival.',
      category: 'Events',
      department: 'Student Affairs',
      issuer: 'Student Welfare Committee',
      issuerId: 'usr_admin_01',
      version: 1,
      fileHash: 'b581029384710293847102938471029384710293847102938471029384710293',
      contentHash: revokedIntegrityHash,
      priority: 'low',
      status: 'revoked',
      expiryDate: new Date('2026-03-01'),
      revokedAt: new Date('2026-02-01T14:30:00Z'),
      revocationReason: 'Superseded by circular VIT-NOT-2026-0810 due to revised calendar.',
      createdAt: new Date('2026-01-20T09:00:00Z'),
      updatedAt: new Date('2026-02-01T14:30:00Z')
    }
  ];

  const noticeHistories = [
    {
      noticeId: 'VIT-NOT-2026-0891',
      action: 'created',
      performedBy: 'Dr. K. Srinivas Rao',
      performedByRole: 'administrator',
      version: 1,
      remarks: 'Drafted examination fee schedule notice with bank metadata',
      timestamp: new Date('2026-02-14T09:00:00Z')
    },
    {
      noticeId: 'VIT-NOT-2026-0891',
      action: 'submitted_for_review',
      performedBy: 'Dr. K. Srinivas Rao',
      performedByRole: 'administrator',
      version: 1,
      remarks: 'Submitted for independent dual-authorization review',
      timestamp: new Date('2026-02-14T09:30:00Z')
    },
    {
      noticeId: 'VIT-NOT-2026-0891',
      action: 'approved',
      performedBy: 'Prof. P. V. Ramana',
      performedByRole: 'approver',
      version: 1,
      remarks: 'Verified fee breakdown against registrar circular. Approved for release.',
      timestamp: new Date('2026-02-15T09:45:00Z')
    },
    {
      noticeId: 'VIT-NOT-2026-0891',
      action: 'published',
      performedBy: 'Campus TrustDesk System',
      performedByRole: 'system',
      version: 1,
      remarks: 'Notice cryptographically sealed with QR and SHA-256 integrity stamp.',
      timestamp: new Date('2026-02-15T10:00:00Z')
    },
    {
      noticeId: 'VIT-NOT-2026-0902',
      action: 'created',
      performedBy: 'Chief Warden Office',
      performedByRole: 'administrator',
      version: 1,
      remarks: 'Created notice for hostel mess clearance',
      timestamp: new Date('2026-02-18T11:00:00Z')
    },
    {
      noticeId: 'VIT-NOT-2026-0902',
      action: 'submitted_for_review',
      performedBy: 'Dr. K. Srinivas Rao',
      performedByRole: 'administrator',
      version: 1,
      remarks: 'Pending independent trustdesk validation',
      timestamp: new Date('2026-02-18T11:05:00Z')
    }
  ];

  const paymentRecords = [
    {
      _id: 'pay_01',
      recordId: 'REC-VIT-TUT-01',
      institution: 'Vishnu Institute of Technology',
      beneficiary: 'Vishnu Institute of Technology General Fund',
      bankName: 'State Bank of India, Bhimavaram Branch',
      accountNumber: '30982348921',
      maskedAccount: 'XXXX-XXXX-8921',
      ifsc: 'SBIN0001234',
      upiId: 'vishnu.fees@okaxis',
      purpose: 'Tuition and College Development Fee',
      validFrom: new Date('2025-06-01'),
      validTill: new Date('2027-06-01'),
      status: 'active',
      notes: 'Official designated account for academic tuition fees only.'
    },
    {
      _id: 'pay_02',
      recordId: 'REC-VIT-EXM-02',
      institution: 'Vishnu Institute of Technology',
      beneficiary: 'Vishnu Institute of Technology Exam Fund',
      bankName: 'HDFC Bank, Bhimavaram',
      accountNumber: '50200084724589',
      maskedAccount: 'XXXX-XXXX-4589',
      ifsc: 'HDFC0002145',
      upiId: 'vishnu.exams@okaxis',
      purpose: 'End-Semester Examination Fee',
      validFrom: new Date('2025-06-01'),
      validTill: new Date('2027-06-01'),
      status: 'active',
      notes: 'Dedicated sub-account for semester evaluation and certificate processing.'
    },
    {
      _id: 'pay_03',
      recordId: 'REC-VIT-HST-03',
      institution: 'Vishnu Institute of Technology',
      beneficiary: 'Vishnu Institute Hostel Welfare Society',
      bankName: 'Union Bank of India, Bhimavaram',
      accountNumber: '10920045671190',
      maskedAccount: 'XXXX-XXXX-1190',
      ifsc: 'UBIN0531092',
      upiId: 'vishnu.hostel@okaxis',
      purpose: 'Hostel Accommodation and Mess Charges',
      validFrom: new Date('2025-06-01'),
      validTill: new Date('2027-06-01'),
      status: 'active',
      notes: 'Hostel welfare society account managed by Chief Warden.'
    }
  ];

  const incidents = [
    {
      _id: 'inc_01',
      caseId: 'CR-INC-2026-0041',
      userId: 'usr_student_01',
      reporterName: 'Priya Sharma',
      reporterEmail: 'priya.22pa1a0542@vishnu.edu.in',
      reporterPhone: '+91 98480 22334',
      category: 'Phishing',
      description: 'Received SMS stating: "Dear VITian, your Semester 5 grades have been paused due to KYC deficit. Click https://vit-portal-login.xyz/verify to update." Identified as fake portal requesting Aadhaar and OTP.',
      incidentDate: new Date('2026-02-12'),
      financialLoss: 0,
      evidenceFiles: ['screenshot_phishing_sms.png'],
      status: 'resolved',
      adminRemarks: 'Domain reported to AP Cyber Crime cell & blocked on campus firewall.',
      isDemoSimulation: false,
      createdAt: new Date('2026-02-12T14:20:00Z')
    },
    {
      _id: 'inc_02',
      caseId: 'CR-INC-2026-0042',
      userId: 'usr_student_01',
      reporterName: 'Anonymous Student',
      category: 'UPI Fraud',
      description: 'A WhatsApp message impersonating the hostel canteen manager requested Rs. 1,500 advance for food token card renewal using a personal PhonePe QR code.',
      incidentDate: new Date('2026-02-16'),
      financialLoss: 1500,
      status: 'under_investigation',
      adminRemarks: 'Forwarded to campus security for vendor QR verification.',
      isDemoSimulation: false,
      createdAt: new Date('2026-02-16T09:15:00Z')
    },
    {
      _id: 'inc_03',
      caseId: 'CR-INC-2026-0043',
      userId: 'usr_student_01',
      reporterName: 'Rahul V.',
      category: 'Fake College Notices',
      description: 'Circulated WhatsApp PDF stating that classes were suspended on Monday with a forged digital signature of Principal Dr. D. Suryanarayana.',
      incidentDate: new Date('2026-02-19'),
      financialLoss: 0,
      status: 'resolved',
      adminRemarks: 'TrustDesk broadcasted official genuine notice bulletin clarifying falsity.',
      isDemoSimulation: false,
      createdAt: new Date('2026-02-19T11:40:00Z')
    }
  ];

  return { users, notices, noticeHistories, paymentRecords, incidents };
}
