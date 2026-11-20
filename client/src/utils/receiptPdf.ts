import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VerificationResult, PaymentVerificationResult } from '../types';

/**
 * Downloads a structured Trust Decision Receipt for a verified Notice
 */
export function downloadNoticeReceipt(data: VerificationResult) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(7, 17, 31); // Dark Navy #07111F
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(0, 217, 255); // Cyan #00D9FF
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CYBERRAKSHAK 3.0 – TRUST DECISION RECEIPT', 14, 18);

  doc.setTextColor(200, 220, 240);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Vishnu Institute of Technology, Bhimavaram | Campus TrustDesk Cryptographic Ledger', 14, 26);

  // Meta Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt Reference: ${data.referenceId}`, 14, 46);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date(data.verificationTimestamp).toLocaleString()}`, 14, 52);
  doc.text(`Verification Type: Smart Notice Cryptographic Integrity Check`, 14, 57);

  // Status Box
  const statusColors: Record<string, [number, number, number]> = {
    VERIFIED: [16, 185, 129], // Green
    WARNING: [245, 158, 11],  // Amber
    REJECTED: [239, 68, 68],  // Red
    EXPIRED: [100, 116, 139], // Slate
    REVOKED: [225, 29, 72],   // Rose
    NOT_FOUND: [159, 18, 57]
  };

  const badgeRgb = statusColors[data.result] || [30, 41, 59];
  doc.setFillColor(badgeRgb[0], badgeRgb[1], badgeRgb[2]);
  doc.roundedRect(135, 42, 60, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(data.result, 165, 52, { align: 'center' });

  // Verification Details Table
  const tableRows = [
    ['Notice Circular ID', data.noticeId || 'N/A'],
    ['Original Document Title', data.originalNotice?.title || 'Unknown / Not Registered'],
    ['Issuing Department', data.originalNotice?.department || 'N/A'],
    ['Authorizing Authority', data.originalNotice?.issuer || 'N/A'],
    ['Dual Approver', data.originalNotice?.approver || 'Pending / Unassigned'],
    ['Cryptographic Hash (SHA-256)', (data.originalNotice?.contentHash || 'N/A').substring(0, 36) + '...'],
    ['Approval Status', data.originalNotice?.status || 'N/A'],
    ['Validity Period', data.originalNotice ? `${new Date(data.originalNotice.issueDate).toLocaleDateString()} to ${new Date(data.originalNotice.expiryDate).toLocaleDateString()}` : 'N/A']
  ];

  autoTable(doc, {
    startY: 65,
    head: [['Attribute', 'Registered Institutional Record']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [18, 38, 58], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3.5 }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Tamper / Discrepancy details if present
  if (data.mismatches && data.mismatches.length > 0) {
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CRITICAL INTEGRITY DISCREPANCIES DETECTED:', 14, currentY);
    currentY += 6;

    const mismatchRows = data.mismatches.map(m => [
      m.label,
      String(m.originalValue || 'N/A'),
      String(m.submittedValue || 'N/A')
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Field', 'Original Registered Record', 'Submitted / Circulated Value']],
      body: mismatchRows,
      theme: 'grid',
      headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Verdict Reason & Advisory
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TrustDesk Analysis Verdict:', 14, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const splitReason = doc.splitTextToSize(data.reason, 180);
  doc.text(splitReason, 14, currentY);
  currentY += splitReason.length * 5 + 8;

  // Recommended Action
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Next Action:', 14, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  const actionText = data.isAuthentic
    ? 'This notice is authenticated. Students may proceed based on the published circular details.'
    : 'DO NOT ACT on this notice. Forward this suspicious circular to the campus cyber desk or dial 1930 if fraud is suspected.';
  doc.text(doc.splitTextToSize(actionText, 180), 14, currentY);

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This verification receipt is generated cryptographically by CyberRakshak 3.0 (Campus TrustDesk) for Vishnu Institute of Technology.',
    14,
    285
  );

  doc.save(`CyberRakshak-Trust-Receipt-${data.referenceId}.pdf`);
}

/**
 * Downloads a structured Trust Decision Receipt for Payment verification
 */
export function downloadPaymentReceipt(data: PaymentVerificationResult, enteredDetails: any) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(7, 17, 31);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(0, 217, 255);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('CYBERRAKSHAK – PAYMENT VERIFICATION RECEIPT', 14, 18);

  doc.setTextColor(200, 220, 240);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Vishnu Institute of Technology | Payment Change Guard Verification Snapshot', 14, 26);

  // Meta Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference ID: ${data.referenceId}`, 14, 46);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Verification Timestamp: ${new Date().toLocaleString()}`, 14, 52);

  // Result Badge
  const resultColors: Record<string, [number, number, number]> = {
    MATCH: [16, 185, 129],
    MISMATCH: [239, 68, 68],
    REVIEW_REQUIRED: [245, 158, 11]
  };
  const color = resultColors[data.result] || [100, 116, 139];
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(140, 42, 55, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(data.result, 167, 52, { align: 'center' });

  // Comparison Table
  const rows = [
    ['Institution Name', 'Vishnu Institute of Technology', enteredDetails.institution || 'N/A'],
    ['Beneficiary Name', data.matchedRecord?.beneficiary || 'Official General Fund', enteredDetails.beneficiary || 'N/A'],
    ['Bank Name & Branch', data.matchedRecord?.bankName || 'State Bank of India', 'N/A'],
    ['Masked Account', data.matchedRecord?.maskedAccount || 'XXXX-XXXX-8921', enteredDetails.accountNumber || 'N/A'],
    ['UPI ID / VPA Handle', data.matchedRecord?.upiId || 'vishnu.fees@okaxis', enteredDetails.upiId || 'N/A'],
    ['Designated Purpose', data.matchedRecord?.purpose || 'College Fee', enteredDetails.purpose || 'N/A']
  ];

  autoTable(doc, {
    startY: 65,
    head: [['Payment Field', 'Official Registered Target', 'Entered Payment Target']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [18, 38, 58], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3.5 }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 12;

  // Analysis Summary
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Verification Summary:', 14, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(doc.splitTextToSize(data.summary, 180), 14, currentY);

  currentY += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Action Advisory:', 14, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(data.recommendation, 180), 14, currentY);

  // Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(120, 130, 140);
  doc.text(
    'Educational prototype guard. CyberRakshak does not store payment passwords or initiate fund transfers.',
    14,
    285
  );

  doc.save(`CyberRakshak-Payment-Receipt-${data.referenceId}.pdf`);
}

