import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop" 
            alt="Elegant jewelry collection"
            className="hero-image"
          />
        </div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-tagline">New Collection</div>
        <h1 className="hero-title">
          Timeless Elegance,<br />
          <span className="hero-title-accent">Modern Soul</span>
        </h1>
        <p className="hero-subtitle">
          Discover exquisite pieces crafted to illuminate your unique beauty. 
          Each design tells a story of artistry and passion.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="hero-btn hero-btn-primary">
            Explore Collection
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
          <Link to="/about" className="hero-btn hero-btn-secondary">
            Our Story
          </Link>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-top: 80px;
        }
        
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        
        .hero-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
        
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.85) 0%,
            rgba(26, 26, 26, 0.4) 50%,
            rgba(26, 26, 26, 0.2) 100%
          );
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          padding: 0 var(--spacing-md);
          margin-left: 0;
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-tagline {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
          font-weight: 500;
          animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .hero-title-accent {
          font-style: italic;
          color: var(--color-accent-light);
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 480px;
          font-weight: 300;
          animation: fadeInUp 1s ease-out 0.4s both;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.5s both;
        }
        
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all var(--transition-normal);
          border-radius: var(--radius-sm);
        }
        
        .hero-btn-primary {
          background-color: var(--color-accent);
          color: var(--color-primary);
        }
        
        .hero-btn-primary:hover {
          background-color: var(--color-accent-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
        }
        
        .hero-btn-secondary {
          background-color: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .hero-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        /* Scroll Indicator */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 1s ease-out 1s both;
        }
        
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--color-accent), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        
        @keyframes scrollPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(0.8);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Responsive */
        @media (min-width: 768px) {
          .hero-content {
            margin-left: 5%;
            padding: 0;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-content {
            margin-left: 8%;
          }
        }
        
        @media (max-width: 640px) {
          .hero-actions {
            flex-direction: column;
          }
          
          .hero-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
