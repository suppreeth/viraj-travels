import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Plane, ChevronDown, Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES } from '../context/ThemeContext';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { 
    setMobileOpen(false); 
    setThemeOpen(false);
  }, [location]);

  // Click outside listener for theme dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const solid = scrolled || !isHome;

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/packages', label: 'Tour Packages' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/about', label: 'About Us' },
  ];

  const themeOptions = [
    {
      id: THEMES.MIDNIGHT_LIME,
      name: 'Midnight Teal & Neon Lime',
      subtitle: 'Deep midnight teal, soft pearl & vibrant neon lime',
      badge: 'Luxury Dark',
      colors: ['#06131e', '#f8fafc', '#bbf43d'],
    },
    {
      id: THEMES.GRAPHITE_YELLOW,
      name: 'Deep Graphite & Sunshine Yellow',
      subtitle: 'Deep graphite, soft cloud white & sunshine yellow',
      badge: 'Radiant Dark',
      colors: ['#101216', '#f8fafc', '#facc15'],
    },
    {
      id: THEMES.CLASSIC,
      name: 'Classic Coastal',
      subtitle: 'Crisp coastal blue, deep navy & warm gold',
      badge: 'Original Light',
      colors: ['#ffffff', '#0c1e34', '#0d9488'],
    },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
          padding: ${solid ? '0.55rem 0' : '1.15rem 0'};
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
          width: 100%;
          max-width: 1680px;
          margin: 0 auto;
          padding: 0 var(--sp-8);
        }
        .nav-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          line-height: 0;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .nav-logo:hover {
          transform: translateY(-1px);
          opacity: 0.92;
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

        /* ─── THEME DROPDOWN BUTTON & PANEL ─── */
        .theme-selector-wrap {
          position: relative;
          margin-left: 8px;
        }
        .theme-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.55rem 0.95rem;
          border-radius: var(--r-full);
          font-weight: 600;
          font-size: 0.86rem;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1.5px solid transparent;
          background: ${solid ? 'var(--gray-100)' : 'rgba(255,255,255,0.18)'};
          color: ${solid ? 'var(--navy)' : '#ffffff'};
          backdrop-filter: blur(10px);
        }
        .theme-trigger-btn:hover {
          transform: translateY(-1px);
          background: ${solid ? 'var(--gray-200)' : 'rgba(255,255,255,0.28)'};
        }
        .theme-trigger-btn.is-lime {
          background: rgba(187, 244, 61, 0.14) !important;
          color: #bbf43d !important;
          border-color: rgba(187, 244, 61, 0.4) !important;
          box-shadow: 0 0 16px rgba(187, 244, 61, 0.2);
        }
        .theme-trigger-btn.is-lime:hover {
          background: rgba(187, 244, 61, 0.24) !important;
          border-color: #bbf43d !important;
          box-shadow: 0 0 22px rgba(187, 244, 61, 0.35);
        }
        .theme-trigger-btn.is-yellow {
          background: rgba(250, 204, 21, 0.14) !important;
          color: #facc15 !important;
          border-color: rgba(250, 204, 21, 0.4) !important;
          box-shadow: 0 0 16px rgba(250, 204, 21, 0.2);
        }
        .theme-trigger-btn.is-yellow:hover {
          background: rgba(250, 204, 21, 0.24) !important;
          border-color: #facc15 !important;
          box-shadow: 0 0 22px rgba(250, 204, 21, 0.35);
        }
        .theme-chevron {
          transition: transform 0.2s ease;
        }
        .theme-chevron.rotated {
          transform: rotate(180deg);
        }

        .theme-dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 320px;
          background: #ffffff;
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 16px 45px rgba(12, 26, 46, 0.18);
          border: 1px solid rgba(0, 0, 0, 0.08);
          z-index: 1000;
        }
        .theme-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .theme-header-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #64748b;
        }
        .theme-header-hint {
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .theme-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .theme-option-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-option-item:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .theme-option-item.active {
          border-color: var(--teal);
          background: rgba(13, 148, 136, 0.06);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.12);
        }
        .theme-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .theme-item-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .theme-item-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          background: #e2e8f0;
          color: #475569;
          text-transform: uppercase;
        }
        .theme-item-sub {
          font-size: 0.76rem;
          color: #64748b;
          line-height: 1.35;
        }
        .theme-swatch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          padding-top: 6px;
        }
        .theme-swatches {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .theme-color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.15);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .theme-active-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #0d9488;
        }
        .theme-select-hint {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Dark Theme overrides for the panel */
        [data-theme="midnight-lime"] .theme-dropdown-panel {
          background: #091a27 !important;
          border-color: rgba(187, 244, 61, 0.28) !important;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(187, 244, 61, 0.15) !important;
        }
        [data-theme="midnight-lime"] .theme-dropdown-header {
          border-bottom-color: rgba(187, 244, 61, 0.15) !important;
        }
        [data-theme="midnight-lime"] .theme-header-title {
          color: #bbf43d !important;
        }
        [data-theme="midnight-lime"] .theme-option-item {
          background: #0d2234 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme="midnight-lime"] .theme-option-item:hover {
          border-color: rgba(187, 244, 61, 0.4) !important;
          background: #112a40 !important;
        }
        [data-theme="midnight-lime"] .theme-option-item.active {
          border-color: #bbf43d !important;
          background: rgba(187, 244, 61, 0.12) !important;
          box-shadow: 0 0 20px rgba(187, 244, 61, 0.18) !important;
        }
        [data-theme="midnight-lime"] .theme-item-name {
          color: #f8fafc !important;
        }
        [data-theme="midnight-lime"] .theme-item-badge {
          background: rgba(187, 244, 61, 0.15) !important;
          color: #bbf43d !important;
        }
        [data-theme="midnight-lime"] .theme-item-sub {
          color: #94a3b8 !important;
        }
        [data-theme="midnight-lime"] .theme-active-tag {
          color: #bbf43d !important;
        }
        [data-theme="midnight-lime"] .theme-color-dot {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }

        /* Graphite Yellow Theme overrides for the panel */
        [data-theme="graphite-yellow"] .theme-dropdown-panel {
          background: #16191f !important;
          border-color: rgba(250, 204, 21, 0.3) !important;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(250, 204, 21, 0.15) !important;
        }
        [data-theme="graphite-yellow"] .theme-dropdown-header {
          border-bottom-color: rgba(250, 204, 21, 0.15) !important;
        }
        [data-theme="graphite-yellow"] .theme-header-title {
          color: #facc15 !important;
        }
        [data-theme="graphite-yellow"] .theme-option-item {
          background: #1c2027 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="graphite-yellow"] .theme-option-item:hover {
          border-color: rgba(250, 204, 21, 0.45) !important;
          background: #242932 !important;
        }
        [data-theme="graphite-yellow"] .theme-option-item.active {
          border-color: #facc15 !important;
          background: rgba(250, 204, 21, 0.12) !important;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.18) !important;
        }
        [data-theme="graphite-yellow"] .theme-item-name {
          color: #f8fafc !important;
        }
        [data-theme="graphite-yellow"] .theme-item-badge {
          background: rgba(250, 204, 21, 0.15) !important;
          color: #facc15 !important;
        }
        [data-theme="graphite-yellow"] .theme-item-sub {
          color: #94a3b8 !important;
        }
        [data-theme="graphite-yellow"] .theme-active-tag {
          color: #facc15 !important;
        }
        [data-theme="graphite-yellow"] .theme-color-dot {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }

        /* Mobile theme selector */
        .mobile-theme-section {
          margin-top: var(--sp-6);
          padding-top: var(--sp-4);
          border-top: 1px solid var(--gray-200);
        }
        .mobile-theme-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--sp-3);
        }
        .mobile-theme-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-theme-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: var(--r-md);
          border: 1.5px solid var(--gray-200);
          background: var(--gray-50);
          font-size: 0.88rem;
          cursor: pointer;
          color: var(--gray-800);
          transition: all 0.2s;
        }
        .mobile-theme-btn.active {
          border-color: var(--teal);
          background: rgba(13, 148, 136, 0.08);
          color: var(--teal);
          font-weight: 600;
        }
        [data-theme="midnight-lime"] .mobile-theme-section {
          border-top-color: rgba(187, 244, 61, 0.15) !important;
        }
        [data-theme="midnight-lime"] .mobile-theme-header {
          color: #bbf43d !important;
        }
        [data-theme="midnight-lime"] .mobile-theme-btn {
          background: #0d2234 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #cbd5e1 !important;
        }
        [data-theme="midnight-lime"] .mobile-theme-btn.active {
          border-color: #bbf43d !important;
          background: rgba(187, 244, 61, 0.12) !important;
          color: #bbf43d !important;
        }

        [data-theme="graphite-yellow"] .mobile-theme-section {
          border-top-color: rgba(250, 204, 21, 0.15) !important;
        }
        [data-theme="graphite-yellow"] .mobile-theme-header {
          color: #facc15 !important;
        }
        [data-theme="graphite-yellow"] .mobile-theme-btn {
          background: #1c2027 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: #cbd5e1 !important;
        }
        [data-theme="graphite-yellow"] .mobile-theme-btn.active {
          border-color: #facc15 !important;
          background: rgba(250, 204, 21, 0.12) !important;
          color: #facc15 !important;
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
          .hamburger { 
            display: flex; 
            margin-left: auto;
          }
          .navbar {
            padding: ${solid ? '0.45rem 0' : '0.75rem 0'};
          }
          .nav-inner {
            width: 100%;
            padding: 0 var(--sp-4);
          }
          .nav-logo .brand-logo-wrap img {
            height: 52px !important;
          }
        }
        @media (max-width: 480px) {
          .nav-logo .brand-logo-wrap img {
            height: 48px !important;
          }
        }
      `}</style>

      <nav className={`navbar ${solid ? 'navbar-solid' : 'navbar-transparent'}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="V Raj Holidays">
            <BrandLogo height={solid ? 58 : 74} solid={solid} />
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

            {/* ─── THEMES OPTION NEXT TO PLAN YOUR TRIP ─── */}
            <div className="theme-selector-wrap" ref={themeDropdownRef}>
              <button
                type="button"
                className={`theme-trigger-btn ${theme === THEMES.MIDNIGHT_LIME ? 'is-lime' : ''} ${theme === THEMES.GRAPHITE_YELLOW ? 'is-yellow' : ''} ${themeOpen ? 'open' : ''}`}
                onClick={() => setThemeOpen(!themeOpen)}
                aria-label="Website Themes"
                title="Change Website Theme"
              >
                <Palette size={16} />
                <span>Themes</span>
                <ChevronDown size={14} className={`theme-chevron ${themeOpen ? 'rotated' : ''}`} />
              </button>

              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    className="theme-dropdown-panel"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <div className="theme-dropdown-header">
                      <div className="theme-header-title">
                        <Sparkles size={14} />
                        <span>WEBSITE THEMES</span>
                      </div>
                      <span className="theme-header-hint">Choose aesthetic</span>
                    </div>

                    <div className="theme-options-list">
                      {themeOptions.map((opt) => {
                        const isActive = theme === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={`theme-option-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                              setTheme(opt.id);
                              setThemeOpen(false);
                            }}
                          >
                            <div className="theme-item-top">
                              <span className="theme-item-name">{opt.name}</span>
                              <span className="theme-item-badge">{opt.badge}</span>
                            </div>
                            <div className="theme-item-sub">{opt.subtitle}</div>
                            <div className="theme-swatch-row">
                              <div className="theme-swatches">
                                {opt.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    className="theme-color-dot"
                                    style={{ backgroundColor: c }}
                                    title={c}
                                  />
                                ))}
                              </div>
                              {isActive ? (
                                <span className="theme-active-tag">
                                  <Check size={13} strokeWidth={3} /> Active
                                </span>
                              ) : (
                                <span className="theme-select-hint">Select</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)} aria-label="V Raj Holidays">
                  <BrandLogo height={64} solid={theme === THEMES.CLASSIC} />
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

              {/* Mobile Themes Section */}
              <div className="mobile-theme-section">
                <div className="mobile-theme-header">
                  <Palette size={16} />
                  <span>Choose Theme</span>
                </div>
                <div className="mobile-theme-options">
                  {themeOptions.map((opt) => {
                    const isActive = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`mobile-theme-btn ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setTheme(opt.id);
                          setMobileOpen(false);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="theme-swatches" style={{ gap: 4 }}>
                            {opt.colors.map((c, i) => (
                              <span key={i} className="theme-color-dot" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <span style={{ fontWeight: 600 }}>{opt.name}</span>
                        </div>
                        {isActive && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
