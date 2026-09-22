import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Plane, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const solid = scrolled || !isHome;

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/packages', label: 'Tour Packages' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
          padding: ${solid ? '0.75rem 0' : '1.5rem 0'};
        }
        .navbar-solid {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 20px rgba(12,26,46,0.1);
        }
        .navbar-transparent {
          background: linear-gradient(to bottom, rgba(12,26,46,0.7) 0%, transparent 100%);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .nav-logo:hover {
          transform: translateY(-1px);
        }
        .nav-logo-badge {
          height: 48px;
          padding: 2px 4px;
          background: ${solid ? 'transparent' : 'rgba(255, 255, 255, 0.95)'};
          border-radius: var(--r-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${solid ? 'none' : '0 4px 12px rgba(0,0,0,0.18)'};
          transition: all 0.3s ease;
        }
        .nav-logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .nav-logo-text {
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: ${solid ? 'var(--navy)' : 'white'};
          transition: color 0.4s;
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .nav-logo-brand {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-logo-brand .gold-text {
          color: var(--gold);
        }
        .nav-logo-sub {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: ${solid ? 'var(--teal)' : 'var(--gold)'};
          margin-top: 3px;
        }
        .nav-links {
          display: none;
          align-items: center;
          gap: var(--sp-1);
        }
        .nav-link {
          padding: 0.5rem 0.875rem;
          border-radius: var(--r-full);
          font-weight: 500;
          font-size: 0.925rem;
          color: ${solid ? 'var(--gray-600)' : 'rgba(255,255,255,0.9)'};
          transition: all 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: ${solid ? 'var(--navy)' : 'white'};
          background: ${solid ? 'var(--gray-50)' : 'rgba(255,255,255,0.1)'};
        }
        .nav-link.active {
          color: var(--teal);
          font-weight: 600;
          background: ${solid ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.15)'};
        }
        .nav-cta {
          background: linear-gradient(135deg, var(--blue), var(--teal));
          color: white !important;
          padding: 0.6rem 1.25rem;
          border-radius: var(--r-full);
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 14px rgba(14,110,184,0.35);
          transition: all 0.25s;
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,110,184,0.45);
          background: ${solid ? '' : 'rgba(255,255,255,0.2) !important'};
        }
        .hamburger {
          background: none;
          border: none;
          color: ${solid ? 'var(--navy)' : 'white'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: var(--r-sm);
          transition: background 0.2s;
        }
        .hamburger:hover { background: ${solid ? 'var(--gray-100)' : 'rgba(255,255,255,0.15)'}; }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12,26,46,0.5);
          z-index: 998;
          backdrop-filter: blur(4px);
        }
        .mobile-nav {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(320px, 85vw);
          background: var(--white);
          z-index: 999;
          padding: var(--sp-6);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -10px 0 40px rgba(12,26,46,0.2);
        }
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sp-8);
          padding-bottom: var(--sp-6);
          border-bottom: 1px solid var(--gray-100);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: var(--sp-4);
          border-radius: var(--r-md);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--gray-700);
          transition: all 0.2s;
          margin-bottom: var(--sp-1);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: var(--gray-50);
          color: var(--teal);
        }
        .mobile-nav-cta {
          margin-top: var(--sp-6);
          width: 100%;
          text-align: center;
        }

        @media (min-width: 900px) {
          .nav-links { display: flex; }
          .hamburger { display: none; }
        }
        @media (max-width: 899px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className={`navbar ${solid ? 'navbar-solid' : 'navbar-transparent'}`}>
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-badge">
              <img
                src="/logo-transparent.png"
                alt="V-RAJ Holidays"
                className="nav-logo-img"
              />
            </div>
            <div className="nav-logo-text">
              <div className="nav-logo-brand">
                <span>V-RAJ</span>
              </div>
              <div className="nav-logo-sub">HOLIDAYS</div>
            </div>
          </Link>

          <div className="nav-links">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/contact" className="nav-link nav-cta" style={{ marginLeft: 'var(--sp-2)' }}>
              Plan Your Trip
            </Link>
          </div>

          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-nav-header">
                <Link to="/" className="nav-logo" style={{ color: 'var(--navy)' }}>
                  <img
                    src="/logo-transparent.png"
                    alt="V-RAJ Holidays"
                    style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
                  />
                  <div className="nav-logo-text" style={{ color: 'var(--navy)' }}>
                    <div className="nav-logo-brand">
                      <span>V-RAJ</span>
                    </div>
                    <div className="nav-logo-sub" style={{ color: 'var(--teal)' }}>HOLIDAYS</div>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              <Link
                to="/contact"
                className="btn btn-primary mobile-nav-cta"
                onClick={() => setMobileOpen(false)}
              >
                Plan Your Trip
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
