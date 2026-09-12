import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { getDestinations } from '../services/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    getDestinations()
      .then(res => setDestinations(res.data.data || []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredDests = destinations.filter(d => {
    if (filter === 'All') return true;
    if (filter === 'Domestic') return d.category === 'India';
    if (filter === 'International') return d.category !== 'India';
    return true;
  });

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      <style>{`
        .dest-hero {
          background: linear-gradient(135deg, var(--navy) 0%, #1a3a6c 100%);
          padding: var(--sp-16) 0 var(--sp-12) 0;
          text-align: center;
          color: white;
        }
        .dest-filters {
          display: flex;
          justify-content: center;
          gap: var(--sp-4);
          margin-top: -24px;
          position: relative;
          z-index: 10;
          padding-bottom: var(--sp-10);
        }
        .df-btn {
          padding: 0.6rem 1.5rem;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--r-full);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--gray-600);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: var(--shadow-sm);
        }
        .df-btn:hover { color: var(--navy); border-color: var(--gray-300); }
        .df-btn.active {
          background: var(--navy);
          color: white;
          border-color: var(--navy);
        }
        .dest-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--sp-6);
          padding-bottom: var(--sp-20);
        }
        .dest-card-full {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          height: 360px;
          display: flex;
          align-items: flex-end;
          cursor: pointer;
        }
        .dest-card-full img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .dest-card-full:hover img { transform: scale(1.08); }
        .dcf-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12,26,46,0.9) 0%, rgba(12,26,46,0.4) 50%, transparent 100%);
          transition: all 0.4s;
        }
        .dest-card-full:hover .dcf-overlay {
          background: linear-gradient(to top, rgba(12,26,46,0.95) 0%, rgba(12,26,46,0.6) 60%, rgba(12,26,46,0.2) 100%);
        }
        .dcf-content {
          position: relative;
          z-index: 2;
          padding: var(--sp-6);
          color: white;
          width: 100%;
        }
        .dcf-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
        .dcf-name { font-size: 1.5rem; font-weight: 800; line-height: 1.1; }
        .dcf-country { font-size: 0.8rem; color: var(--teal-light); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-bottom: 4px; }
        .dcf-pkg-count { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: var(--r-full); font-size: 0.75rem; font-weight: 600; }
        .dcf-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; }
        .dcf-link { display: inline-flex; alignItems: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--teal-light); opacity: 0; transform: translateY(10px); transition: all 0.3s; }
        .dest-card-full:hover .dcf-link { opacity: 1; transform: translateY(0); }
      `}</style>

      <div className="dest-hero">
        <div className="container">
          <div className="section-eyebrow" style={{ justifyContent: 'center', color: 'var(--teal-light)' }}>Where To Next?</div>
          <h1 className="section-title" style={{ color: 'white', margin: '12px 0 16px' }}>Explore <span>Destinations</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>From the snowy peaks of Kashmir to the tropical beaches of Bali, find the perfect backdrop for your next story.</p>
        </div>
      </div>

      <div className="container">
        <div className="dest-filters">
          {['All', 'Domestic', 'International'].map(f => (
            <button key={f} className={`df-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f} Destinations
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dest-grid-full">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 360, borderRadius: 'var(--r-lg)' }} />)}
          </div>
        ) : (
          <div className="dest-grid-full">
            {filteredDests.map((dest, i) => (
              <Link to={`/packages?destination=${dest.name}`} key={dest.id}>
                <motion.div 
                  className="dest-card-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="dcf-overlay" />
                  <div className="dcf-content">
                    <div className="dcf-header">
                      <div>
                        <div className="dcf-country"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{dest.country}</div>
                        <div className="dcf-name">{dest.name}</div>
                      </div>
                      <div className="dcf-pkg-count">{dest.packageCount} Packages</div>
                    </div>
                    <div className="dcf-desc">{dest.description}</div>
                    <div className="dcf-link">View Packages <ArrowRight size={14} /></div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
