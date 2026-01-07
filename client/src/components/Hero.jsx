import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content container">
        <h1 className="hero-title">Elegance in Every Detail</h1>
        <p className="hero-subtitle">Discover the Selené Collection. Timeless jewelry for the modern era.</p>
        <div className="hero-buttons">
          <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
          <Link to="/about" className="btn btn-outline">Our Story</Link>
        </div>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-bg"></div>

      <style>{`
        .hero {
          position: relative;
          height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          z-index: -2;
          animation: zoomIn 20s infinite alternate;
        }
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3));
          z-index: -1;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin-left: var(--spacing-sm);
        }
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          color: #fff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          color: rgba(255,255,255,0.9);
          max-width: 500px;
        }
        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .hero-content {
            margin-left: 10%;
          }
          .hero-title {
            font-size: 4.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
