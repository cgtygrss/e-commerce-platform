import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';
import { Product } from '../types';

const Home: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getFeaturedProducts();
                setFeaturedProducts(data);
            } catch (error) {
                console.error('Failed to fetch featured products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="home-page">
            <Hero />

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <ScrollReveal delay={0}>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <Sparkles size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="feature-title">Artisan Crafted</h4>
                                <p className="feature-desc">Each piece handcrafted by master jewelers</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <Shield size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="feature-title">Lifetime Warranty</h4>
                                <p className="feature-desc">Quality guaranteed for generations</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <Truck size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="feature-title">Free Shipping</h4>
                                <p className="feature-desc">Complimentary delivery worldwide</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="collection-section">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <span className="section-tagline">Curated For You</span>
                            <h2 className="section-title">Featured Collection</h2>
                            <p className="section-subtitle">
                                Discover our most cherished pieces, each selected for its exceptional beauty and craftsmanship.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="products-grid">
                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <span>Loading collection...</span>
                            </div>
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map((product, index) => (
                                <ScrollReveal key={product._id} delay={index * 0.1}>
                                    <ProductCard product={product} />
                                </ScrollReveal>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No featured products available</p>
                            </div>
                        )}
                    </div>

                    <ScrollReveal>
                        <div className="section-cta">
                            <Link to="/shop" className="btn btn-outline btn-lg">
                                View All Products
                                <ArrowRight size={18} strokeWidth={1.5} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="story-grid">
                        <ScrollReveal>
                            <div className="story-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=2068&auto=format&fit=crop"
                                    alt="Jewelry craftsmanship"
                                    className="story-image"
                                />
                                <div className="story-image-accent"></div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="story-content">
                                <span className="story-tagline">Our Philosophy</span>
                                <h2 className="story-title">
                                    The Art of <em>Timeless</em> Beauty
                                </h2>
                                <p className="story-text">
                                    At Velora, we believe that jewelry is more than adornment—it's an expression of your unique story.
                                    Each piece in our collection is thoughtfully designed and meticulously crafted to become a cherished
                                    part of your journey.
                                </p>
                                <p className="story-text">
                                    Our master artisans combine traditional techniques with contemporary design, creating jewelry
                                    that transcends trends and becomes a legacy to be passed down through generations.
                                </p>
                                <Link to="/about" className="story-link">
                                    Discover Our Story
                                    <ArrowRight size={16} strokeWidth={1.5} />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <ScrollReveal>
                        <div className="newsletter-content">
                            <h2 className="newsletter-title">Join the Velora Circle</h2>
                            <p className="newsletter-text">
                                Subscribe to receive exclusive offers, early access to new collections,
                                and stories from our atelier.
                            </p>
                            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="newsletter-input-group">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="newsletter-input"
                                        required
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="newsletter-note">
                                    By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                                </p>
                            </form>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <style>{`
        .home-page {
          padding-top: 0;
        }
        
        /* Features Section */
        .features-section {
          padding: 4rem 0;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }
        
        .feature-item {
          text-align: center;
          padding: 1.5rem;
        }
        
        .feature-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1rem;
          background: var(--color-accent-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
        }
        
        .feature-title {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }
        
        .feature-desc {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        
        /* Collection Section */
        .collection-section {
          padding: 6rem 0;
        }
        
        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        
        .section-tagline {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-accent);
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .section-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          margin-bottom: 1rem;
          color: var(--color-text);
        }
        
        .section-subtitle {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .loading-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 0;
          color: var(--color-text-muted);
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 0;
          color: var(--color-text-muted);
        }
        
        .section-cta {
          text-align: center;
          margin-top: 3rem;
        }
        
        .btn-lg {
          padding: 1rem 2.5rem;
          gap: 0.75rem;
        }
        
        /* Story Section */
        .story-section {
          padding: 6rem 0;
          background: var(--color-surface);
        }
        
        .story-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        
        .story-image-wrapper {
          position: relative;
        }
        
        .story-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: var(--radius-md);
          position: relative;
          z-index: 1;
        }
        
        .story-image-accent {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          right: -1.5rem;
          bottom: -1.5rem;
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-md);
          z-index: 0;
        }
        
        .story-content {
          padding: 0 0.5rem;
        }
        
        .story-tagline {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-accent);
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .story-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 1.5rem;
          color: var(--color-text);
          line-height: 1.2;
        }
        
        .story-title em {
          font-style: italic;
          color: var(--color-accent);
        }
        
        .story-text {
          color: var(--color-text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.8;
          font-size: 1rem;
        }
        
        .story-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-accent);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 1rem;
          transition: gap var(--transition-fast);
        }
        
        .story-link:hover {
          gap: 0.75rem;
        }
        
        /* Newsletter Section */
        .newsletter-section {
          padding: 5rem 0;
          background: var(--color-primary);
          color: #fff;
        }
        
        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        
        .newsletter-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          margin-bottom: 1rem;
          color: #fff;
        }
        
        .newsletter-text {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          font-size: 1.05rem;
          line-height: 1.7;
        }
        
        .newsletter-form {
          max-width: 480px;
          margin: 0 auto;
        }
        
        .newsletter-input-group {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .newsletter-input {
          flex: 1;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 0.95rem;
          transition: border-color var(--transition-fast);
        }
        
        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .newsletter-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        
        .newsletter-btn {
          padding: 1rem 1.75rem;
          background: var(--color-accent);
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        
        .newsletter-btn:hover {
          background: var(--color-accent-light);
          transform: translateY(-1px);
        }
        
        .newsletter-note {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }
        
        /* Responsive */
        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .story-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
          }
          
          .story-image {
            height: 500px;
          }
        }
      `}</style>
        </div>
    );
};

export default Home;
