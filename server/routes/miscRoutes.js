const express = require('express');
const router = express.Router();
const { getAllTestimonials, createEnquiry, submitContact } = require('../controllers/testimonialController');

router.get('/testimonials', getAllTestimonials);
router.post('/enquiries', createEnquiry);
router.post('/contact', submitContact);

module.exports = router;
