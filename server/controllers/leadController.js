const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');
const { sendWhatsAppLeadNotification } = require('../services/whatsappService');

const ADMIN_KEY = process.env.ADMIN_KEY || 'virajadmin2025';

// Helper: verify admin passkey
const verifyAdmin = (req) => {
  const providedKey = req.headers['x-admin-key'] || req.query.adminKey;
  return providedKey && providedKey === ADMIN_KEY;
};

// POST /api/leads - Public Lead Capture
const createLead = async (req, res) => {
  try {
    const { name, phone, email, requirement, destination, website } = req.body;

    // 1. Anti-spam honeypot check: If the hidden honeypot field is filled, silently ignore
    if (website && website.trim() !== '') {
      console.warn('[Spam Detected] Honeypot field was populated. Suppressing lead.');
      // Return success to confuse the spam bot without saving
      return res.status(200).json({
        success: true,
        message: "Thank you! We've received your enquiry. Our team will contact you soon."
      });
    }

    // 2. Validate Full Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required and must be at least 2 characters.'
      });
    }

    // 3. Validate Phone Number
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Phone Number is required.'
      });
    }

    const cleanPhone = phone.trim();
    // Allow standard phone numbers (+country code, digits, spaces, hyphens, parentheses), at least 7 digits
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 16) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number (minimum 7 digits).'
      });
    }

    // 4. Validate Email (Optional)
    let cleanEmail = null;
    if (email && typeof email === 'string' && email.trim().length > 0) {
      cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail) || cleanEmail.length > 120) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address.'
        });
      }
    }

    // 5. Clean Requirement / Destination (Optional)
    const rawReq = requirement || destination || '';
    const cleanRequirement = typeof rawReq === 'string' ? rawReq.trim().slice(0, 1000) : null;
    const cleanName = name.trim().slice(0, 100);

    const id = uuidv4();
    const source = req.body.source || 'popup';
    const status = 'NEW';
    const createdAt = new Date().toISOString();

    // 6. Secure Database Insertion (parameterized SQL to prevent injection)
    const stmt = db.prepare(`
      INSERT INTO Lead (id, name, phone, email, requirement, source, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, cleanName, cleanPhone, cleanEmail, cleanRequirement || null, source, status, createdAt);

    const savedLead = {
      id,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      requirement: cleanRequirement,
      source,
      status,
      createdAt
    };

    // 7. Trigger WhatsApp notification service (async, non-blocking)
    sendWhatsAppLeadNotification(savedLead).catch(err => {
      console.error('[WhatsApp Notification Failure]:', err);
    });

    // 8. Return response as requested
    return res.status(201).json({
      success: true,
      message: "Thank you! We've received your enquiry. Our team will contact you soon.",
      leadId: id
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit enquiry at this time. Please try again later.'
    });
  }
};

// GET /api/leads - Owner / Admin View
const getAllLeads = (req, res) => {
  try {
    if (!verifyAdmin(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin key required.'
      });
    }

    const leads = db.prepare(`
      SELECT id, name, phone, email, requirement, source, status, createdAt
      FROM Lead
      ORDER BY datetime(createdAt) DESC
    `).all();

    return res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    console.error('Error fetching leads:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leads.'
    });
  }
};

// PATCH /api/leads/:id/status - Update Lead Status
const updateLeadStatus = (req, res) => {
  try {
    if (!verifyAdmin(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin key required.'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`
      });
    }

    const result = db.prepare(`
      UPDATE Lead
      SET status = ?
      WHERE id = ?
    `).run(status.toUpperCase(), id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Lead status updated successfully.'
    });
  } catch (err) {
    console.error('Error updating lead status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead status.'
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  updateLeadStatus
};
