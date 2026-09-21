import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Mail, Compass, Sparkles, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { submitLead } from '../services/api';

const STORAGE_DISMISSED_KEY = 'vt_lead_popup_dismissed';

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: '',
    website: '' // Anti-spam honeypot field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const location = useLocation();

  // Re-appear every 6 seconds until the user submits the form
  useEffect(() => {
    // Don't show popup on admin page
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // If user has successfully submitted the lead, never show popup again
    const isSubmitted = sessionStorage.getItem(STORAGE_DISMISSED_KEY) === 'submitted';
    if (isSubmitted || isSuccess) {
      return;
    }

    let timer;
    if (!isOpen) {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [location.pathname, isOpen, isSuccess]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Validate Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters';
    }

    // Validate Phone Number
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 16) {
        newErrors.phone = 'Please enter a valid phone number (min 7 digits)';
      }
    }

    // Validate Email ONLY if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        requirement: formData.requirement.trim() || undefined,
        website: formData.website, // Honeypot
        source: 'lead-consultation-popup'
      });

      setIsSuccess(true);
      sessionStorage.setItem(STORAGE_DISMISSED_KEY, 'submitted');

      // Auto-close modal after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      console.error('Lead submission error:', err);
      const message =
        err.response?.data?.message ||
        'Unable to send enquiry right now. Please try again or call us directly.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const isCurrentAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <style>{`
        .lead-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12, 26, 46, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
        }
        .lead-popup-container {
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-radius: var(--r-xl);
          box-shadow: 0 25px 50px -12px rgba(12, 26, 46, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          position: relative;
        }
        .lead-popup-header {
          background: linear-gradient(135deg, var(--navy) 0%, #15335d 100%);
          color: white;
          padding: 1.75rem 1.75rem 1.5rem;
          position: relative;
        }
        .lead-popup-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--teal), var(--blue-bright), var(--gold));
        }
        .lead-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(13, 148, 136, 0.22);
          border: 1px solid rgba(20, 184, 166, 0.35);
          color: var(--teal-light);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.75rem;
          border-radius: var(--r-full);
          margin-bottom: 0.75rem;
        }
        .lead-popup-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 0.35rem;
        }
        .lead-popup-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.45;
        }
        .lead-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lead-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(90deg);
        }
        .lead-popup-body {
          padding: 1.75rem;
        }
        .lead-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .lead-input-icon {
          position: absolute;
          left: 14px;
          color: var(--gray-400);
          pointer-events: none;
          transition: color 0.2s;
        }
        .lead-field-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.65rem;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-md);
          font-size: 0.95rem;
          color: var(--gray-800);
          background: var(--white);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lead-field-input:focus {
          outline: none;
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(14, 110, 184, 0.12);
        }
        .lead-field-input.has-error {
          border-color: #ef4444;
        }
        .lead-field-textarea {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.65rem;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-md);
          font-size: 0.95rem;
          color: var(--gray-800);
          background: var(--white);
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: vertical;
          min-height: 80px;
        }
        .lead-field-textarea:focus {
          outline: none;
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(14, 110, 184, 0.12);
        }
        .lead-honeypot {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          height: 0;
          width: 0;
          z-index: -1;
          pointer-events: none;
        }
        .lead-error-msg {
          font-size: 0.8rem;
          color: #ef4444;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .lead-submit-btn {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: linear-gradient(135deg, var(--blue) 0%, var(--teal) 100%);
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: var(--r-full);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(14, 110, 184, 0.35);
          transition: all 0.25s var(--ease);
          margin-top: 1.25rem;
        }
        .lead-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 110, 184, 0.45);
        }
        .lead-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .lead-assurance {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 1rem;
          font-size: 0.78rem;
          color: var(--gray-500);
        }
        .lead-success-state {
          padding: 2.5rem 1.5rem;
          text-align: center;
        }
        .lead-success-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(13, 148, 136, 0.12);
          color: var(--teal);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .lead-server-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: var(--r-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
        }

        /* Always Accessible Floating Badge - Positioned on Bottom-Left to prevent overlapping right FABs */
        .lead-floating-badge {
          position: fixed;
          bottom: 28px;
          left: 28px;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          color: white;
          border: none;
          border-radius: var(--r-full);
          padding: 0.75rem 1.35rem;
          font-weight: 700;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 28px rgba(14, 110, 184, 0.45);
          cursor: pointer;
          z-index: 990;
          transition: all 0.25s ease;
        }
        .lead-floating-badge:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 36px rgba(14, 110, 184, 0.6);
        }
        @media (max-width: 600px) {
          .lead-floating-badge {
            bottom: 20px;
            left: 18px;
            padding: 0.65rem 1.15rem;
            font-size: 0.85rem;
          }
          .lead-popup-container {
            max-width: 100%;
            border-radius: var(--r-lg);
          }
          .lead-popup-header {
            padding: 1.25rem 1.25rem 1.15rem;
          }
          .lead-popup-title {
            font-size: 1.25rem;
          }
          .lead-popup-body {
            padding: 1.25rem;
          }
        }
      `}</style>

      {/* Floating Trigger Button - Always accessible so popup can be opened anytime */}
      {!isOpen && !isCurrentAdmin && (
        <motion.button
          type="button"
          className="lead-floating-badge"
          onClick={() => {
            setIsSuccess(false);
            setIsOpen(true);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Get a Free Travel Consultation"
        >
          <Sparkles size={16} />
          <span>Get Free Consultation</span>
        </motion.button>
      )}

      {/* Popup Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="lead-popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <motion.div
              className="lead-popup-container"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="lead-popup-header">
                <button
                  type="button"
                  className="lead-close-btn"
                  onClick={handleClose}
                  aria-label="Close consultation popup"
                >
                  <X size={18} />
                </button>

                <div className="lead-badge">
                  <Sparkles size={13} />
                  <span>Personalized Service</span>
                </div>

                <h2 id="lead-popup-title" className="lead-popup-title">
                  Get a Free Travel Consultation
                </h2>
                <p className="lead-popup-subtitle">
                  Plan with our experts to curate your perfect itinerary at the best rates.
                </p>
              </div>

              {/* Body */}
              <div className="lead-popup-body">
                {isSuccess ? (
                  <motion.div
                    className="lead-success-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="lead-success-icon-wrap">
                      <CheckCircle2 size={38} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>
                      Thank You!
                    </h3>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '360px', margin: '0 auto' }}>
                      Thank you! We've received your enquiry. Our team will contact you soon.
                    </p>
                    <div style={{ marginTop: '1.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={handleClose}
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {serverError && (
                      <div className="lead-server-error" role="alert">
                        <AlertCircle size={18} />
                        <span>{serverError}</span>
                      </div>
                    )}

                    {/* Honeypot hidden input for spam protection */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="lead-honeypot"
                      aria-hidden="true"
                    />

                    {/* Field 1: Full Name (Required) */}
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" htmlFor="lead-name">
                        Full Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div className="lead-input-wrapper">
                        <input
                          id="lead-name"
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          className={`lead-field-input ${errors.name ? 'has-error' : ''}`}
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={loading}
                          required
                        />
                        <User size={18} className="lead-input-icon" />
                      </div>
                      {errors.name && (
                        <span className="lead-error-msg">
                          <AlertCircle size={13} /> {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Field 2: Phone Number (Required) */}
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" htmlFor="lead-phone">
                        Phone Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div className="lead-input-wrapper">
                        <input
                          id="lead-phone"
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          className={`lead-field-input ${errors.phone ? 'has-error' : ''}`}
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={loading}
                          required
                        />
                        <Phone size={18} className="lead-input-icon" />
                      </div>
                      {errors.phone && (
                        <span className="lead-error-msg">
                          <AlertCircle size={13} /> {errors.phone}
                        </span>
                      )}
                    </div>

                    {/* Field 3: Email (Optional) */}
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" htmlFor="lead-email">
                        Email Address <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: '0.8rem' }}>(Optional)</span>
                      </label>
                      <div className="lead-input-wrapper">
                        <input
                          id="lead-email"
                          type="email"
                          placeholder="e.g. rahul@example.com"
                          className={`lead-field-input ${errors.email ? 'has-error' : ''}`}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={loading}
                        />
                        <Mail size={18} className="lead-input-icon" />
                      </div>
                      {errors.email && (
                        <span className="lead-error-msg">
                          <AlertCircle size={13} /> {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Field 4: Travel Destination / Requirement (Optional) */}
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label" htmlFor="lead-req">
                        Travel Destination / Requirement <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: '0.8rem' }}>(Optional)</span>
                      </label>
                      <div className="lead-input-wrapper" style={{ alignItems: 'flex-start' }}>
                        <textarea
                          id="lead-req"
                          rows={2}
                          placeholder="e.g. Goa in December, 4 adults, beachside resort"
                          className="lead-field-textarea"
                          value={formData.requirement}
                          onChange={(e) => handleInputChange('requirement', e.target.value)}
                          disabled={loading}
                        />
                        <Compass size={18} className="lead-input-icon" style={{ top: 12 }} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="lead-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Sending enquiry...</span>
                      ) : (
                        <>
                          <span>Get in Touch</span>
                          <Sparkles size={17} />
                        </>
                      )}
                    </button>

                    <div className="lead-assurance">
                      <span>🔒 100% Privacy</span>
                      <span>•</span>
                      <span>⚡ Quick Response</span>
                      <span>•</span>
                      <span>✈️ Custom Plans</span>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadPopup;
