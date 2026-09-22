import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Globe, Shield, Heart, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--white)' }}>
      <style>{`
        .about-hero {
          position: relative;
          height: 60vh;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .about-hero img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .about-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(12,26,46,0.9), rgba(12,26,46,0.6));
        }
        .about-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          padding: 0 var(--sp-6);
        }
        .about-story {
          padding: var(--sp-24) 0;
          background: var(--off-white);
        }
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-12);
          align-items: center;
        }
        .story-img-wrapper {
          position: relative;
          border-radius: var(--r-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .story-img-wrapper img { width: 100%; display: block; }
        .story-badge {
          position: absolute;
          bottom: -20px; right: -20px;
          background: white;
          padding: var(--sp-5);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow-lg);
          text-align: center;
        }
        .story-badge h4 { font-size: 2rem; color: var(--navy); font-weight: 800; line-height: 1; }
        .story-badge p { font-size: 0.8rem; color: var(--teal); font-weight: 600; text-transform: uppercase; margin-top: 4px; }
        .story-text h2 { font-size: 2.5rem; color: var(--navy); font-weight: 800; margin-bottom: var(--sp-6); line-height: 1.2; }
        .story-text p { font-size: 1.05rem; color: var(--gray-600); line-height: 1.8; margin-bottom: var(--sp-4); }
        .values-section { padding: var(--sp-24) 0; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-6); margin-top: var(--sp-12); }
        .value-card { text-align: center; padding: var(--sp-6); }
        .value-icon { width: 64px; height: 64px; background: rgba(13,148,136,0.1); color: var(--teal); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--sp-4); }
        .value-card h4 { font-size: 1.2rem; color: var(--navy); font-weight: 700; margin-bottom: 12px; }
        .value-card p { font-size: 0.95rem; color: var(--gray-500); line-height: 1.6; }
        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; gap: var(--sp-16); }
          .story-badge { bottom: 20px; right: 20px; }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) { .values-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="about-hero">
        <img src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2000&auto=format&fit=crop" alt="About Us" />
        <div className="about-overlay" />
        <div className="about-content">
          <div className="section-eyebrow" style={{ justifyContent: 'center', color: 'var(--teal-light)' }}>Our Story</div>
          <h1 className="section-title" style={{ color: 'white', margin: '12px 0' }}>Crafting Unforgettable<br />Journeys Since 2015</h1>
        </div>
      </div>

      <div className="about-story">
        <div className="container">
          <div className="story-grid">
            <motion.div className="story-text" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2>We Believe Travel Is More Than Just A Destination</h2>
              <p>Founded in 2015, V-RAJ Holidays started with a simple belief: that travel should be transformative, not transactional. We didn't want to just sell tickets and hotel rooms; we wanted to craft experiences that stay with our travellers forever.</p>
              <p>Over the years, we've grown from a small passionate team to one of the most trusted travel agencies in India. Our secret? A relentless focus on quality, personalization, and 24/7 support.</p>
              <p>Whether it's a romantic honeymoon in Bali, a family adventure in the Himalayas, or a luxury escape to Dubai, we handle every detail so you can focus on making memories.</p>
              <div style={{ marginTop: 'var(--sp-8)' }}>
                <Link to="/contact" className="btn btn-primary">Plan Your Next Trip <ArrowRight size={16} /></Link>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="story-img-wrapper">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop" alt="Travelers" />
                <div className="story-badge">
                  <h4>10+</h4>
                  <p>Years Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="values-section container">
        <div className="section-header centered">
          <div className="section-eyebrow">Our Core Values</div>
          <h2 className="section-title">Why Choose <span>V-RAJ Holidays</span></h2>
        </div>
        
        <div className="values-grid">
          <motion.div className="value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }}>
            <div className="value-icon"><Globe size={28} /></div>
            <h4>Local Expertise</h4>
            <p>Our travel experts have personally visited the destinations we offer, bringing you hidden gems and authentic experiences.</p>
          </motion.div>
          
          <motion.div className="value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="value-icon"><Award size={28} /></div>
            <h4>Unmatched Quality</h4>
            <p>We partner only with highly-rated hotels, reliable transport services, and knowledgeable guides.</p>
          </motion.div>

          <motion.div className="value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="value-icon"><Shield size={28} /></div>
            <h4>100% Transparency</h4>
            <p>No hidden fees, no surprise charges. We believe in complete transparency from the moment you book.</p>
          </motion.div>

          <motion.div className="value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="value-icon"><Heart size={28} /></div>
            <h4>Customer First</h4>
            <p>Your comfort is our priority. Our 24/7 support ensures you're never left alone during your journey.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
