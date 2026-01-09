import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content container">
        <h1 className="hero-title">Elegance in Every Detail</h1>
        <p className="hero-subtitle">Discover the Lâl Collection. Timeless jewelry for the modern era.</p>
        <div className="hero-buttons">
          <Link to="/shop" className="btn btn-primary hero-btn">Shop Collection</Link>
          <Link to="/about" className="btn btn-outline hero-btn">Our Story</Link>
        </div>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-bg"></div>
      
      {/* Decorative floating elements */}
      <div className="hero-sparkle sparkle-1"></div>
      <div className="hero-sparkle sparkle-2"></div>
      <div className="hero-sparkle sparkle-3"></div>

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
          opacity: 0;
          animation: heroFadeInUp 1s ease forwards;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          color: rgba(255,255,255,0.9);
          max-width: 500px;
          opacity: 0;
          animation: heroFadeInUp 1s ease 0.3s forwards;
        }
        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          opacity: 0;
          animation: heroFadeInUp 1s ease 0.6s forwards;
        }
        .hero-btn {
          position: relative;
          overflow: hidden;
        }
        .hero-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .hero-btn:hover::before {
          left: 100%;
        }
        
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Floating sparkle decorations */
        .hero-sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--color-gold);
          border-radius: 50%;
          z-index: 2;
          opacity: 0.6;
          animation: sparkleFloat 4s ease-in-out infinite;
        }
        .sparkle-1 {
          top: 20%;
          right: 15%;
          animation-delay: 0s;
        }
        .sparkle-2 {
          top: 60%;
          right: 25%;
          width: 6px;
          height: 6px;
          animation-delay: 1s;
        }
        .sparkle-3 {
          top: 40%;
          right: 10%;
          width: 4px;
          height: 4px;
          animation-delay: 2s;
        }
        @keyframes sparkleFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
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
