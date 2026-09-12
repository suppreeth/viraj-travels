const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/testimonials
const getAllTestimonials = (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM Testimonial ORDER BY rating DESC').all();
    res.json({ success: true, data: testimonials });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

// POST /api/enquiries
const createEnquiry = (req, res) => {
  try {
    const { name, email, phone, destination, travelDate, travellers, message, packageId } = req.body;
    
    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and message are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const id = uuidv4();
    db.prepare(`INSERT INTO Enquiry (id, name, email, phone, destination, travelDate, travellers, message, packageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, name, email, phone, destination || null, travelDate || null, travellers || 1, message, packageId || null);

    res.status(201).json({ success: true, message: 'Your travel enquiry has been received! Our expert will contact you shortly.', id });
  } catch (err) {
    console.error('Error creating enquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry. Please try again.' });
  }
};

// POST /api/contact
const submitContact = (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const id = uuidv4();
    db.prepare(`INSERT INTO Enquiry (id, name, email, phone, travellers, message) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(id, name, email, phone || '', 1, message);

    res.status(201).json({ success: true, message: 'Your message has been received! We will get back to you within 24 hours.' });
  } catch (err) {
    console.error('Error submitting contact:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

module.exports = { getAllTestimonials, createEnquiry, submitContact };
