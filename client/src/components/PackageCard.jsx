import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PackageCard = ({ pkg, index = 0 }) => {
  const stars = Math.round(pkg.rating);

  return (
    <motion.div
      className="pkg-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: index * 1.0, ease: [0.25, 1, 0.5, 1] }}
      whileHover="hover"
    >
      <style>{`
        .pkg-card {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          cursor: pointer;
          height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .pkg-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .pkg-card:hover .pkg-card-img {
          transform: scale(1.08);
        }
        .pkg-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,15,30,0.96) 0%,
            rgba(10,15,30,0.6) 45%,
            rgba(10,15,30,0.1) 75%,
            transparent 100%
          );
          transition: all 0.4s ease;
        }
        .pkg-card:hover .pkg-card-overlay {
          background: linear-gradient(
            to top,
            rgba(10,15,30,0.98) 0%,
            rgba(10,15,30,0.85) 55%,
            rgba(10,15,30,0.35) 85%,
            rgba(10,15,30,0.1) 100%
          );
        }
        .pkg-card-top {
          position: absolute;
          top: var(--sp-4);
          left: var(--sp-4);
          right: var(--sp-4);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }
        .pkg-featured-badge {
          background: var(--gold);
          color: var(--navy);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.25rem 0.625rem;
          border-radius: var(--r-full);
        }
        .pkg-card-body {
          position: relative;
          z-index: 2;
          padding: var(--sp-5);
          color: white;
        }
        .pkg-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: var(--sp-2);
        }
        .pkg-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-bottom: var(--sp-3);
        }
        .pkg-meta {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          margin-bottom: var(--sp-3);
          font-size: 0.85rem;
          color: rgba(255,255,255,0.8);
        }
        .pkg-meta-item { display: flex; align-items: center; gap: 5px; }
        .pkg-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gold-light);
          margin-bottom: var(--sp-3);
        }
        .pkg-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pkg-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }
        .pkg-price-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
        }

        /* Hover-revealed content */
        .pkg-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.75);
          margin-bottom: var(--sp-4);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkg-cta {
          display: block;
          width: 100%;
          text-align: center;
          padding: 0.7rem;
          background: linear-gradient(135deg, var(--blue), var(--teal));
          color: white;
          border-radius: var(--r-md);
          font-weight: 600;
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }
        .pkg-cta:hover { opacity: 0.9; }
      `}</style>

      <img src={pkg.mainImage} alt={pkg.title} className="pkg-card-img" loading="lazy" />
      <div className="pkg-card-overlay" />

      <div className="pkg-card-top">
        <span className="badge badge-teal" style={{ backdropFilter: 'blur(4px)', background: 'rgba(13,148,136,0.8)' }}>
          {pkg.category}
        </span>
        {pkg.featured && <span className="pkg-featured-badge">⭐ Featured</span>}
      </div>

      <motion.div
        className="pkg-card-body"
        variants={{ hover: { y: -8 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="pkg-location">
          <MapPin size={12} /> {pkg.destinationName || pkg.destination}
        </div>
        <h3 className="pkg-title">{pkg.title}</h3>

        <div className="pkg-rating">
          <Star size={14} fill="currentColor" />
          {pkg.rating}
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>(86 reviews)</span>
        </div>

        <div className="pkg-meta">
          <span className="pkg-meta-item"><Clock size={13} /> {pkg.duration}</span>
        </div>

        <motion.div
          variants={{ initial: { opacity: 0, height: 0 }, hover: { opacity: 1, height: 'auto' } }}
          initial="initial"
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <p className="pkg-desc">{pkg.shortDescription}</p>
        </motion.div>

        <div className="pkg-price-row">
          <div>
            <div className="pkg-price-label">Starting from</div>
            <div className="pkg-price">₹{Number(pkg.price).toLocaleString('en-IN')}</div>
          </div>
          <Link to={`/packages/${pkg.id}`} className="pkg-cta" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
            View Details
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PackageCard;
