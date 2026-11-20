import { Response } from 'express';
import { isUsingFallbackDB } from '../config/db.js';
import { IncidentModel, IIncident } from '../models/Incident.js';
import { memoryDb } from '../services/memoryDbFallback.js';
import { AuthRequest } from '../middleware/auth.js';

export async function submitIncident(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { 
      category, 
      description, 
      incidentDate, 
      financialLoss, 
      reporterName, 
      reporterEmail, 
      reporterPhone, 
      evidenceFiles,
      isDemoSimulation = false
    } = req.body;

    if (!category || !description) {
      res.status(400).json({ success: false, message: 'Category and description are required.' });
      return;
    }

    const year = new Date().getFullYear();
    const serial = Math.floor(1000 + Math.random() * 9000);
    const caseId = `CR-INC-${year}-${serial}`;

    const newIncident: any = {
      _id: `inc_${Date.now()}`,
      caseId,
      userId: req.user?.userId,
      reporterName: reporterName || req.user?.name || 'Anonymous Student',
      reporterEmail: reporterEmail || req.user?.email,
      reporterPhone: reporterPhone || '',
      category,
      description,
      incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
      financialLoss: Number(financialLoss) || 0,
      evidenceFiles: evidenceFiles || [],
      status: 'submitted',
      isDemoSimulation: Boolean(isDemoSimulation),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isUsingFallbackDB()) {
      memoryDb.incidents.unshift(newIncident);
    } else {
      try {
        await IncidentModel.create(newIncident);
      } catch {
        memoryDb.incidents.unshift(newIncident);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Cyber incident report submitted successfully.',
      incident: newIncident,
      advisory: {
        helpline: '1930',
        portal: 'https://cybercrime.gov.in',
        disclaimer: 'Notice: This creates an internal institutional case record on CyberRakshak Campus TrustDesk. If financial loss occurred within the last 2 hours, immediately dial 1930 to freeze fraudulent beneficiary accounts.'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getIncidents(req: AuthRequest, res: Response): Promise<void> {
  try {
    let incidents: any[] = [];
    if (isUsingFallbackDB()) {
      incidents = [...memoryDb.incidents];
    } else {
      try {
        incidents = await IncidentModel.find().sort({ createdAt: -1 }).lean();
      } catch {
        incidents = [...memoryDb.incidents];
      }
    }

    // Role-based visibility: Students only view their own reports unless it's demo simulations
    if (req.user?.role === 'student') {
      incidents = incidents.filter(i => i.userId === req.user?.userId || i.reporterEmail === req.user?.email);
    }

    // Filters
    const { category, status } = req.query;
    if (category && category !== 'all') {
      incidents = incidents.filter(i => i.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (status && status !== 'all') {
      incidents = incidents.filter(i => i.status === status);
    }

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateIncidentStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!['submitted', 'under_investigation', 'resolved', 'dismissed'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid incident status value.' });
      return;
    }

    let incident: any = null;
    if (isUsingFallbackDB()) {
      incident = memoryDb.incidents.find(i => i.caseId === id || i._id.toString() === id);
      if (incident) {
        incident.status = status;
        if (adminRemarks) incident.adminRemarks = adminRemarks;
        incident.updatedAt = new Date();
      }
    } else {
      try {
        incident = await IncidentModel.findOne({
          $or: [
            { caseId: id },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
          ]
        });
        if (incident) {
          incident.status = status;
          if (adminRemarks) incident.adminRemarks = adminRemarks;
          await incident.save();
        }
      } catch {
        // Fallback
      }
    }

    if (!incident) {
      res.status(404).json({ success: false, message: 'Incident record not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Incident case ${incident.caseId} updated to ${status}.`,
      incident
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

