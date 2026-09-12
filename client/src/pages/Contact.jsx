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
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = 'Valid email required';
    if (!form.message.trim()) err.message = 'Message is required';
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
                <div className="ci-desc">4th Floor, Tech Park,<br />Outer Ring Road,<br />Bengaluru, Karnataka - 560001</div>
              </div>
            </div>
            
            <div className="ci-item">
              <div className="ci-icon"><Phone size={20} /></div>
              <div>
                <div className="ci-title">Phone & WhatsApp</div>
                <div className="ci-desc">+91 98765 43210<br />+91 98765 43211</div>
              </div>
            </div>

            <div className="ci-item">
              <div className="ci-icon"><Mail size={20} /></div>
              <div>
                <div className="ci-title">Email Address</div>
                <div className="ci-desc">hello@virajtravels.com<br />support@virajtravels.com</div>
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                {errors.submit && <div style={{ padding: 16, background: '#fef2f2', color: '#ef4444', borderRadius: 8, fontSize: '0.9rem' }}>{errors.submit}</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea className={`form-input ${errors.message ? 'error' : ''}`} rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you plan your next trip?" style={{ resize: 'vertical' }} />
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
