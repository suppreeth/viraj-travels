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
    
    // Validation - Name and Phone required; email and message optional
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }
    const cleanEmail = email && email.trim() ? email.trim() : `${phone.replace(/\D/g, '') || 'traveller'}@vrajholidays.com`;
    const cleanMessage = message && message.trim() ? message.trim() : 'Booking enquiry submitted via website.';

    const id = uuidv4();
    db.prepare(`INSERT INTO Enquiry (id, name, email, phone, destination, travelDate, travellers, message, packageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, name, cleanEmail, phone, destination || null, travelDate || null, travellers || 1, cleanMessage, packageId || null);

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

// POST /api/testimonials (Submit review)
const createTestimonial = (req, res) => {
  try {
    const { name, destination, rating, review } = req.body;
    
    if (!name || !review) {
      return res.status(400).json({ success: false, message: 'Name and review are required.' });
    }

    const numRating = parseFloat(rating) || 5.0;
    const clampedRating = Math.max(1, Math.min(5, numRating));
    const id = uuidv4();

    db.prepare(`INSERT INTO Testimonial (id, name, destination, rating, review, image) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(
        id,
        name.trim(),
        destination ? destination.trim() : 'Traveller',
        clampedRating,
        review.trim(),
        null
      );

    const newTestimonial = {
      id,
      name: name.trim(),
      destination: destination ? destination.trim() : 'Traveller',
      rating: clampedRating,
      review: review.trim(),
      image: null
    };

    res.status(201).json({ success: true, message: 'Thank you for your review!', data: newTestimonial });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ success: false, message: 'Failed to submit review. Please try again.' });
  }
};

module.exports = { getAllTestimonials, createTestimonial, createEnquiry, submitContact };
