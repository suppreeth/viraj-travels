import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { submitContact } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    const nameTrim = form.name.trim();
    if (!nameTrim) {
      err.name = 'Full name is required';
    } else if (nameTrim.length < 2) {
      err.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'.]+$/.test(nameTrim)) {
      err.name = 'Please enter letters only';
    }

    const emailTrim = form.email.trim();
    if (!emailTrim) {
      err.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrim)) {
      err.email = 'Please enter a valid email address';
    }

    const phoneTrim = form.phone.trim();
    const digitsOnly = phoneTrim.replace(/\D/g, '');
    if (!phoneTrim) {
      err.phone = 'Phone number is required';
    } else if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      err.phone = 'Please enter a valid 10-digit mobile number';
    }

    const msgTrim = form.message.trim();
    if (!msgTrim) {
      err.message = 'Message is required';
    } else if (msgTrim.length < 10) {
      err.message = 'Please provide at least 10 characters describing your requirement';
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    
    setLoading(true);
    setErrors({});
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      <style>{`
        .contact-hero {
          background: linear-gradient(135deg, var(--navy) 0%, #1a3a6c 100%);
          padding: var(--sp-20) 0;
          text-align: center;
          color: white;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: var(--sp-10);
          margin-top: -40px;
          position: relative;
          z-index: 10;
          padding-bottom: var(--sp-24);
        }
        .contact-info-card {
          background: white;
          border-radius: var(--r-xl);
          padding: var(--sp-8);
          box-shadow: var(--shadow-lg);
        }
        .ci-item {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-4);
          margin-bottom: var(--sp-6);
        }
        .ci-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(13,148,136,0.1);
          color: var(--teal);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ci-title { font-weight: 700; color: var(--navy); margin-bottom: 4px; }
        .ci-desc { color: var(--gray-600); font-size: 0.95rem; line-height: 1.6; }
        .contact-form-card {
          background: white;
          border-radius: var(--r-xl);
          padding: var(--sp-10);
          box-shadow: var(--shadow-lg);
        }
        .form-error {
          color: #ef4444;
          font-size: 0.78rem;
          font-weight: 500;
          margin-top: 4px;
          display: block;
        }
        .form-input.error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; margin-top: var(--sp-8); }
          .contact-hero { padding: var(--sp-16) 0 var(--sp-12); }
        }
      `}</style>

      <div className="contact-hero">
        <div className="container">
          <div className="section-eyebrow" style={{ justifyContent: 'center', color: 'var(--teal-light)' }}>Get In Touch</div>
          <h1 className="section-title" style={{ color: 'white', margin: '12px 0 16px' }}>Let's Plan Your <span style={{ color: 'var(--teal-light)' }}>Next Journey</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>Whether you have a question about a package, need a custom itinerary, or just want to say hi, our team is here for you.</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-grid">
          {/* Info Card */}
          <motion.div className="contact-info-card" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 32 }}>Contact Information</h3>
            
            <div className="ci-item">
              <div className="ci-icon"><MapPin size={20} /></div>
              <div>
                <div className="ci-title">Head Office</div>
                <div className="ci-desc">Mysuru (Mysore),<br />Karnataka - 570001,<br />India</div>
              </div>
            </div>
            
            <div className="ci-item">
              <div className="ci-icon"><Phone size={20} /></div>
              <div>
                <div className="ci-title">Phone & WhatsApp</div>
                <div className="ci-desc">+91 87923 73736</div>
              </div>
            </div>

            <div className="ci-item">
              <div className="ci-icon"><Mail size={20} /></div>
              <div>
                <div className="ci-title">Email Address</div>
                <div className="ci-desc">hello@vrajholidays.com<br />support@vrajholidays.com</div>
              </div>
            </div>

            <div className="ci-item" style={{ marginBottom: 0 }}>
              <div className="ci-icon"><Clock size={20} /></div>
              <div>
                <div className="ci-title">Business Hours</div>
                <div className="ci-desc">Monday - Saturday<br />09:00 AM - 07:00 PM (IST)</div>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div className="contact-form-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 32 }}>Send Us A Message</h3>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(13,148,136,0.1)', color: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: 8 }}>Message Sent Successfully!</h4>
                <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSuccess(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                {errors.submit && <div style={{ padding: 16, background: '#fef2f2', color: '#ef4444', borderRadius: 8, fontSize: '0.9rem' }}>{errors.submit}</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`} 
                      value={form.name} 
                      onChange={e => {
                        setForm(p => ({ ...p, name: e.target.value }));
                        if (errors.name) setErrors(p => ({ ...p, name: undefined }));
                      }} 
                      placeholder="Your full name" 
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className={`form-input ${errors.email ? 'error' : ''}`} 
                      value={form.email} 
                      onChange={e => {
                        setForm(p => ({ ...p, email: e.target.value }));
                        if (errors.email) setErrors(p => ({ ...p, email: undefined }));
                      }} 
                      placeholder="name@example.com" 
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`} 
                    value={form.phone} 
                    onChange={e => {
                      setForm(p => ({ ...p, phone: e.target.value }));
                      if (errors.phone) setErrors(p => ({ ...p, phone: undefined }));
                    }} 
                    placeholder="10-digit mobile number" 
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea 
                    className={`form-input ${errors.message ? 'error' : ''}`} 
                    rows={6} 
                    value={form.message} 
                    onChange={e => {
                      setForm(p => ({ ...p, message: e.target.value }));
                      if (errors.message) setErrors(p => ({ ...p, message: undefined }));
                    }} 
                    placeholder="How can we help you plan your next trip?" 
                    style={{ resize: 'vertical' }} 
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={loading}>
                  {loading ? 'Sending Message...' : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
