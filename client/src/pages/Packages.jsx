import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { getPackages } from '../services/api';

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [sort, setSort] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = ['Honeymoon', 'Family Tours', 'Adventure', 'Beach Holidays', 'International Tours', 'Luxury', 'Weekend', 'Group'];

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (duration) params.duration = duration;
    if (sort) params.sort = sort;
    getPackages(params)
      .then(res => setPackages(res.data.data || []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [search, category, duration, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    // search is already stateful, just trigger re-fetch
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      <style>{`
        .packages-page-hero {
          background: linear-gradient(135deg, var(--navy) 0%, #1a3a6c 100%);
          padding: var(--sp-16) 0 var(--sp-12) 0;
          text-align: center;
          color: white;
        }
        .pkg-filters-bar {
          background: white;
          border-bottom: 1px solid var(--gray-100);
          padding: var(--sp-5) 0;
          position: sticky;
          top: 68px;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .pkg-filters-inner {
          display: flex;
          gap: var(--sp-3);
          align-items: center;
          flex-wrap: wrap;
        }
        .pkg-search-input {
          flex: 1;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          background: var(--gray-50);
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-full);
          padding: 0.6rem 1rem;
        }
        .pkg-search-input input {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: var(--navy);
          flex: 1;
        }
        .pkg-search-input input:focus { outline: none; }
        .filter-select {
          padding: 0.6rem 1rem;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-full);
          font-size: 0.875rem;
          color: var(--gray-700);
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .filter-select:focus { outline: none; border-color: var(--blue); }
        .filter-select.active { border-color: var(--teal); color: var(--teal); background: rgba(13,148,136,0.05); }
        .active-filters { display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-top: var(--sp-3); }
        .active-filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.3rem 0.75rem;
          background: rgba(13,148,136,0.08);
          color: var(--teal);
          border-radius: var(--r-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .active-filter-tag:hover { background: rgba(13,148,136,0.15); }
        .packages-content { padding: var(--sp-8) 0 var(--sp-16) 0; }
        .pkg-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--sp-6);
        }
        .no-results {
          text-align: center;
          padding: var(--sp-16) 0;
          color: var(--gray-500);
        }
        .no-results h3 { color: var(--navy); margin-bottom: 12px; font-size: 1.5rem; }
        @media (max-width: 640px) { .pkg-list-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <div className="packages-page-hero">
        <div className="container">
          <div className="section-eyebrow" style={{ justifyContent: 'center', color: 'var(--teal-light)' }}>Find Your Journey</div>
          <h1 className="section-title" style={{ color: 'white', margin: '12px 0 16px' }}>Explore All Tour <span style={{ color: 'var(--teal-light)' }}>Packages</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>Browse our curated collection of domestic and international travel experiences.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="pkg-filters-bar">
        <div className="container pkg-filters-inner">
          <div className="pkg-search-input">
            <Search size={16} color="var(--gray-400)" />
            <input
              type="text"
              placeholder="Search destination or package..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}><X size={15} /></button>}
          </div>

          <select className={`filter-select ${category ? 'active' : ''}`} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={`filter-select ${duration ? 'active' : ''}`} value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="">Any Duration</option>
            <option value="1-3">1–3 Days</option>
            <option value="4-7">4–7 Days</option>
            <option value="8+">8+ Days</option>
          </select>

          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sort: Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {(search || category || duration) && (
          <div className="container">
            <div className="active-filters">
              {search && (
                <span className="active-filter-tag" onClick={() => setSearch('')}>
                  "{search}" <X size={12} />
                </span>
              )}
              {category && (
                <span className="active-filter-tag" onClick={() => setCategory('')}>
                  {category} <X size={12} />
                </span>
              )}
              {duration && (
                <span className="active-filter-tag" onClick={() => setDuration('')}>
                  {duration} days <X size={12} />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="packages-content">
        <div className="container">
          {loading ? (
            <div className="pkg-list-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 420, borderRadius: 'var(--r-lg)' }} />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="no-results">
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
              <h3>No packages found</h3>
              <p style={{ marginBottom: 24 }}>Try adjusting your search or removing some filters.</p>
              <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory(''); setDuration(''); }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--sp-6)', fontSize: '0.9rem' }}>
                Showing <strong style={{ color: 'var(--navy)' }}>{packages.length}</strong> packages
              </p>
              <div className="pkg-list-grid">
                {packages.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
