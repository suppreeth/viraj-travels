import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Star, Check, X, ArrowLeft, Phone, ChevronDown, ChevronUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { getPackageById, submitEnquiry } from '../services/api';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', travelDate: '', travellers: 2 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setLoading(true);
    getPackageById(id)
      .then(res => setPkg(res.data.data))
      .catch(() => setError('Package not found or unavailable.'))
      .finally(() => {
        setLoading(false);
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        });
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 30);
      });
  }, [id]);

  const [touched, setTouched] = useState({});

  const validateField = (name, value, currentForm = form) => {
    switch (name) {
      case 'name': {
        const val = (value !== undefined ? value : currentForm.name).trim();
        if (!val) return 'Full name is required';
        if (val.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid name (letters only)';
        return '';
      }
      case 'phone': {
        const raw = (value !== undefined ? value : currentForm.phone).toString();
        const digits = raw.replace(/\D/g, '');
        if (!digits) return 'Phone number is required';
        if (digits.length < 10) return `Enter complete 10-digit number (${digits.length}/10 digits)`;
        if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a valid Indian mobile number starting with 6, 7, 8, or 9';
        return '';
      }
      case 'travellers': {
        const val = value !== undefined ? value : currentForm.travellers;
        const num = parseInt(val, 10);
        if (!val || isNaN(num) || num < 1) return 'Please specify at least 1 traveller';
        if (num > 100) return 'Number of travellers cannot exceed 100';
        return '';
      }
      case 'travelDate': {
        const val = value !== undefined ? value : currentForm.travelDate;
        if (!val) return 'Please select your date of travel';
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return 'Travel date cannot be in the past';
        return '';
      }
      default:
        return '';
    }
  };

  const validateAll = (currentForm = form) => {
    const errors = {};
    ['name', 'phone', 'travellers', 'travelDate'].forEach((field) => {
      const err = validateField(field, currentForm[field], currentForm);
      if (err) errors[field] = err;
    });
    return errors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setFormErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const handleInputChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (touched[field] || formErrors[field]) {
      const err = validateField(field, value);
      setFormErrors((p) => ({ ...p, [field]: err || undefined }));
    }
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length > 10) {
      digits = digits.slice(1);
    }
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }

    setForm((p) => ({ ...p, phone: digits }));
    if (touched.phone || formErrors.phone) {
      const err = validateField('phone', digits);
      setFormErrors((p) => ({ ...p, phone: err || undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, travellers: true, travelDate: true });
    const errors = validateAll();
    if (Object.keys(errors).length > 0) { 
      setFormErrors(errors); 
      return; 
    }
    setFormErrors({});
    setSubmitting(true);

    const packageName = pkg?.title || 'Tour Package';
    const destination = pkg?.destinationName || pkg?.destination || 'N/A';
    const duration = pkg?.duration || 'N/A';
    const customerName = form.name.trim();
    const customerPhone = form.phone.trim();
    const travellers = form.travellers || 1;
    const travelDate = form.travelDate || 'Flexible';

    // Construct WhatsApp message adhering to required format with +91
    const waText = 
      `*New Tour Package Booking Enquiry*\n\n` +
      `*Package:* ${packageName}\n` +
      `*Destination:* ${destination}\n` +
      `*Duration:* ${duration}\n\n` +
      `*Customer Details*\n` +
      `Name: ${customerName}\n` +
      `Phone: +91 ${customerPhone}\n` +
      `Travellers: ${travellers}\n` +
      `Date of Travel: ${travelDate}\n\n` +
      `I would like to enquire about this tour package.`;

    const encodedText = encodeURIComponent(waText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=918792373736&text=${encodedText}`;

    // Asynchronously record enquiry in backend without blocking WhatsApp launch
    submitEnquiry({ 
      name: customerName,
      phone: `+91${customerPhone}`,
      travellers: Number(travellers) || 1,
      travelDate: form.travelDate,
      packageId: id, 
      destination: pkg?.destinationName 
    }).catch(err => {
      console.warn('Enquiry background save error:', err);
    });

    setSubmitting(false);
    setSubmitted(true);
    setEnquiryOpen(false);

    // Open WhatsApp Click-to-Chat directly
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ height: 500, background: 'var(--gray-100)' }} className="skeleton" />
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 24, marginBottom: 16, borderRadius: 6, width: i % 2 === 0 ? '60%' : '40%' }} />
        ))}
      </div>
    </div>
  );

  if (error || !pkg) return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }} className="container">
      <h2 style={{ color: 'var(--navy)', marginBottom: 16 }}>Package Not Found</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: 32 }}>{error || 'This package may no longer be available.'}</p>
      <Link to="/packages" className="btn btn-primary">Browse All Packages</Link>
    </div>
  );

  return (
    <div className="pkg-detail">
      <style>{`
        .pkg-detail { padding-bottom: var(--sp-20); }
        .pkg-hero {
          position: relative;
          height: 60vh;
          min-height: 440px;
          overflow: hidden;
        }
        .pkg-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .pkg-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12,26,46,0.92) 0%, rgba(12,26,46,0.4) 55%, rgba(12,26,46,0.6) 100%);
        }
        .pkg-hero-top {
          position: absolute;
          top: 96px;
          left: 0;
          right: 0;
          z-index: 10;
        }
        .pkg-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          background: rgba(12, 26, 46, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .pkg-back-btn:hover {
          background: rgba(12, 26, 46, 0.9);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateX(-4px);
          color: #5eead4;
        }
        .pkg-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 2;
          padding: var(--sp-8) 0;
        }
        .pkg-detail-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: var(--sp-10);
          margin-top: var(--sp-8);
          align-items: start;
        }
        .pkg-section { margin-bottom: var(--sp-8); }
        .pkg-section h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: var(--sp-5);
          padding-bottom: var(--sp-3);
          border-bottom: 2px solid var(--gray-100);
        }
        .pkg-description { color: var(--gray-600); line-height: 1.8; font-size: 1rem; }
        .highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
        }
        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-2);
          font-size: 0.9rem;
          color: var(--gray-700);
        }
        .highlight-item svg { flex-shrink: 0; color: var(--teal); margin-top: 2px; }
        
        /* Itinerary */
        .itin-item { margin-bottom: var(--sp-3); }
        .itin-header {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-4) var(--sp-5);
          background: var(--gray-50);
          border-radius: var(--r-md);
          cursor: pointer;
          transition: background 0.2s;
        }
        .itin-header:hover, .itin-header.open { background: rgba(13,148,136,0.08); }
        .itin-day {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          border-radius: var(--r-sm);
          display: flex; align-items: center; justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .itin-title { flex: 1; font-weight: 600; color: var(--navy); }
        .itin-body {
          padding: var(--sp-4) var(--sp-5) var(--sp-4) calc(38px + var(--sp-4) + var(--sp-5));
          background: var(--gray-50);
          border-radius: 0 0 var(--r-md) var(--r-md);
          margin-top: -4px;
          color: var(--gray-600);
          line-height: 1.7;
          font-size: 0.92rem;
        }

        /* Inclusions/Exclusions */
        .ie-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-6); }
        .ie-list { display: flex; flex-direction: column; gap: var(--sp-2); }
        .ie-item {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-2);
          font-size: 0.9rem;
          padding: var(--sp-2) 0;
        }
        .ie-item.inc { color: var(--gray-700); }
        .ie-item.exc { color: var(--gray-500); }

        /* Booking Sidebar */
        .booking-card {
          background: white;
          border-radius: var(--r-xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--gray-100);
          position: sticky;
          top: 90px;
          overflow: hidden;
        }
        .booking-header {
          background: linear-gradient(135deg, var(--navy), #1a3a6c);
          padding: var(--sp-6);
          color: white;
        }
        .booking-body { padding: var(--sp-6); }
        .booking-price { font-size: 2rem; font-weight: 800; color: white; }
        .booking-price-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .booking-meta { display: flex; flex-direction: column; gap: var(--sp-3); margin-bottom: var(--sp-6); }
        .bm-row { display: flex; align-items: center; gap: var(--sp-3); font-size: 0.9rem; color: var(--gray-600); }
        .bm-icon { color: var(--teal); flex-shrink: 0; }

        /* Enquiry Modal */
        .enquiry-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(12,26,46,0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
        }
        .enquiry-modal {
          background: white;
          border-radius: var(--r-xl);
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .enquiry-header {
          background: linear-gradient(135deg, var(--navy), #1a3a6c);
          padding: var(--sp-6);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .enquiry-form { padding: var(--sp-6); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
        .form-error {
          color: #ef4444;
          font-size: 0.78rem;
          font-weight: 500;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .form-input.error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        .phone-input-group {
          display: flex;
          align-items: stretch;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-md);
          background: var(--white);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .phone-input-group:focus-within {
          border-color: var(--blue, #0e6eb8);
          box-shadow: 0 0 0 3px rgba(14,110,184,0.12);
        }
        .phone-input-group.error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        .phone-prefix {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 12px;
          background: #f1f5f9;
          border-right: 1.5px solid var(--gray-200);
          font-size: 0.92rem;
          font-weight: 600;
          color: #334155;
          user-select: none;
          flex-shrink: 0;
        }
        .phone-input-group.error .phone-prefix {
          border-right-color: #ef4444;
          background: #fee2e2;
          color: #991b1b;
        }
        .flag-icon {
          font-size: 1.05rem;
          line-height: 1;
        }
        .phone-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: var(--gray-800);
          background: transparent;
          width: 100%;
        }
        .success-banner {
          background: rgba(13,148,136,0.08);
          border: 1px solid var(--teal-light);
          border-radius: var(--r-lg);
          padding: var(--sp-5);
          text-align: center;
          margin-bottom: var(--sp-6);
        }
        @media (max-width: 900px) {
          .pkg-detail-grid { grid-template-columns: 1fr; }
          .booking-card { position: static; }
          .ie-grid { grid-template-columns: 1fr; }
          .highlights-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="pkg-hero" style={{ paddingTop: 0 }}>
        <img src={pkg.mainImage} alt={pkg.title} className="pkg-hero-img" />
        <div className="pkg-hero-overlay" />
        
        {/* Back to Packages at Left Hand Top */}
        <div className="pkg-hero-top">
          <div className="container">
            <Link to="/packages" className="pkg-back-btn">
              <ArrowLeft size={16} /> Back to Packages
            </Link>
          </div>
        </div>

        <div className="pkg-hero-content">
          <div className="container">
            <div style={{ marginBottom: 12 }}>
              <span className="badge badge-teal" style={{ background: 'rgba(13,148,136,0.85)', color: 'white' }}>{pkg.category}</span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, marginBottom: 12 }}>{pkg.title}</h1>
            <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} /> {pkg.destinationName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={14} /> {pkg.duration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--gold-light)' }}><Star size={14} fill="currentColor" /> {pkg.rating} (86 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {submitted && (
          <div className="success-banner" style={{ marginTop: 32 }}>
            <Check size={24} color="var(--teal)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ color: 'var(--teal)', marginBottom: 4 }}>Enquiry Received!</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Our travel expert will contact you within 24 hours.</p>
          </div>
        )}

        <div className="pkg-detail-grid">
          {/* Left Content */}
          <div>
            {/* Overview */}
            <div className="pkg-section">
              <h3>Overview</h3>
              <p className="pkg-description">{pkg.description}</p>
            </div>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div className="pkg-section">
                <h3>Tour Highlights</h3>
                <div className="highlights-grid">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="highlight-item">
                      <Check size={16} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itineraries?.length > 0 && (
              <div className="pkg-section">
                <h3>Day-by-Day Itinerary</h3>
                {pkg.itineraries.map((itin, i) => (
                  <div key={itin.id} className="itin-item">
                    <div
                      className={`itin-header ${expandedDay === i ? 'open' : ''}`}
                      onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                    >
                      <div className="itin-day">D{itin.day}</div>
                      <div className="itin-title">{itin.title}</div>
                      {expandedDay === i ? <ChevronUp size={18} color="var(--gray-400)" /> : <ChevronDown size={18} color="var(--gray-400)" />}
                    </div>
                    <AnimatePresence>
                      {expandedDay === i && (
                        <motion.div
                          className="itin-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          {itin.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Inclusions / Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="pkg-section">
                <h3>Inclusions & Exclusions</h3>
                <div className="ie-grid">
                  <div>
                    <h4 style={{ color: 'var(--teal)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Included</h4>
                    <div className="ie-list">
                      {pkg.inclusions?.map((item, i) => (
                        <div key={i} className="ie-item inc">
                          <Check size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✕ Not Included</h4>
                    <div className="ie-list">
                      {pkg.exclusions?.map((item, i) => (
                        <div key={i} className="ie-item exc">
                          <X size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="booking-card">
              <div className="booking-header">
                <div>
                  <div className="booking-price-label">Custom Itinerary</div>
                  <div className="booking-price" style={{ fontSize: '1.25rem' }}>Best Rates on Enquiry</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Tailored to your dates & travellers</div>
                </div>
              </div>
              <div className="booking-body">
                <div className="booking-meta">
                  <div className="bm-row"><MapPin size={16} className="bm-icon" color="var(--teal)" /> {pkg.destinationName}</div>
                  <div className="bm-row"><Clock size={16} className="bm-icon" color="var(--teal)" /> {pkg.duration}</div>
                  <div className="bm-row"><Star size={16} className="bm-icon" color="var(--teal)" /> {pkg.rating} Rating</div>
                  <div className="bm-row"><Users size={16} className="bm-icon" color="var(--teal)" /> Group & Individual tours</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => { setFormErrors({}); setTouched({}); setEnquiryOpen(true); }}>
                  Book Now via WhatsApp
                </button>
                <a href="tel:+918792373736" className="btn btn-outline-dark" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Phone size={16} /> Call +91 87923 73736
                </a>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textAlign: 'center', marginTop: 16 }}>
                  Direct WhatsApp & Call · Instant Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {enquiryOpen && (
          <motion.div
            className="enquiry-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setEnquiryOpen(false); }}
          >
            <motion.div
              className="enquiry-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="enquiry-header">
                <div>
                  <h3 style={{ color: 'white', marginBottom: 4 }}>Enquire About This Package</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{pkg.title}</p>
                </div>
                <button onClick={() => setEnquiryOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 8, padding: 8, cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="enquiry-form" noValidate>
                {formErrors.submit && <div style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: '0.875rem' }}>{formErrors.submit}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="enquiry-name">
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      id="enquiry-name"
                      type="text"
                      maxLength={60}
                      className={`form-input ${formErrors.name ? 'error' : ''}`}
                      value={form.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                    {formErrors.name && (
                      <span className="form-error">
                        <AlertCircle size={13} /> {formErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="enquiry-phone">
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className={`phone-input-group ${formErrors.phone ? 'error' : ''}`}>
                      <div className="phone-prefix">
                        <span className="flag-icon">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input 
                        id="enquiry-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        className="phone-field"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="10-digit mobile number"
                        autoComplete="tel-national"
                      />
                    </div>
                    {formErrors.phone && (
                      <span className="form-error">
                        <AlertCircle size={13} /> {formErrors.phone}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="enquiry-travellers">
                      No. of Travellers <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      id="enquiry-travellers"
                      type="number"
                      min="1"
                      max="100"
                      className={`form-input ${formErrors.travellers ? 'error' : ''}`}
                      value={form.travellers}
                      onChange={e => handleInputChange('travellers', e.target.value)}
                      onBlur={() => handleBlur('travellers')}
                      placeholder="e.g. 2"
                    />
                    {formErrors.travellers && (
                      <span className="form-error">
                        <AlertCircle size={13} /> {formErrors.travellers}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="enquiry-date">
                      Date of Travel <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      id="enquiry-date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className={`form-input ${formErrors.travelDate ? 'error' : ''}`}
                      value={form.travelDate}
                      onChange={e => handleInputChange('travelDate', e.target.value)}
                      onBlur={() => handleBlur('travelDate')}
                    />
                    {formErrors.travelDate && (
                      <span className="form-error">
                        <AlertCircle size={13} /> {formErrors.travelDate}
                      </span>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} disabled={submitting}>
                  {submitting ? 'Connecting to WhatsApp...' : 'Book via WhatsApp'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageDetail;
