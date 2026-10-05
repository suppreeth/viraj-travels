import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PackageCard = ({ pkg, index = 0, staggerSlideshow = false }) => {
  const stars = Math.round(pkg.rating);

  return (
    <motion.div
      className="pkg-card"
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: staggerSlideshow ? index * 1.5 : 0, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover="hover"
    >
      <style>{`
        .pkg-card {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          cursor: pointer;
          min-height: 460px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: #0f172a;
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
          transform: scale(1.06);
        }
        .pkg-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8, 14, 26, 0.98) 0%,
            rgba(8, 14, 26, 0.82) 45%,
            rgba(8, 14, 26, 0.35) 75%,
            rgba(8, 14, 26, 0.1) 100%
          );
          transition: all 0.4s ease;
        }
        .pkg-card:hover .pkg-card-overlay {
          background: linear-gradient(
            to top,
            rgba(8, 14, 26, 0.99) 0%,
            rgba(8, 14, 26, 0.90) 55%,
            rgba(8, 14, 26, 0.45) 85%,
            rgba(8, 14, 26, 0.15) 100%
          );
        }
        .pkg-card-body {
          position: relative;
          z-index: 2;
          padding: 1.15rem 1.15rem 1.25rem;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .pkg-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          font-weight: 500;
          color: #5eead4;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pkg-title {
          font-size: 1.12rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.35;
          margin: 0;
          min-height: 2.7em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pkg-rating-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.85);
          margin-top: 2px;
          margin-bottom: 4px;
        }
        .pkg-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          color: #fcd34d;
        }
        .pkg-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(255,255,255,0.8);
          font-size: 0.78rem;
        }
        .pkg-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          margin-top: 4px;
        }
        .pkg-price {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        .pkg-price-label {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }
        .pkg-btn-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .pkg-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.58rem 1.15rem;
          color: white;
          border-radius: var(--r-md);
          font-weight: 700;
          font-size: 0.82rem;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .pkg-cta:hover {
          opacity: 0.95;
          transform: translateY(-2px);
        }
        .pkg-cta-details {
          background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
          color: #ffffff;
        }
        .pkg-cta-details:hover {
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
          background: linear-gradient(135deg, #0369a1 0%, #0f766e 100%);
        }
        @media (max-width: 640px) {
          .pkg-card {
            min-height: 420px;
          }
          .pkg-card-body {
            padding: 1rem 1rem 1.15rem;
          }
          .pkg-title {
            font-size: 1.05rem;
            min-height: 2.5em;
          }
          .pkg-price {
            font-size: 1.25rem;
          }
          .pkg-cta {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
        @media (max-width: 380px) {
          .pkg-card {
            min-height: 390px;
          }
          .pkg-title {
            font-size: 0.98rem;
          }
          .pkg-price {
            font-size: 1.15rem;
          }
        }
      `}</style>

      <img src={pkg.mainImage} alt={pkg.title} className="pkg-card-img" loading="lazy" />
      <div className="pkg-card-overlay" />

      <motion.div
        className="pkg-card-body"
        variants={{ hover: { y: -8 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="pkg-location">
          <MapPin size={12} /> {pkg.destinationName || pkg.destination}
        </div>
        <Link to={`/packages/${pkg.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="pkg-title" style={{ transition: 'color 0.2s' }}>{pkg.title}</h3>
        </Link>

        <div className="pkg-rating-meta-row">
          <div className="pkg-rating">
            <Star size={13} fill="currentColor" />
            <span>{pkg.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontSize: '0.72rem' }}>(86 reviews)</span>
          </div>
          <div className="pkg-meta-item">
            <Clock size={12} /> <span>{pkg.duration}</span>
          </div>
        </div>

        <div className="pkg-price-row">
          <div>
            <div className="pkg-price-label">Starting from</div>
            <div className="pkg-price">₹{Number(pkg.price).toLocaleString('en-IN')}</div>
          </div>
          <Link
            to={`/packages/${pkg.id}`}
            className="pkg-cta pkg-cta-details"
            title="View package details"
          >
            Details
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PackageCard;
