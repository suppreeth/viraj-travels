import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Star, MessageCircle, X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { getTestimonials, submitTestimonial } from '../services/api';

const PHONE_NUMBER = '+919876543210';
const DISPLAY_PHONE = '+91 98765 43210';
const WHATSAPP_NUMBER = '919876543210';
const WHATSAPP_MSG = encodeURIComponent('Hello V-RAJ Holidays! I would like to enquire about holiday packages.');

const FloatingActions = () => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    destination: '',
    rating: 5,
    review: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Load reviews when review modal is opened
  useEffect(() => {
    if (showReviewModal) {
      fetchReviews();
      setReviewSuccess(false);
      setReviewError('');
    }
  }, [showReviewModal]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await getTestimonials();
      if (res.data?.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
      setReviewError('Please enter your name and review message.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await submitTestimonial(reviewForm);
      if (res.data?.success) {
        setReviewSuccess(true);
        if (res.data.data) {
          setReviews(prev => [res.data.data, ...prev]);
        }
        setReviewForm({ name: '', destination: '', rating: 5, review: '' });
      } else {
        setReviewError(res.data?.message || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Unable to submit review right now. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <style>{`
        /* Floating action buttons at bottom-right stacked vertically */
        .floating-action-stack {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          z-index: 990;
        }

        .fab-btn-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .fab-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(12, 30, 52, 0.22);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          outline: none;
        }

        .fab-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(12, 30, 52, 0.32);
        }

        .fab-btn:active {
          transform: scale(0.95);
        }

        /* Distinct theme colours for each button */
        .fab-phone {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        }

        .fab-review {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
        }

        .fab-whatsapp {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        }

        /* Tooltip label appearing on hover */
        .fab-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          white-space: nowrap;
          background: rgba(12, 30, 52, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          pointer-events: none;
          opacity: 0;
          transform: translateX(6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .fab-btn-wrap:hover .fab-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        /* Modal Overlays */
        .fab-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 20, 36, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .fab-modal-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(10, 25, 45, 0.3);
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .fab-modal-header {
          padding: 22px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fab-modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0c1e34;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fab-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fab-close-btn:hover {
          background: #e2e8f0;
          color: #0c1e34;
        }

        .fab-modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        /* Phone Dialog specific */
        .phone-display-card {
          text-align: center;
          padding: 16px 0;
        }

        .phone-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .phone-number-text {
          font-size: 1.65rem;
          font-weight: 800;
          color: #0c1e34;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
        }

        .phone-subtext {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 24px;
        }

        .phone-call-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 1.05rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .phone-call-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(2, 132, 199, 0.45);
        }

        /* Review Dialog specific */
        .review-write-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .star-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 8px 0 14px;
        }

        .star-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          color: #cbd5e1;
          transition: color 0.15s, transform 0.15s;
        }

        .star-btn:hover {
          transform: scale(1.15);
        }

        .star-btn.active {
          color: #f59e0b;
        }

        .review-input, .review-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #0c1e34;
          background: #ffffff;
          margin-bottom: 12px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .review-input:focus, .review-textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
        }

        .review-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .submit-review-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 20px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .submit-review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }

        .review-item-card {
          border-bottom: 1px solid #f1f5f9;
          padding: 14px 0;
        }

        .review-item-card:last-child {
          border-bottom: none;
        }

        .ric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .ric-name {
          font-weight: 700;
          color: #0c1e34;
          font-size: 0.95rem;
        }

        .ric-dest {
          font-size: 0.78rem;
          color: #64748b;
        }

        .ric-text {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.55;
          margin-top: 6px;
        }

        @media (max-width: 640px) {
          .floating-action-stack {
            bottom: 20px;
            right: 18px;
            gap: 12px;
          }
          .fab-btn {
            width: 48px;
            height: 48px;
          }
          .fab-tooltip {
            display: none;
          }
        }
      `}</style>

      {/* ── STACKED FLOATING BUTTONS ── */}
      <div className="floating-action-stack" aria-label="Quick Actions">
        {/* 1. Phone Button (Top of stack) */}
        <div className="fab-btn-wrap">
          <button
            type="button"
            className="fab-btn fab-phone"
            onClick={() => setShowPhoneModal(true)}
            aria-label="Call Us"
          >
            <Phone size={22} />
          </button>
          <span className="fab-tooltip">Call Us</span>
        </div>

        {/* 2. Reviews Button (Middle) */}
        <div className="fab-btn-wrap">
          <button
            type="button"
            className="fab-btn fab-review"
            onClick={() => setShowReviewModal(true)}
            aria-label="Traveller Reviews"
          >
            <Star size={22} fill="#ffffff" />
          </button>
          <span className="fab-tooltip">Traveller Reviews</span>
        </div>

        {/* 3. WhatsApp Button (Bottom of stack) */}
        <div className="fab-btn-wrap">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fab-btn fab-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={24} fill="#ffffff" />
          </a>
          <span className="fab-tooltip">Chat on WhatsApp</span>
        </div>
      </div>

      {/* ── PHONE MODAL ── */}
      <AnimatePresence>
        {showPhoneModal && (
          <div className="fab-modal-overlay" onClick={() => setShowPhoneModal(false)}>
            <motion.div
              className="fab-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="fab-modal-header">
                <h3><Phone size={20} color="#0284c7" /> Contact Our Travel Desk</h3>
                <button
                  type="button"
                  className="fab-close-btn"
                  onClick={() => setShowPhoneModal(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="fab-modal-body">
                <div className="phone-display-card">
                  <div className="phone-avatar">
                    <Phone size={32} />
                  </div>
                  <div className="phone-number-text">{DISPLAY_PHONE}</div>
                  <p className="phone-subtext">
                    Available Mon - Sat, 9:00 AM - 7:00 PM IST.<br />
                    Speak directly with our certified trip curators.
                  </p>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="phone-call-btn"
                  >
                    <Phone size={18} /> Call Now ({DISPLAY_PHONE})
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── REVIEWS MODAL ── */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fab-modal-overlay" onClick={() => setShowReviewModal(false)}>
            <motion.div
              className="fab-modal-card"
              style={{ maxWidth: 560 }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="fab-modal-header">
                <h3><Star size={20} color="#f59e0b" fill="#f59e0b" /> Reviews & Ratings</h3>
                <button
                  type="button"
                  className="fab-close-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="fab-modal-body">
                {/* Review submission section */}
                <div className="review-write-box">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0c1e34' }}>
                      Write Your Review
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Share your travel experience
                    </span>
                  </div>

                  {reviewSuccess && (
                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <CheckCircle2 size={18} />
                      <span>Thank you! Your review has been posted successfully.</span>
                    </div>
                  )}

                  {reviewError && (
                    <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <AlertCircle size={18} />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit}>
                    {/* Star selection */}
                    <div className="star-row">
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginRight: 6 }}>Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${((hoverRating || reviewForm.rating) >= star) ? 'active' : ''}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        >
                          <Star size={24} fill={((hoverRating || reviewForm.rating) >= star) ? '#f59e0b' : 'transparent'} />
                        </button>
                      ))}
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginLeft: 4 }}>
                        {reviewForm.rating}.0 / 5.0
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        type="text"
                        className="review-input"
                        placeholder="Your Name *"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      <input
                        type="text"
                        className="review-input"
                        placeholder="Destination / Tour (e.g. Goa)"
                        value={reviewForm.destination}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, destination: e.target.value }))}
                      />
                    </div>

                    <textarea
                      className="review-textarea"
                      placeholder="Tell us about your trip with V-RAJ Holidays... *"
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                      required
                    />

                    <button
                      type="submit"
                      className="submit-review-btn"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : (
                        <>
                          <Send size={16} /> Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0c1e34', marginBottom: 12 }}>
                  Traveller Experiences ({reviews.length})
                </h4>

                {loadingReviews ? (
                  <p style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                    Loading reviews...
                  </p>
                ) : reviews.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                    No reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  <div>
                    {reviews.map((rev) => (
                      <div key={rev.id} className="review-item-card">
                        <div className="ric-header">
                          <span className="ric-name">{rev.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                size={14}
                                fill={idx < Math.round(rev.rating) ? '#f59e0b' : 'none'}
                                color={idx < Math.round(rev.rating) ? '#f59e0b' : '#cbd5e1'}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.destination && (
                          <div className="ric-dest">📍 {rev.destination}</div>
                        )}
                        <p className="ric-text">{rev.review}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActions;
