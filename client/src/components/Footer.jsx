import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-col">
                        <h3 className="footer-logo">Zetuli</h3>
                        <p className="footer-desc">
                            Crafting timeless elegance for the modern soul.
                            Discover our exclusive collection of premium jewelry.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="footer-col">
                        <h4>Shop</h4>
                        <Link to="/shop">All Collections</Link>
                        <Link to="/shop?cat=necklaces">Necklaces</Link>
                        <Link to="/shop?cat=rings">Rings</Link>
                        <Link to="/shop?cat=earrings">Earrings</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="/about">Our Story</Link>
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/faq">FAQ</Link>
                        <Link to="/shipping">Shipping & Returns</Link>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col">
                        <h4>Stay Connected</h4>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button type="button" className="btn-submit">Subscribe</button>
                        </form>
                        <div className="social-links">
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Facebook size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Zetuli Jewelry. All rights reserved.</p>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-surface);
          padding: 5rem 0 2rem;
          margin-top: auto;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .footer-logo {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        .footer-desc {
          color: var(--color-text-muted);
          max-width: 300px;
        }
        .footer-col h4 {
          color: var(--color-text);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .footer-col a {
          display: block;
          color: var(--color-text-muted);
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
        }
        .footer-col a:hover {
          color: var(--color-gold);
        }
        .newsletter-form {
          display: flex;
          margin: 1.5rem 0;
        }
        .newsletter-form input {
          flex: 1;
          padding: 0.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text);
          outline: none;
        }
        .newsletter-form input:focus {
          border-color: var(--color-gold);
        }
        .btn-submit {
          background-color: var(--color-gold);
          color: var(--color-text-dark);
          padding: 0 1.5rem;
          font-weight: 600;
        }
        .social-links {
          display: flex;
          gap: 1rem;
        }
        .social-links a {
          color: var(--color-text);
          display: inline-block;
        }
        .social-links a:hover {
          color: var(--color-gold);
          transform: translateY(-2px);
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
