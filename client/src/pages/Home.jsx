import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, MapPin, Compass, Clock, Star, ArrowRight,
  CheckCircle2, Award, Globe, Zap, Shield, MessageSquare, ThumbsUp, Sparkles
} from 'lucide-react';
import PackageCard from '../components/PackageCard';
import CustomSelect from '../components/CustomSelect';
import { getFeaturedPackages, getDestinations, getTestimonials } from '../services/api';

/* ─────────────────────────────────────────
   GOOGLE MY BUSINESS ICON
───────────────────────────────────────── */
const GoogleIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

/* ─────────────────────────────────────────
   HERO SEARCH
───────────────────────────────────────── */
const HeroSearch = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [category, setCategory]       = useState('');
  const [duration, setDuration]       = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    if (category)    params.set('category', category);
    if (duration)    params.set('duration', duration);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="hs-form">
      <div className="hs-field">
        <label className="hs-label"><MapPin size={13} /> Destination</label>
        <input
          className="hs-input"
          type="text"
          placeholder="Where do you want to go?"
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
      </div>
      <div className="hs-sep" />
      <div className="hs-field">
        <label htmlFor="hero-travel-type" className="hs-label"><Compass size={13} /> Travel Type</label>
        <CustomSelect
          id="hero-travel-type"
          name="category"
          ariaLabel="Travel Type"
          variant="inline"
          className="hs-input"
          value={category}
          onChange={setCategory}
          options={[
            { value: '', label: 'All Categories' },
            { value: 'Honeymoon', label: 'Honeymoon' },
            { value: 'Family Tours', label: 'Family Tours' },
            { value: 'Adventure', label: 'Adventure' },
            { value: 'Beach Holidays', label: 'Beach Holidays' },
            { value: 'International Tours', label: 'International Tours' },
            { value: 'Luxury', label: 'Luxury' },
          ]}
        />
      </div>
      <div className="hs-sep" />
      <div className="hs-field">
        <label htmlFor="hero-duration" className="hs-label"><Clock size={13} /> Duration</label>
        <CustomSelect
          id="hero-duration"
          name="duration"
          ariaLabel="Duration"
          variant="inline"
          className="hs-input"
          value={duration}
          onChange={setDuration}
          options={[
            { value: '', label: 'Any Duration' },
            { value: '1-3', label: '1-3 Days' },
            { value: '4-7', label: '4-7 Days' },
            { value: '8+', label: '8+ Days' },
          ]}
        />
      </div>
      <button type="submit" className="hs-btn">
        <Search size={17} />
        <span>Search Trips</span>
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
const Counter = ({ end, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick  = () => {
      const elapsed  = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────────────────────────────────
   PACKAGE SKELETON
───────────────────────────────────────── */
const PackageSkeleton = () => (
  <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 420 }}>
    <div className="skeleton" style={{ height: '100%' }} />
  </div>
);

/* ─────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────── */
const TestimonialCard = ({ t }) => (
  <div className="tc-card">
    <div className="tc-top-row">
      <div className="tc-user-group">
        <div className="tc-avatar-wrapper">
          <img
            src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0d9488&color=fff&bold=true`}
            alt={t.name}
            className="tc-avatar"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0d9488&color=fff&bold=true`;
            }}
          />
          <span className="tc-google-avatar-badge" title="Google Verified Reviewer">
            <GoogleIcon size={13} />
          </span>
        </div>
        <div>
          <div className="tc-name">{t.name}</div>
          <div className="tc-reviewer-badge">
            <span className="tc-guide-star">★</span> {t.localGuide || 'Local Guide · Verified'}
          </div>
        </div>
      </div>
      <div className="tc-google-source-tag" title="Posted on Google My Business">
        <GoogleIcon size={17} />
      </div>
    </div>

    <div className="tc-meta-row">
      <div className="tc-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i} size={14}
            fill={i < Math.round(t.rating) ? '#fbbc04' : '#e2e8f0'}
            color={i < Math.round(t.rating) ? '#fbbc04' : '#cbd5e1'}
          />
        ))}
      </div>
      <span className="tc-time-ago">{t.timeAgo || '2 weeks ago'}</span>
    </div>

    {t.destination && (
      <div className="tc-dest-tag">
        <MapPin size={11} /> {t.destination}
      </div>
    )}

    <p className="tc-review">"{t.review}"</p>

    <div className="tc-footer-row">
      <div className="tc-verified-label">
        <CheckCircle2 size={13} color="#059669" /> Verified Google Review
      </div>
      <div className="tc-helpful-btn" title="Travellers found this helpful">
        <ThumbsUp size={12} /> {t.helpful || 12}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   HERO HEADLINES & CYCLING SLOGANS
───────────────────────────────────────── */
const SLOGANS = [
  { line1: 'Explore Paradise.', line2: 'Create Memories.' },
  { line1: 'Your Journey.', line2: 'Your Way.' },
  { line1: 'Discover Karnataka.', line2: 'Travel Comfortable.' },
];

const TYPE_START_MS  = 300;   // wait before typing starts
const TYPE_SPEED_MS  = 130;   // smooth typing speed per character
const LINE_PAUSE_MS  = 350;   // pause between line 1 and line 2
const SLOGAN_WAIT_MS = 2800;  // hold after slogan completes before starting next slogan in slideshow

const TypedLine = ({ text, count }) => (
  <>
    <span>{text.slice(0, count)}</span>
    {/* untyped letters stay in the layout (invisible) so nothing jumps or glitches */}
    <span style={{ visibility: 'hidden' }}>{text.slice(count)}</span>
  </>
);

const TypedHeadline = ({ count, slogan }) => {
  const line1 = slogan.line1;
  const line2 = slogan.line2;
  const n1 = Math.min(count, line1.length);
  const n2 = Math.max(0, count - line1.length);
  return (
    <h1 className="hero-h1" aria-label={`${line1} ${line2}`}>
      <span aria-hidden="true">
        <TypedLine text={line1} count={n1} />
        <em><TypedLine text={line2} count={n2} /></em>
      </span>
    </h1>
  );
};

/* ─────────────────────────────────────────
   FADE-UP WRAPPER
───────────────────────────────────────── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [packages,     setPackages]     = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pkgLoading,   setPkgLoading]   = useState(true);
  const [destLoading,  setDestLoading]  = useState(true);
  const [pkgError,     setPkgError]     = useState(null);
  const [testLoading,  setTestLoading]  = useState(true);

  // Continuous typing slogan slideshow in the hero
  const [sloganIndex, setSloganIndex] = useState(0);
  const [typed, setTyped] = useState(0);

  const currentSlogan = SLOGANS[sloganIndex] || SLOGANS[0];
  const totalChars = currentSlogan.line1.length + currentSlogan.line2.length;

  // Typing effect and slogan transitions (continuous slideshow)
  useEffect(() => {
    setTyped(0);
    let i = 0;
    let timer;

    const tick = () => {
      i += 1;
      setTyped(i);

      if (i >= totalChars) {
        // Slogan finished; hold for 2.8s before advancing to next slogan in slideshow
        timer = setTimeout(() => {
          setSloganIndex(prev => (prev + 1) % SLOGANS.length);
        }, SLOGAN_WAIT_MS);
        return;
      }

      const delay = i === currentSlogan.line1.length
        ? LINE_PAUSE_MS
        : TYPE_SPEED_MS + Math.random() * 20;

      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, TYPE_START_MS);
    return () => clearTimeout(timer);
  }, [sloganIndex, totalChars, currentSlogan.line1.length]);




  useEffect(() => {
    getFeaturedPackages()
      .then(res => setPackages(res.data.data || []))
      .catch(() => setPkgError('Unable to load packages right now.'))
      .finally(() => setPkgLoading(false));

    getDestinations()
      .then(res => setDestinations(res.data.data || []))
      .catch(() => {})
      .finally(() => setDestLoading(false));

    getTestimonials()
      .then(res => setTestimonials(res.data.data || []))
      .catch(() => {})
      .finally(() => setTestLoading(false));
  }, []);

  const categories = [
    { icon: '\u2764\uFE0F', label: 'Honeymoon',      value: 'Honeymoon',          img: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67', label: 'Family', value: 'Family Tours', img: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83C\uDFD4', label: 'Adventure',     value: 'Adventure',          img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83C\uDFD6', label: 'Beach',         value: 'Beach Holidays',     img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83C\uDF0E', label: 'International', value: 'International Tours', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' },
    { icon: '\u2728',       label: 'Luxury',        value: 'Luxury',             img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83D\uDE97', label: 'Weekend',       value: 'Weekend',            img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop' },
    { icon: '\uD83D\uDC65', label: 'Group Tours',   value: 'Group',              img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop' },
  ];

  const whyUs = [
    { icon: <Award size={26} />,         title: 'Best Price Guarantee',   desc: 'We match any lower price and never compromise on quality.' },
    { icon: <CheckCircle2 size={26} />,  title: 'Handpicked Experiences', desc: 'Every destination and stay is personally vetted by our team.' },
    { icon: <MessageSquare size={26} />, title: '24/7 Expert Support',    desc: 'Our travel experts are always available whenever you need them.' },
    { icon: <Zap size={26} />,           title: 'Customised Itineraries', desc: 'Trips designed around your preferences, pace, and budget.' },
    { icon: <Shield size={26} />,        title: 'Trusted & Reliable',     desc: 'Over 5000+ satisfied travellers trust V-RAJ Holidays every year.' },
    { icon: <Globe size={26} />,         title: '100+ Destinations',      desc: 'Domestic and international destinations for every kind of traveller.' },
  ];

  const staticDestinations = [
    { id: 'dest-coastal-karnataka', name: 'Gokarna & Coastal Karnataka', country: 'India', category: 'Beach', packageCount: 1, image: '/images/murdeshwar-coastal-tour.jpg' },
    { id: 'dest-munnar-kerala', name: 'Munnar & Wayanad', country: 'India', category: 'Honeymoon', packageCount: 1, image: '/images/munnar-tea-estate.jpg' },
    { id: 'dest-coorg', name: 'Coorg & Madikeri', country: 'India', category: 'Nature', packageCount: 1, image: '/images/coorg-abbi-falls-tour.jpg' },
    { id: 'dest-mysore', name: 'Mysore & Srirangapatna', country: 'India', category: 'Heritage', packageCount: 1, image: '/images/mysore-palace-tour.jpg' },
    { id: 'dest-chikkamagaluru', name: 'Chikkamagaluru', country: 'India', category: 'Adventure', packageCount: 1, image: '/images/chikkamagaluru-hills-tour.jpg' },
  ];
  const displayDests = (destinations.length > 0 ? destinations : staticDestinations)
    .filter(d => d.id !== 'dest-sakleshpur-chikmagalur' && !d.name?.toLowerCase().includes('sakleshpur'))
    .slice(0, 5);

  // Duplicate packages so marquee seamlessly loops in 1 continuous line from left to right
  const marqueePackages = React.useMemo(() => {
    if (!packages || packages.length === 0) return [];
    if (packages.length <= 4) {
      return [
        ...packages,
        ...packages,
        ...packages,
        ...packages
      ];
    }
    return [...packages, ...packages, ...packages];
  }, [packages]);

  // Duplicate cards so marquee seamlessly loops in 1 continuous line from left to right
  const marqueeReviews = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    if (testimonials.length <= 4) {
      return [
        ...testimonials,
        ...testimonials,
        ...testimonials,
        ...testimonials
      ];
    }
    return [...testimonials, ...testimonials];
  }, [testimonials]);

  return (
    <div className="home-page">
      <style>{`
        /* ─── HERO HERO & SLOGAN DISPLAY (typing intro, then packages) ─── */
        .hero-section {
          position: relative;
          min-height: calc(100vh - 60px);
          min-height: calc(100svh - 60px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hero-scene {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('/images/hero-classic-coastal.jpg')
            center 45% / cover no-repeat;
          z-index: 0;
          filter: saturate(1.1) contrast(1.05);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 35%,
            rgba(14, 165, 233, 0.12) 0%,
            rgba(10, 28, 50, 0.65) 50%,
            rgba(8, 20, 36, 0.90) 100%
          ),
          linear-gradient(
            170deg,
            rgba(10, 28, 50, 0.72) 0%,
            rgba(12, 38, 62, 0.48) 42%,
            rgba(13, 148, 136, 0.22) 75%,
            rgba(245, 158, 11, 0.18) 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        .hero-body,
        .hero-body-wide {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px var(--sp-8) 64px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.45);
          padding: 0.46rem 1.3rem;
          border-radius: var(--r-full);
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: var(--sp-6);
          box-shadow: 0 4px 18px rgba(0,0,0,0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hero-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .hero-h1 {
          font-family: 'Playfair Display', var(--font-serif);
          font-size: clamp(3.2rem, 6.2vw, 5.8rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.12;
          letter-spacing: -0.02em;
          margin-bottom: var(--sp-5);
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.65);
          max-width: 1180px;
          width: 100%;
        }
        .hero-h1 em {
          font-style: italic;
          color: #fcd34d;
          display: block;
          margin-top: 0.12em;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
        }
        .hero-desc {
          font-size: clamp(1.05rem, 1.6vw, 1.25rem);
          color: rgba(255,255,255,0.95);
          line-height: 1.75;
          max-width: 820px;
          margin: 0 auto;
          text-shadow: 0 2px 14px rgba(10, 28, 50, 0.6);
        }

        /* ─── FEATURED TOUR PACKAGES (LEFT-TO-RIGHT MARQUEE) ─── */
        .featured-packages-section {
          position: relative;
          padding: 80px 0 95px;
          background: #ffffff;
          overflow: hidden;
        }
        .featured-packages-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(2, 132, 199, 0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .featured-packages-section .container {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--sp-6);
        }
        .pkg-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 820px;
          margin: 0 auto var(--sp-6);
          gap: var(--sp-2);
        }
        .pkg-header .section-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          margin-bottom: 4px;
        }
        .pkg-header .section-title {
          text-align: center;
          margin: 0;
        }
        .pkg-header .section-subtitle {
          text-align: center;
          margin: 8px auto var(--sp-4);
          max-width: 720px;
        }
        .pkg-header-actions {
          display: flex;
          justify-content: center;
          margin-top: 2px;
        }
        .pkg-marquee-hint-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: var(--sp-4);
        }
        .pkg-marquee-hint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--gray-600);
          padding: 7px 16px;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--r-full);
          font-weight: 500;
        }
        .pkg-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
          animation: pulseDot 2s infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        .pkg-marquee-container {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          padding: 10px 0 25px 0;
          mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%);
        }
        .pkg-marquee-track {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 24px;
          width: max-content;
          animation: pkgMarqueeLeftToRight 55s linear infinite;
          will-change: transform;
        }
        .pkg-marquee-track:hover {
          animation-play-state: paused !important;
        }
        @keyframes pkgMarqueeLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .pkg-marquee-track .pkg-card {
          width: 340px;
          min-width: 340px;
          max-width: 340px;
          height: 480px;
          min-height: 480px;
          flex-shrink: 0;
          box-shadow: 0 10px 30px rgba(10, 20, 40, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pkg-marquee-track .pkg-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(10, 20, 40, 0.22);
        }
        .error-state { text-align: center; padding: var(--sp-12); color: var(--gray-500); }
        .error-state h3 { color: var(--gray-700); margin-bottom: var(--sp-2); }

        /* ─── SEARCH PANEL ─── */
        .search-panel-wrap {
          position: relative;
          z-index: 20;
          padding: 0 var(--sp-8);
          margin-top: -46px;
          margin-bottom: var(--sp-4);
          width: 100%;
        }
        .search-panel-inner {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
        }
        .hs-form {
          background: #fff;
          border-radius: var(--r-xl);
          box-shadow: 0 24px 64px rgba(10,20,40,0.22);
          border: 1px solid var(--gray-100);
          padding: 1.15rem 1.85rem;
          display: flex;
          align-items: center;
          width: 100%;
          gap: 0;
        }
        .hs-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 var(--sp-5);
          min-width: 0;
        }
        .hs-field:first-child { 
          padding-left: 0; 
          flex: 1.35;
        }
        .hs-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .hs-input {
          border: none;
          background: transparent;
          font-size: 0.98rem;
          color: var(--navy);
          font-weight: 600;
          padding: 0.25rem 0;
          width: 100%;
        }
        .hs-input:focus { outline: none; }
        .hs-input::placeholder { color: var(--gray-400); font-weight: 400; }
        .hs-sep {
          width: 1px;
          height: 42px;
          background: var(--gray-200);
          flex-shrink: 0;
          align-self: center;
        }
        .hs-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: 0.95rem 2rem;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          color: #fff;
          border: none;
          border-radius: var(--r-full);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s;
          white-space: nowrap;
          margin-left: var(--sp-4);
          flex-shrink: 0;
          box-shadow: 0 4px 18px rgba(14,110,184,0.38);
        }
        .hs-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14,110,184,0.48);
        }

        /* ─── PACKAGES GRID ─── */
        .pkg-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--sp-8);
          flex-wrap: wrap;
          gap: var(--sp-4);
        }
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--sp-6);
        }
        .hero-packages .pkg-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--sp-5);
        }
        .error-state { text-align: center; padding: var(--sp-12); color: var(--gray-500); }
        .error-state h3 { color: var(--gray-700); margin-bottom: var(--sp-2); }

        /* ─── MOUNTAIN EDITORIAL ─── */
        .mountain-section {
          position: relative;
          padding: var(--sp-24) var(--sp-6);
          overflow: hidden;
        }
        .mountain-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop')
            center / cover no-repeat;
          z-index: 0;
        }
        .mountain-overlay {
          position: absolute;
          inset: 0;
          background: rgba(248,250,252,0.88);
          z-index: 1;
        }
        .mountain-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
        }

        /* ─── DESTINATION EDITORIAL GRID ─── */
        .dest-section {
          position: relative;
          background: #ffffff;
          padding: var(--sp-20) 0;
          overflow: hidden;
        }
        .dest-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop') center / cover no-repeat;
          opacity: 0.05;
          z-index: 0;
          filter: grayscale(100%);
        }
        .dest-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 80%, rgba(255,255,255,1) 100%);
          z-index: 1;
        }
        .dest-section .container {
          position: relative;
          z-index: 2;
        }
        .dest-editorial-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 280px 280px;
          gap: var(--sp-4);
        }
        .dest-card-big {
          grid-column: span 2;
          grid-row: span 2;
        }
        .dest-card-ed {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          cursor: pointer;
        }
        .dest-card-ed img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease);
          display: block;
        }
        .dest-card-ed:hover img { transform: scale(1.07); }
        .dest-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,15,30,0.82) 0%, transparent 55%);
          transition: all 0.4s;
        }
        .dest-card-ed:hover .dest-card-overlay {
          background: linear-gradient(to top, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.25) 60%);
        }
        .dest-card-info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: var(--sp-5);
          color: #fff;
        }
        .dest-card-tag {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2dd4bf;
          margin-bottom: 4px;
        }
        .dest-card-name { font-size: 1.3rem; font-weight: 700; margin-bottom: 4px; }
        .dest-card-big .dest-card-name { font-size: 1.9rem; }
        .dest-card-pkgs { font-size: 0.78rem; color: rgba(255,255,255,0.62); }
        .dest-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: var(--sp-2);
          font-size: 0.78rem;
          font-weight: 600;
          color: #2dd4bf;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.3s;
        }
        .dest-card-ed:hover .dest-card-cta { opacity: 1; transform: translateY(0); }

        /* ─── CATEGORIES ─── */
        .cat-section {
          position: relative;
          background: var(--off-white);
          padding: var(--sp-20) 0;
          overflow: hidden;
        }
        .cat-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://www.transparenttextures.com/patterns/cubes.png');
          opacity: 0.2;
          z-index: 0;
        }
        .cat-section .container {
          position: relative;
          z-index: 2;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--sp-4);
        }
        .cat-card {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          cursor: pointer;
          height: 210px;
          transition: transform 0.3s var(--ease);
        }
        .cat-card:hover { transform: translateY(-5px); }
        .cat-card img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s var(--ease);
          display: block;
        }
        .cat-card:hover img { transform: scale(1.09); }
        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,18,40,0.82) 0%, rgba(10,18,40,0.28) 100%);
        }
        .cat-body {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          gap: var(--sp-2);
          text-align: center;
        }
        .cat-icon { font-size: 2.1rem; }
        .cat-label { font-size: 1rem; font-weight: 700; }

        /* ─── BEACH EDITORIAL ─── */
        .beach-section {
          background: #fff;
          padding: var(--sp-24) 0;
        }
        .beach-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 var(--sp-6);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-16);
          align-items: center;
        }
        .beach-img-wrap {
          position: relative;
          border-radius: var(--r-xl);
          overflow: hidden;
          height: 500px;
          box-shadow: 0 32px 80px rgba(10,20,40,0.18);
          flex-shrink: 0;
        }
        .beach-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .beach-float-badge {
          position: absolute;
          bottom: var(--sp-6);
          left: var(--sp-6);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-radius: var(--r-lg);
          padding: var(--sp-4) var(--sp-5);
          box-shadow: 0 8px 32px rgba(10,20,40,0.12);
        }
        .fb-val { font-size: 1.5rem; font-weight: 900; color: var(--navy); line-height: 1; }
        .fb-lbl { font-size: 0.75rem; color: var(--gray-500); margin-top: 2px; }
        .beach-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-3);
          margin-bottom: var(--sp-8);
        }
        .beach-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.45rem 1rem;
          background: var(--off-white);
          border-radius: var(--r-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--navy);
        }

        /* ─── WHY US ─── */
        .why-section {
          background: #fff;
          padding: var(--sp-20) 0;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--sp-6);
        }
        .why-card {
          padding: var(--sp-6);
          border: 1px solid var(--gray-100);
          border-radius: var(--r-lg);
          transition: all 0.3s;
        }
        .why-card:hover {
          border-color: var(--teal-light);
          box-shadow: 0 8px 32px rgba(13,148,136,0.08);
          transform: translateY(-3px);
        }
        .why-icon {
          width: 52px; height: 52px;
          border-radius: var(--r-md);
          background: linear-gradient(135deg, rgba(14,110,184,0.08), rgba(13,148,136,0.08));
          display: flex; align-items: center; justify-content: center;
          color: var(--teal);
          margin-bottom: var(--sp-4);
        }
        .why-title { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: var(--sp-2); }
        .why-desc { font-size: 0.88rem; color: var(--gray-500); line-height: 1.65; }

        /* ─── STATS BAND ─── */
        .stats-band {
          padding: var(--sp-16) 0;
          background: linear-gradient(135deg, var(--navy) 0%, #163a70 50%, var(--navy-light) 100%);
        }
        .stats-band-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--sp-8);
          text-align: center;
        }
        .sb-value {
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: var(--sp-2);
          background: linear-gradient(135deg, var(--gold-light), #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sb-label { font-size: 0.88rem; color: rgba(255,255,255,0.6); font-weight: 500; }

        /* ─── OFFER ─── */
        .offer-section {
          position: relative;
          padding: var(--sp-24) var(--sp-6);
          overflow: hidden;
        }
        .offer-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2000&auto=format&fit=crop')
            center / cover no-repeat;
          z-index: 0;
        }
        .offer-overlay-div {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,20,40,0.92), rgba(14,90,160,0.78));
          z-index: 1;
        }
        .offer-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          max-width: 700px;
          margin: 0 auto;
        }
        .offer-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: var(--sp-4);
        }
        .offer-desc {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          margin-bottom: var(--sp-8);
          line-height: 1.75;
        }
        .offer-btns { display: flex; gap: var(--sp-4); justify-content: center; flex-wrap: wrap; }

        /* ─── TESTIMONIALS (GOOGLE MY BUSINESS STYLE) ─── */
        .testimonials-section {
          position: relative;
          background: #f8fafc;
          padding: var(--sp-20) 0;
          overflow: hidden;
        }
        .testimonials-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2000&auto=format&fit=crop') center / cover no-repeat;
          opacity: 0.04;
          z-index: 0;
        }
        .testimonials-section .container { position: relative; z-index: 2; }

        .google-rating-summary-banner {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 32px;
          margin: 0 auto var(--sp-8);
          max-width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .gr-summary-main {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }
        .gr-google-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gr-brand-name {
          font-weight: 800;
          font-size: 1.05rem;
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .gr-verified-pill {
          font-size: 0.76rem;
          color: #059669;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .gr-score-block {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 24px;
          border-left: 1px solid #e2e8f0;
        }
        .gr-score-number {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .gr-stars-row {
          display: flex;
          gap: 2px;
          margin-bottom: 3px;
        }
        .gr-reviews-count {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* ─── IN-LINE MOVING LEFT-TO-RIGHT MARQUEE ─── */
        .tc-marquee-container {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          padding: 8px 0 20px 0;
          mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
        }
        .tc-marquee-track {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 22px;
          width: max-content;
          animation: marqueeLeftToRight 65s linear infinite;
          will-change: transform;
        }
        .tc-marquee-track:hover {
          animation-play-state: paused !important;
        }
        @keyframes marqueeLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .tc-card {
          width: 360px;
          min-width: 360px;
          max-width: 360px;
          flex-shrink: 0;
          background: #fff;
          border-radius: 16px;
          padding: 22px 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #eef2f6;
          display: flex;
          flex-direction: column;
          user-select: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .tc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.09);
        }
        @media (max-width: 640px) {
          .tc-card {
            width: 300px;
            min-width: 300px;
            max-width: 300px;
            padding: 18px 16px;
          }
        }
        .tc-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .tc-user-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tc-avatar-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }
        .tc-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f1f5f9;
        }
        .tc-google-avatar-badge {
          position: absolute;
          bottom: -2px;
          right: -3px;
          background: #fff;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .tc-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.96rem;
        }
        .tc-reviewer-badge {
          font-size: 0.74rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .tc-guide-star {
          color: #f97316;
          font-weight: 800;
        }
        .tc-google-source-tag {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tc-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .tc-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .tc-time-ago {
          font-size: 0.74rem;
          color: #94a3b8;
        }
        .tc-dest-tag {
          background: rgba(13,148,136,0.08);
          color: #0f766e;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 9px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
          align-self: flex-start;
        }
        .tc-review {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.65;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .tc-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }
        .tc-verified-label {
          font-size: 0.74rem;
          color: #059669;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tc-helpful-btn {
          font-size: 0.74rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f8fafc;
          padding: 3px 8px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }
        @media (max-width: 768px) {
          .google-rating-summary-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .gr-score-block {
            border-left: none;
            padding-left: 0;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            width: 100%;
          }
        }

        /* ─── FINAL CTA ─── */
        .final-cta { background: #fff; padding: var(--sp-20) 0; text-align: center; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1100px) {
          .hero-packages .pkg-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dest-editorial-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .dest-card-big { grid-column: span 2; grid-row: span 1; min-height: 340px; }
          .dest-card-ed { min-height: 260px; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .hero-packages .pkg-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .beach-inner { grid-template-columns: 1fr; gap: var(--sp-10); }
          .beach-img-wrap { height: 360px; }
          .stats-band-grid { grid-template-columns: repeat(2, 1fr); gap: var(--sp-8) var(--sp-12); }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .dest-editorial-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-section {
            min-height: auto;
            overflow: visible;
            width: 100%;
          }
          .hero-section.hero-open {
            min-height: auto;
          }
          .hero-scene {
            width: 100%;
            min-height: 430px;
            min-height: 54svh;
          }
          .hero-body,
          .hero-body-wide { padding: 104px var(--sp-4) 68px; }
          .hero-badge {
            padding: 0.4rem 1.05rem;
            font-size: 0.72rem;
            letter-spacing: 0.055em;
            margin-bottom: var(--sp-4);
            white-space: nowrap;
            max-width: calc(100vw - 24px);
          }
          .hero-h1 {
            font-size: clamp(2.05rem, 9.2vw, 2.85rem);
            line-height: 1.14;
            margin-bottom: var(--sp-3);
            min-height: 6.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .featured-packages-section {
            padding: 50px 0 65px;
          }
          .pkg-header { 
            flex-direction: column; 
            align-items: center;
            text-align: center;
            margin-bottom: var(--sp-4);
            gap: var(--sp-2);
            width: 100%;
          }
          .pkg-header .btn {
            padding: 0.55rem 1.25rem;
            font-size: 0.85rem;
          }
          .pkg-marquee-track .pkg-card {
            width: 290px;
            min-width: 290px;
            max-width: 290px;
            height: 440px;
            min-height: 440px;
          }
          .hs-form { 
            flex-direction: column; 
            padding: var(--sp-5); 
            gap: 0; 
            align-items: center; 
            text-align: center;
          }
          .hs-field { 
            width: 100%;
            padding: var(--sp-3) 0 !important; 
            border-bottom: 1px solid var(--gray-100); 
            align-items: center;
            text-align: center;
          }
          .hs-field:first-child { 
            padding-top: 0 !important; 
          }
          .hs-label { 
            justify-content: center; 
            text-align: center; 
            width: 100%; 
          }
          .hs-input { 
            text-align: center; 
            text-align-last: center; 
            -webkit-text-align-last: center; 
            -moz-text-align-last: center;
            width: 100%; 
          }
          .hs-input::placeholder { 
            text-align: center; 
          }
          .hs-input option {
            text-align: center;
          }
          .hs-sep { display: none; }
          .hs-btn { 
            width: 100%; 
            justify-content: center; 
            align-items: center;
            text-align: center;
            margin-left: 0; 
            margin-top: var(--sp-4); 
          }
          .search-panel-wrap { margin-top: -24px; padding: 0 var(--sp-4); }
          .pkg-grid { grid-template-columns: 1fr; width: 100%; }
          .dest-editorial-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
          .dest-card-big { grid-column: span 1; min-height: 260px; }
          .dest-card-ed { min-height: 220px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .hero-section {
            min-height: auto;
            overflow: visible;
          }
          .hero-scene {
            min-height: 390px;
            min-height: 50svh;
          }
          .hero-body,
          .hero-body-wide { padding: 94px var(--sp-3) 60px; }
          .hero-badge {
            padding: 0.36rem 0.9rem;
            font-size: clamp(0.62rem, 2.7vw, 0.72rem);
            letter-spacing: 0.04em;
            gap: 6px;
            margin-bottom: var(--sp-3);
          }
          .hero-h1 {
            font-size: clamp(1.9rem, 8.6vw, 2.35rem);
            line-height: 1.14;
            margin-bottom: var(--sp-2);
            min-height: 5.6rem;
          }
          .featured-packages-section {
            padding: 40px 0 55px;
          }
          .pkg-marquee-track {
            gap: 16px;
            animation-duration: 40s;
          }
          .pkg-marquee-track .pkg-card {
            width: 275px;
            min-width: 275px;
            max-width: 275px;
            height: 420px;
            min-height: 420px;
          }
          .pkg-header .btn {
            width: 100%;
            justify-content: center;
          }
          .stats-band-grid { grid-template-columns: repeat(2, 1fr); }
          .beach-img-wrap { height: 240px; }
          .offer-btns { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ══ HERO SECTION: clean, elegant cycling slogan slideshow ══ */}
      <section className="hero-section">
        <div className="hero-scene">
          {/* Deep Background Layer */}
          <div className="hero-bg" />
          {/* Atmosphere & Lighting Layer */}
          <div className="hero-overlay" />

          <div className="hero-body-wide">
            <div className="hero-badge">
              ✈️ &nbsp; Premium Travel Experiences Since 2002
            </div>

            <TypedHeadline count={typed} slogan={currentSlogan} />
          </div>
        </div>
      </section>

      {/* ══ SEARCH PANEL ══ */}
      <div className="search-panel-wrap">
        <div className="search-panel-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <HeroSearch />
          </motion.div>
        </div>
      </div>

      {/* ══ FEATURED TOUR PACKAGES (LEFT-TO-RIGHT MOVING MARQUEE) ══ */}
      <section className="featured-packages-section">
        <div className="container">
          <div className="pkg-header">
            <div className="section-eyebrow">
              <Sparkles size={14} /> Our Top Picks
            </div>
            <h2 className="section-title">
              Explore Our Most <span>Loved Journeys</span>
            </h2>
            <p className="section-subtitle">
              Handcrafted tour packages across Karnataka and South India with sanitized private cabs, top-rated drivers, and custom itineraries.
            </p>
            <div className="pkg-header-actions">
              <Link to="/packages" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
                View All Packages <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="pkg-marquee-container">
            {pkgLoading ? (
              <div style={{ display: 'flex', gap: 24, padding: '0 20px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: 340, height: 470, borderRadius: '16px', flexShrink: 0 }} />
                ))}
              </div>
            ) : pkgError ? (
              <div className="error-state">
                <h3>Unable to load packages</h3>
                <p>{pkgError}</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="error-state">
                <h3>No featured packages yet</h3>
                <p>Check back soon, or browse all packages.</p>
              </div>
            ) : (
              <div className="pkg-marquee-track">
                {marqueePackages.map((pkg, i) => (
                  <PackageCard key={`${pkg.id}-${i}`} pkg={pkg} index={i} staggerSlideshow={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CUSTOMER REVIEWS (GOOGLE MY BUSINESS) ══ */}
      {(testLoading || testimonials.length > 0) && (
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header centered" style={{ marginBottom: 'var(--sp-6)' }}>
              <FadeUp>
                <div className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <GoogleIcon size={14} /> Google Verified Reviews
                </div>
                <h2 className="section-title">
                  Stories From Our <span>Travellers</span>
                </h2>
              </FadeUp>
            </div>

            {/* Google Rating Overview Banner */}
            <FadeUp delay={0.05}>
              <div className="google-rating-summary-banner">
                <div className="gr-summary-main">
                  <div className="gr-google-badge">
                    <GoogleIcon size={34} />
                    <div>
                      <div className="gr-brand-name">Google My Business</div>
                      <div className="gr-verified-pill">
                        <CheckCircle2 size={12} color="#059669" /> Verified Business Profile
                      </div>
                    </div>
                  </div>

                  <div className="gr-score-block">
                    <span className="gr-score-number">4.9</span>
                    <div>
                      <div className="gr-stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#fbbc04" color="#fbbc04" />
                        ))}
                      </div>
                      <div className="gr-reviews-count">
                        Based on <strong>930+ verified reviews</strong> across Karnataka tours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* In-Line Horizontal Moving Reviews Track */}
            <div className="tc-marquee-container">
              {testLoading ? (
                <div style={{ display: 'flex', gap: 22, padding: '0 20px' }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ width: 360, height: 260, borderRadius: '16px', flexShrink: 0 }} />
                  ))}
                </div>
              ) : (
                <div className="tc-marquee-track">
                  {marqueeReviews.map((t, i) => (
                    <TestimonialCard key={`${t.id}-${i}`} t={t} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══ DESTINATION EDITORIAL GRID ══ */}
      <section className="dest-section">
        <div className="container">
          <div className="section-header centered" style={{ marginBottom: 'var(--sp-10)' }}>
            <FadeUp>
              <div className="section-eyebrow">Journey Beyond Borders</div>
              <h2 className="section-title">
                Where Will You <span>Go Next?</span>
              </h2>
              <p className="section-subtitle" style={{ margin: 'var(--sp-4) auto 0' }}>
                From Himalayan peaks to tropical shores — discover India's finest
                spots and international gems.
              </p>
            </FadeUp>
          </div>

          {destLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--sp-4)' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--r-lg)' }} />
              ))}
            </div>
          ) : (
            <div className="dest-editorial-grid">
              {displayDests.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  className={`dest-card-ed${i === 0 ? ' dest-card-big' : ''}`}
                  onClick={() => navigate(
                    `/packages?destination=${encodeURIComponent(dest.name)}&destinationId=${encodeURIComponent(dest.id)}`
                  )}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <img src={dest.image} alt={dest.name} loading={i === 0 ? 'eager' : 'lazy'} />
                  <div className="dest-card-overlay" />
                  <div className="dest-card-info">
                    <div className="dest-card-tag">{dest.category} · {dest.country}</div>
                    <div className="dest-card-name">{dest.name}</div>
                    <div className="dest-card-pkgs">{dest.packageCount} packages available</div>
                    <div className="dest-card-cta">Explore <ArrowRight size={11} /></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-10)' }}>
            <Link to="/destinations" className="btn btn-outline-dark btn-lg">
              View All Destinations <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRAVEL CATEGORIES ══ */}
      <section className="cat-section">
        <div className="container">
          <div className="section-header centered" style={{ marginBottom: 'var(--sp-10)' }}>
            <FadeUp>
              <div className="section-eyebrow">Travel Your Way</div>
              <h2 className="section-title">
                What Kind of Journey<br /><span>Are You Looking For?</span>
              </h2>
            </FadeUp>
          </div>
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.value}
                className="cat-card"
                onClick={() => navigate(`/packages?category=${cat.value}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <img
                  src={cat.img}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/mysore-palace-tour.jpg';
                  }}
                />
                <div className="cat-overlay" />
                <div className="cat-body">
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BEACH EDITORIAL ══ */}
      <section className="beach-section">
        <div className="beach-inner">
          <FadeUp>
            <div className="beach-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=900&auto=format&fit=crop"
                alt="Tropical beach paradise"
                loading="lazy"
              />
              <div className="beach-float-badge">
                <div className="fb-val">4.9★</div>
                <div className="fb-lbl">Avg. Beach Trip Rating</div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div>
              <div className="section-eyebrow">Beach Holidays</div>
              <h2 className="section-title" style={{ marginBottom: 'var(--sp-5)' }}>
                Find Your Way<br /><span>To Paradise</span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 'var(--sp-6)' }}>
                Relax on pristine beaches, explore tropical islands, and create
                unforgettable memories. Goa, Kerala, Maldives, Bali — paradise
                is closer than you think.
              </p>
              <div className="beach-tags">
                {[
                  { emoji: '🌊', label: 'Goa Getaways' },
                  { emoji: '🏝️', label: 'Maldives Escapes' },
                  { emoji: '🌴', label: 'Kerala Backwaters' },
                  { emoji: '🏄', label: 'Bali Adventures' },
                ].map(item => (
                  <div key={item.label} className="beach-tag">
                    {item.emoji} {item.label}
                  </div>
                ))}
              </div>
              <Link to="/packages?category=Beach Holidays" className="btn btn-primary btn-lg">
                Explore Beach Holidays <ArrowRight size={18} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ WHY V-RAJ HOLIDAYS ══ */}
      <section className="why-section">
        <div className="container">
          <div className="section-header centered" style={{ marginBottom: 'var(--sp-12)' }}>
            <FadeUp>
              <div className="section-eyebrow">Why Travel With Us</div>
              <h2 className="section-title">
                The <span>V-RAJ Holidays</span> Difference
              </h2>
              <p className="section-subtitle" style={{ margin: 'var(--sp-4) auto 0' }}>
                We go beyond booking tickets. We craft experiences that stay with you forever.
              </p>
            </FadeUp>
          </div>
          <div className="why-grid">
            {whyUs.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.07}>
                <div className="why-card">
                  <div className="why-icon">{item.icon}</div>
                  <div className="why-title">{item.title}</div>
                  <div className="why-desc">{item.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAND ══ */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-band-grid">
            {[
              { end: 20,   suffix: '+', label: 'Years of Experience'  },
              { end: 5000, suffix: '+', label: 'Happy Travellers'     },
              { end: 100,  suffix: '+', label: 'Destinations Covered' },
              { end: 50,   suffix: '+', label: 'Curated Packages'     },
            ].map(stat => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="sb-value"><Counter end={stat.end} suffix={stat.suffix} /></div>
                <div className="sb-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OFFER SECTION ══ */}
      <section className="offer-section">
        <div className="offer-bg" />
        <div className="offer-overlay-div" />
        <div className="offer-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-eyebrow" style={{
              justifyContent: 'center', color: 'var(--teal-light)', marginBottom: 'var(--sp-5)'
            }}>
              Limited Time Offer
            </div>
            <h2 className="offer-title">
              Your Dream Destination Is<br />Closer Than You Think
            </h2>
            <p className="offer-desc">
              Unlock exclusive customized travel packages tailored specifically
              to your preferences, group size, and schedule.
            </p>
            <div className="offer-btns">
              <Link to="/packages" className="btn btn-primary btn-lg">
                Explore Special Offers
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="final-cta" style={{ position: 'relative', padding: 'var(--sp-24) 0', background: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat', opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.7) 50%, #fff 100%)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
              Your Next Adventure
            </div>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--sp-4)' }}>
              Where Will Your<br /><span>Story Take You?</span>
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--sp-8)' }}>
              Let's turn your travel dreams into your next unforgettable journey.
              Our experts are ready to craft the perfect trip.
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/packages" className="btn btn-primary btn-lg">
                Explore Packages <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline-dark btn-lg">
                Talk To A Travel Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;