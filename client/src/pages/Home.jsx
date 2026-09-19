import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, MapPin, Compass, Clock, Star, ArrowRight,
  CheckCircle2, Award, Globe, Zap, Shield, MessageSquare
} from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { getFeaturedPackages, getDestinations, getTestimonials } from '../services/api';

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
        <label className="hs-label"><Compass size={13} /> Travel Type</label>
        <select className="hs-input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Honeymoon">Honeymoon</option>
          <option value="Family Tours">Family Tours</option>
          <option value="Adventure">Adventure</option>
          <option value="Beach Holidays">Beach Holidays</option>
          <option value="International Tours">International Tours</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>
      <div className="hs-sep" />
      <div className="hs-field">
        <label className="hs-label"><Clock size={13} /> Duration</label>
        <select className="hs-input" value={duration} onChange={e => setDuration(e.target.value)}>
          <option value="">Any Duration</option>
          <option value="1-3">1-3 Days</option>
          <option value="4-7">4-7 Days</option>
          <option value="8+">8+ Days</option>
        </select>
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
    <div className="tc-header">
      <img
        src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0e6eb8&color=fff`}
        alt={t.name}
        className="tc-avatar"
      />
      <div>
        <div className="tc-name">{t.name}</div>
        <div className="tc-dest">{t.destination}</div>
      </div>
    </div>
    <div className="tc-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i} size={13}
          fill={i < Math.round(t.rating) ? 'var(--gold)' : 'none'}
          color={i < Math.round(t.rating) ? 'var(--gold)' : 'var(--gray-300)'}
        />
      ))}
      <span className="tc-rating-txt">{t.rating}</span>
    </div>
    <p className="tc-review">"{t.review}"</p>
  </div>
);

/* ─────────────────────────────────────────
   TYPING INTRO
   Tweak the timings here.
───────────────────────────────────────── */
const LINE_1 = 'Discover The World.';
const LINE_2 = 'Create Stories Worth Remembering.';
const TYPE_START_MS  = 700;   // wait before the first letter
const TYPE_SPEED_MS  = 55;    // base delay between letters
const LINE_PAUSE_MS  = 450;   // pause after the first line
const HOLD_MS        = 1300;  // how long the finished text stays on screen

const TypedLine = ({ text, count, cursor }) => (
  <>
    <span>{text.slice(0, count)}</span>
    {cursor && <span className="type-cursor" aria-hidden="true" />}
    {/* untyped letters stay in the layout (invisible) so nothing jumps */}
    <span style={{ visibility: 'hidden' }}>{text.slice(count)}</span>
  </>
);

const TypedHeadline = ({ count }) => {
  const n1 = Math.min(count, LINE_1.length);
  const n2 = Math.max(0, count - LINE_1.length);
  const onLine1 = count <= LINE_1.length;
  return (
    <h1 className="hero-h1" aria-label={`${LINE_1} ${LINE_2}`}>
      <span aria-hidden="true">
        <TypedLine text={LINE_1} count={n1} cursor={onLine1} />
        <em><TypedLine text={LINE_2} count={n2} cursor={!onLine1} /></em>
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

  // Intro: type the headline, hold, fade out, then show the packages in the same spot.
  const [phase, setPhase] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ? 'packages'
      : 'intro'
  );
  const [typed, setTyped] = useState(0);
  const totalChars = LINE_1.length + LINE_2.length;

  useEffect(() => {
    if (phase !== 'intro') return;
    let i = 0;
    let timer;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i >= totalChars) {
        timer = setTimeout(() => setPhase('packages'), HOLD_MS);
        return;
      }
      const delay = i === LINE_1.length
        ? LINE_PAUSE_MS
        : TYPE_SPEED_MS + Math.random() * 35;
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, TYPE_START_MS);
    return () => clearTimeout(timer);
  }, [phase, totalChars]);

  // No scrolling while the intro plays, so the layout doesn't shift under the visitor.
  useEffect(() => {
    if (phase !== 'intro') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

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
    { icon: '\u2764\uFE0F', label: 'Honeymoon',      value: 'Honeymoon',          img: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?q=80&w=500' },
    { icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67', label: 'Family', value: 'Family Tours', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?q=80&w=500' },
    { icon: '\uD83C\uDFD4', label: 'Adventure',     value: 'Adventure',          img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=500' },
    { icon: '\uD83C\uDFD6', label: 'Beach',         value: 'Beach Holidays',     img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500' },
    { icon: '\uD83C\uDF0E', label: 'International', value: 'International Tours', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500' },
    { icon: '\u2728',       label: 'Luxury',        value: 'Luxury',             img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500' },
    { icon: '\uD83D\uDE97', label: 'Weekend',       value: 'Weekend',            img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=500' },
    { icon: '\uD83D\uDC65', label: 'Group Tours',   value: 'Group',              img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=500' },
  ];

  const whyUs = [
    { icon: <Award size={26} />,         title: 'Best Price Guarantee',   desc: 'We match any lower price and never compromise on quality.' },
    { icon: <CheckCircle2 size={26} />,  title: 'Handpicked Experiences', desc: 'Every destination and stay is personally vetted by our team.' },
    { icon: <MessageSquare size={26} />, title: '24/7 Expert Support',    desc: 'Our travel experts are always available whenever you need them.' },
    { icon: <Zap size={26} />,           title: 'Customised Itineraries', desc: 'Trips designed around your preferences, pace, and budget.' },
    { icon: <Shield size={26} />,        title: 'Trusted & Reliable',     desc: 'Over 5000+ satisfied travellers trust Viraj Travels every year.' },
    { icon: <Globe size={26} />,         title: '100+ Destinations',      desc: 'Domestic and international destinations for every kind of traveller.' },
  ];

  const staticDestinations = [
    { id: 's1', name: 'Kashmir',  country: 'India',     category: 'Mountains', packageCount: 8,  image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=700' },
    { id: 's2', name: 'Goa',      country: 'India',     category: 'Beach',     packageCount: 12, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=700' },
    { id: 's3', name: 'Kerala',   country: 'India',     category: 'Backwaters',packageCount: 10, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=700' },
    { id: 's4', name: 'Manali',   country: 'India',     category: 'Adventure', packageCount: 6,  image: 'https://images.unsplash.com/photo-1598977123118-4e30ba8a6b24?q=80&w=700' },
    { id: 's5', name: 'Dubai',    country: 'UAE',       category: 'Luxury',    packageCount: 9,  image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=700' },
    { id: 's6', name: 'Bali',     country: 'Indonesia', category: 'Tropical',  packageCount: 7,  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=700' },
  ];
  const displayDests = destinations.length > 0 ? destinations.slice(0, 6) : staticDestinations;

  return (
    <div className="home-page">
      <style>{`
        /* ─── HERO (typing intro, then packages) ─── */
        .hero-section {
          position: relative;
          min-height: calc(100vh - 60px);
          min-height: calc(100svh - 60px);
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=85&w=2000&auto=format&fit=crop')
            center / cover no-repeat;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,20,40,0.88) 0%,
            rgba(10,20,40,0.65) 45%,
            rgba(12,80,140,0.40) 100%
          );
          z-index: 1;
        }
        /* extra darkening once the packages are showing, so the text stays readable */
        .hero-overlay-dark {
          position: absolute;
          inset: 0;
          background: rgba(10,20,40,0.55);
          z-index: 1;
          opacity: 0;
          transition: opacity 0.9s ease;
        }
        .hero-open .hero-overlay-dark { opacity: 1; }
        .hero-body {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px var(--sp-6) 64px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.22);
          padding: 0.38rem 1rem;
          border-radius: var(--r-full);
          font-size: 0.78rem;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: var(--sp-6);
        }
        .hero-h1 {
          font-family: 'Playfair Display', var(--font-serif);
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: var(--sp-5);
        }
        .hero-h1 em {
          font-style: italic;
          color: #5ce8db;
          display: block;
          margin-top: 0.1em;
        }
        .type-cursor {
          display: inline-block;
          width: 0;
          position: relative;
        }
        .type-cursor::after {
          content: '';
          position: absolute;
          left: 0.05em;
          bottom: -0.12em;
          width: 0.055em;
          height: 0.95em;
          background: currentColor;
          animation: type-blink 0.9s steps(1) infinite;
        }
        @keyframes type-blink { 50% { opacity: 0; } }
        .hero-desc {
          font-size: clamp(0.98rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,0.78);
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto;
        }

        /* packages shown inside the hero */
        .hero-packages {
          position: relative;
          z-index: 10;
          padding-top: 112px;
          padding-bottom: 112px;
        }
        .hero-packages .section-eyebrow { color: #5ce8db; }
        .hero-packages .section-eyebrow::before { background: #5ce8db; }
        .hero-packages .section-title {
          color: #fff;
          font-size: clamp(1.8rem, 3.4vw, 2.7rem);
        }
        .hero-packages .section-title span { color: #5ce8db; }
        .hero-packages .section-subtitle { color: rgba(255,255,255,0.75); }
        .hero-packages .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 75%);
          background-size: 800px 100%;
        }
        .hero-packages .error-state,
        .hero-packages .error-state h3 { color: rgba(255,255,255,0.85); }

        /* ─── SEARCH PANEL ─── */
        .search-panel-wrap {
          position: relative;
          z-index: 20;
          padding: 0 var(--sp-6);
          margin-top: -50px;
          margin-bottom: var(--sp-4);
        }
        .search-panel-inner {
          max-width: 1040px;
          margin: 0 auto;
        }
        .hs-form {
          background: #fff;
          border-radius: var(--r-xl);
          box-shadow: 0 24px 64px rgba(10,20,40,0.22);
          border: 1px solid var(--gray-100);
          padding: var(--sp-5) var(--sp-6);
          display: flex;
          align-items: flex-end;
          gap: 0;
        }
        .hs-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
          padding: 0 var(--sp-5);
          min-width: 0;
        }
        .hs-field:first-child { padding-left: 0; }
        .hs-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .hs-input {
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: var(--navy);
          font-weight: 500;
          padding: 0.2rem 0;
          width: 100%;
        }
        .hs-input:focus { outline: none; }
        .hs-input::placeholder { color: var(--gray-400); font-weight: 400; }
        .hs-sep {
          width: 1px;
          height: 36px;
          background: var(--gray-200);
          flex-shrink: 0;
          align-self: flex-end;
          margin-bottom: 6px;
        }
        .hs-btn {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 0.85rem 1.75rem;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          color: #fff;
          border: none;
          border-radius: var(--r-lg);
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
          color: #5ce8db;
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
          color: #5ce8db;
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

        /* ─── TESTIMONIALS ─── */
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
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: var(--sp-5);
        }
        .tc-card {
          background: #fff;
          border-radius: var(--r-lg);
          padding: var(--sp-6);
          box-shadow: var(--shadow-card);
          transition: box-shadow 0.3s;
        }
        .tc-card:hover { box-shadow: var(--shadow-card-hover); }
        .tc-header { display: flex; align-items: center; gap: var(--sp-4); margin-bottom: var(--sp-4); }
        .tc-avatar {
          width: 50px; height: 50px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--teal-light); flex-shrink: 0;
        }
        .tc-name { font-weight: 700; color: var(--navy); }
        .tc-dest { font-size: 0.8rem; color: var(--teal); }
        .tc-stars { display: flex; align-items: center; gap: 3px; margin-bottom: var(--sp-3); }
        .tc-rating-txt { font-size: 0.78rem; color: var(--gray-500); margin-left: 4px; }
        .tc-review { font-size: 0.9rem; color: var(--gray-600); line-height: 1.7; font-style: italic; }

        /* ─── FINAL CTA ─── */
        .final-cta { background: #fff; padding: var(--sp-20) 0; text-align: center; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1100px) {
          .dest-editorial-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .dest-card-big { grid-column: span 2; grid-row: span 1; min-height: 340px; }
          .dest-card-ed { min-height: 260px; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .beach-inner { grid-template-columns: 1fr; gap: var(--sp-10); }
          .beach-img-wrap { height: 360px; }
          .stats-band-grid { grid-template-columns: repeat(2, 1fr); gap: var(--sp-8) var(--sp-12); }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .dest-editorial-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-body { padding: 96px var(--sp-4) 48px; }
          .hs-form { flex-direction: column; padding: var(--sp-5); gap: 0; }
          .hs-field { padding: 0; padding-bottom: var(--sp-3); border-bottom: 1px solid var(--gray-100); }
          .hs-sep { display: none; }
          .hs-btn { width: 100%; justify-content: center; margin-left: 0; margin-top: var(--sp-4); }
          .search-panel-wrap { margin-top: -30px; }
          .pkg-grid { grid-template-columns: 1fr; }
          .dest-editorial-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
          .dest-card-big { grid-column: span 1; min-height: 260px; }
          .dest-card-ed { min-height: 220px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .why-grid { grid-template-columns: 1fr; }
          .pkg-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .stats-band-grid { grid-template-columns: repeat(2, 1fr); }
          .beach-img-wrap { height: 260px; }
          .offer-btns { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ══ HERO: typing intro, then the packages appear in the same spot ══ */}
      <section className={`hero-section${phase === 'packages' ? ' hero-open' : ''}`}>
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-overlay-dark" />

        <AnimatePresence mode="wait">
          {phase === 'intro' ? (
            <motion.div
              key="intro"
              className="hero-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-badge">
                ✈️ &nbsp; Premium Travel Experiences Since 2015
              </div>

              <TypedHeadline count={typed} />

              <p className="hero-desc">
                Handpicked destinations, unforgettable experiences, and journeys
                designed uniquely around you.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="packages"
              className="container hero-packages"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pkg-header">
                <div>
                  <div className="section-eyebrow">Our Top Picks</div>
                  <h2 className="section-title">
                    Explore Our Most <span>Loved Journeys</span>
                  </h2>
                  <p className="section-subtitle" style={{ marginTop: 'var(--sp-3)', maxWidth: 460 }}>
                    Handpicked experiences designed to turn your next holiday into
                    a story worth remembering.
                  </p>
                </div>
                <Link to="/packages" className="btn btn-outline">
                  View All Packages <ArrowRight size={16} />
                </Link>
              </div>

              {pkgLoading ? (
                <div className="pkg-grid">
                  {Array.from({ length: 6 }).map((_, i) => <PackageSkeleton key={i} />)}
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
                <div className="pkg-grid">
                  {packages.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* ══ CUSTOMER REVIEWS (directly below the packages) ══ */}
      {(testLoading || testimonials.length > 0) && (
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header centered" style={{ marginBottom: 'var(--sp-10)' }}>
              <FadeUp>
                <div className="section-eyebrow">Traveller Stories</div>
                <h2 className="section-title">
                  Stories From Our <span>Travellers</span>
                </h2>
              </FadeUp>
            </div>
            <div className="testimonials-grid">
              {testLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--r-lg)' }} />
                  ))
                : testimonials.slice(0, 6).map((t, i) => (
                    <FadeUp key={t.id} delay={i * 0.08}>
                      <TestimonialCard t={t} />
                    </FadeUp>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ MOUNTAIN EDITORIAL ══ */}
      <section className="mountain-section">
        <div className="mountain-bg" />
        <div className="mountain-overlay" />
        <div className="mountain-content">
          <FadeUp>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
              Mountain Escapes
            </div>
            <h2 className="section-title" style={{ marginBottom: 'var(--sp-5)' }}>
              Begin Your Next<br /><span>Great Escape</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto var(--sp-8)', textAlign: 'center' }}>
              From peaceful mountain hideaways to thrilling high-altitude adventures,
              discover journeys crafted for every kind of traveller.
            </p>
            <Link to="/packages?category=Adventure" className="btn btn-primary btn-lg">
              Explore Mountain Trips <ArrowRight size={18} />
            </Link>
          </FadeUp>
        </div>
      </section>

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
                    String(dest.id).startsWith('s') ? '/destinations' : `/destinations/${dest.id}`
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
                <img src={cat.img} alt={cat.label} loading="lazy" />
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

      {/* ══ WHY VIRAJ TRAVELS ══ */}
      <section className="why-section">
        <div className="container">
          <div className="section-header centered" style={{ marginBottom: 'var(--sp-12)' }}>
            <FadeUp>
              <div className="section-eyebrow">Why Travel With Us</div>
              <h2 className="section-title">
                The <span>Viraj Travels</span> Difference
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
              { end: 10,   suffix: '+', label: 'Years of Experience'  },
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
              Unlock exclusive travel deals on selected domestic and international
              packages. Prices starting from ₹9,999.
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