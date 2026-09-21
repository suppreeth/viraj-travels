const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, updateLeadStatus } = require('../controllers/leadController');

// POST /api/leads - Visitor lead capture submission
router.post('/', createLead);

// GET /api/leads - Private admin retrieval
router.get('/', getAllLeads);

// PATCH /api/leads/:id/status - Update lead status
router.patch('/:id/status', updateLeadStatus);

module.exports = router;
