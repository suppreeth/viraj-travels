import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Star, Check, X, ArrowLeft, Phone, ChevronDown, ChevronUp, Users, Calendar } from 'lucide-react';
import { getPackageById, submitEnquiry } from '../services/api';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', travelDate: '', travellers: 2, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    getPackageById(id)
      .then(res => setPkg(res.data.data))
      .catch(() => setError('Package not found or unavailable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Valid email required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (!form.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSubmitting(true);
    try {
      await submitEnquiry({ ...form, packageId: id, destination: pkg?.destinationName });
      setSubmitted(true);
      setEnquiryOpen(false);
    } catch {
      setFormErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
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
          min-height: 420px;
          overflow: hidden;
        }
        .pkg-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .pkg-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12,26,46,0.85) 0%, rgba(12,26,46,0.3) 60%, transparent 100%);
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
        <div className="pkg-hero-content">
          <div className="container">
            <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', marginBottom: 16, fontSize: '0.875rem' }}>
              <ArrowLeft size={16} /> Back to Packages
            </Link>
            <span className="badge badge-teal" style={{ background: 'rgba(13,148,136,0.7)', color: 'white', marginBottom: 12 }}>{pkg.category}</span>
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
                  <div className="booking-price-label">Starting from</div>
                  <div className="booking-price">₹{Number(pkg.price).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>per person</div>
                </div>
              </div>
              <div className="booking-body">
                <div className="booking-meta">
                  <div className="bm-row"><MapPin size={16} className="bm-icon" color="var(--teal)" /> {pkg.destinationName}</div>
                  <div className="bm-row"><Clock size={16} className="bm-icon" color="var(--teal)" /> {pkg.duration}</div>
                  <div className="bm-row"><Star size={16} className="bm-icon" color="var(--teal)" /> {pkg.rating} Rating</div>
                  <div className="bm-row"><Users size={16} className="bm-icon" color="var(--teal)" /> Group & Individual tours</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => setEnquiryOpen(true)}>
                  Book Now / Enquire
                </button>
                <a href="tel:+919876543210" className="btn btn-outline-dark" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Phone size={16} /> Call Expert
                </a>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textAlign: 'center', marginTop: 16 }}>
                  Free cancellation · No booking fee
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
              <form onSubmit={handleSubmit} className="enquiry-form">
                {formErrors.submit && <div style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: '0.875rem' }}>{formErrors.submit}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className={`form-input ${formErrors.name ? 'error' : ''}`} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                    {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className={`form-input ${formErrors.email ? 'error' : ''}`} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                    {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className={`form-input ${formErrors.phone ? 'error' : ''}`} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                    {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. of Travellers</label>
                    <input type="number" min="1" className="form-input" value={form.travellers} onChange={e => setForm(p => ({ ...p, travellers: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Preferred Travel Date</label>
                    <input type="date" className="form-input" value={form.travelDate} onChange={e => setForm(p => ({ ...p, travelDate: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Message *</label>
                    <textarea className={`form-input ${formErrors.message ? 'error' : ''}`} rows={3} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us your requirements or questions..." style={{ resize: 'vertical' }} />
                    {formErrors.message && <span className="form-error">{formErrors.message}</span>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Enquiry'}
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
