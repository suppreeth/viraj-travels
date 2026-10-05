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

const WhatsAppIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.09 19.09L7.8 18.92L4.69 19.74L5.52 16.71L5.33 16.41C4.55 15.17 4.13 13.56 4.13 11.92C4.13 7.38 7.84 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.24 7.41 7.99 7.68C7.74 7.95 7.03 8.62 7.03 9.99C7.03 11.36 8.03 12.68 8.17 12.87C8.31 13.06 10.13 15.86 12.91 17.06C13.57 17.35 14.09 17.52 14.49 17.65C15.15 17.86 15.75 17.83 16.22 17.76C16.75 17.68 17.85 17.09 18.08 16.45C18.31 15.81 18.31 15.26 18.24 15.15C18.17 15.04 17.98 14.98 17.7 14.84C17.42 14.7 16.05 14.02 15.8 13.93C15.54 13.84 15.35 13.79 15.17 14.07C14.98 14.35 14.45 14.98 14.28 15.17C14.12 15.35 13.96 15.38 13.68 15.24C13.4 15.1 12.5 14.81 11.43 13.85C10.6 13.11 10.04 12.19 9.87 11.91C9.71 11.63 9.85 11.48 9.99 11.34C10.12 11.21 10.27 11.01 10.41 10.85C10.55 10.69 10.6 10.57 10.69 10.39C10.78 10.21 10.74 10.04 10.67 9.9C10.6 9.77 10.04 8.4 9.81 7.85C9.58 7.31 9.35 7.39 9.18 7.38C9.02 7.37 8.88 7.34 8.73 7.34Z" />
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
              <a href="https://wa.me/917483156701" className="social-icon" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /></a>
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
                <div style={{ color: 'white', fontWeight: 500 }}>+91 74831 56701</div>
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
