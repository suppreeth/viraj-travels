import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: var(--navy);
          color: rgba(255,255,255,0.75);
          padding-top: var(--sp-20);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: var(--sp-12);
          padding-bottom: var(--sp-12);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: var(--sp-4);
        }
        .footer-brand-logo-badge {
          height: 52px;
          background: #ffffff;
          border-radius: var(--r-md);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          flex-shrink: 0;
        }
        .footer-brand-logo {
          height: 100%;
          width: auto;
          object-fit: contain;
        }
        .footer-brand-name {
          font-size: 1.3rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.02em;
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }
        .footer-brand-sub {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: var(--gold);
          margin-top: 2px;
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          max-width: 280px;
          margin-bottom: var(--sp-5);
        }
        .footer-social {
          display: flex;
          gap: var(--sp-3);
        }
        .social-icon {
          width: 38px; height: 38px;
          border-radius: var(--r-md);
          background: rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
        }
        .social-icon:hover {
          background: var(--teal);
          color: white;
          transform: translateY(-2px);
        }
        .footer-heading {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          margin-bottom: var(--sp-5);
        }
        .footer-links { display: flex; flex-direction: column; gap: var(--sp-3); }
        .footer-link {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .footer-link:hover { color: var(--teal-light); }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-3);
          margin-bottom: var(--sp-4);
          font-size: 0.9rem;
        }
        .footer-contact-icon {
          width: 32px; height: 32px;
          border-radius: var(--r-sm);
          background: rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--teal-light);
        }
        .newsletter-input-group {
          display: flex;
          margin-top: var(--sp-4);
          border-radius: var(--r-md);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .newsletter-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.06);
          border: none;
          color: white;
          font-size: 0.875rem;
        }
        .newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
        .newsletter-input:focus { outline: none; background: rgba(255,255,255,0.1); }
        .newsletter-btn {
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          border: none;
          color: white;
          cursor: pointer;
          display: flex; align-items: center;
          transition: opacity 0.2s;
        }
        .newsletter-btn:hover { opacity: 0.9; }
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-6) 0;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
        }
        @media (min-width: 900px) { .footer-bottom { flex-direction: row; justify-content: space-between; } }
        @media (max-width: 899px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--sp-8); }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <div className="footer-brand-logo-badge">
                <img
                  src="/logo-transparent.png"
                  alt="V-RAJ Holidays"
                  className="footer-brand-logo"
                />
              </div>
              <div className="footer-brand-name">
                <span>V-RAJ</span>
                <span className="footer-brand-sub">HOLIDAYS</span>
              </div>
            </div>
            <p className="footer-desc">
              Creating unforgettable travel experiences since 2015. We believe every journey should be a story worth telling.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" className="social-icon" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="social-icon" aria-label="YouTube"><YoutubeIcon /></a>
              <a href="https://wa.me/919876543210" className="social-icon" aria-label="WhatsApp"><MessageCircle size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/destinations" className="footer-link">Destinations</Link>
              <Link to="/packages" className="footer-link">Tour Packages</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="footer-heading">Popular Destinations</h4>
            <div className="footer-links">
              <Link to="/packages?destination=Goa" className="footer-link">Goa</Link>
              <Link to="/packages?destination=Kashmir" className="footer-link">Kashmir</Link>
              <Link to="/packages?destination=Kerala" className="footer-link">Kerala</Link>
              <Link to="/packages?destination=Dubai" className="footer-link">Dubai</Link>
              <Link to="/packages?destination=Bali" className="footer-link">Bali</Link>
              <Link to="/packages?destination=Maldives" className="footer-link">Maldives</Link>
            </div>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><Phone size={14} /></div>
              <div>
                <div style={{ color: 'white', fontWeight: 500 }}>+91 98765 43210</div>
                <div style={{ fontSize: '0.8rem' }}>Mon-Sat, 9am – 7pm</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><Mail size={14} /></div>
              <div>
                <div style={{ color: 'white', fontWeight: 500 }}>hello@vrajholidays.com</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><MapPin size={14} /></div>
              <div>
                <div style={{ color: 'white', fontWeight: 500 }}>Bengaluru, Karnataka</div>
                <div style={{ fontSize: '0.8rem' }}>India - 560001</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', marginBottom: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>Get travel deals in your inbox:</p>
            <div className="newsletter-input-group">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button className="newsletter-btn"><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} V-RAJ Holidays. All Rights Reserved.</span>
          <span style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--teal-light)'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--teal-light)'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}>Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
