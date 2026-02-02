import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">Velora</Link>
                        <p className="footer-tagline">
                            Crafting moments of elegance since 2020. Each piece tells a story of passion, precision, and timeless beauty.
                        </p>
                        <div className="footer-contact">
                            <a href="mailto:hello@velora.com" className="contact-item">
                                <Mail size={16} strokeWidth={1.5} />
                                <span>hello@velora.com</span>
                            </a>
                            <a href="tel:+1234567890" className="contact-item">
                                <Phone size={16} strokeWidth={1.5} />
                                <span>+1 (234) 567-890</span>
                            </a>
                            <div className="contact-item">
                                <MapPin size={16} strokeWidth={1.5} />
                                <span>New York, NY</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4 className="footer-heading">Shop</h4>
                            <nav className="footer-nav">
                                <Link to="/shop">All Collections</Link>
                                <Link to="/shop?cat=necklaces">Necklaces</Link>
                                <Link to="/shop?cat=earrings">Earrings</Link>
                                <Link to="/shop?cat=bracelets">Bracelets</Link>
                                <Link to="/shop?cat=rings">Rings</Link>
                            </nav>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Company</h4>
                            <nav className="footer-nav">
                                <Link to="/about">Our Story</Link>
                                <Link to="/contact">Contact Us</Link>
                                <Link to="/shipping">Shipping & Returns</Link>
                                <Link to="/faq">FAQ</Link>
                                <Link to="/care">Jewelry Care</Link>
                            </nav>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Connect</h4>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <Instagram size={20} strokeWidth={1.5} />
                                </a>
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <Facebook size={20} strokeWidth={1.5} />
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <Twitter size={20} strokeWidth={1.5} />
                                </a>
                            </div>

                            <div className="newsletter">
                                <p className="newsletter-text">Subscribe for exclusive offers</p>
                                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="newsletter-input"
                                    />
                                    <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                                        <ArrowUpRight size={18} strokeWidth={1.5} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-legal">
                        <p className="copyright">
                            &copy; {new Date().getFullYear()} Velora. All rights reserved.
                        </p>
                        <nav className="legal-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/cookies">Cookies</Link>
                        </nav>
                    </div>

                    <div className="payment-methods">
                        <span className="payment-label">Secure Payments</span>
                        <div className="payment-icons">
                            <div className="payment-icon">VISA</div>
                            <div className="payment-icon">MC</div>
                            <div className="payment-icon">AMEX</div>
                            <div className="payment-icon">PP</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-primary);
          color: rgba(255, 255, 255, 0.7);
          padding: 5rem 0 2rem;
          margin-top: auto;
        }
        
        .footer-main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Brand Section */
        .footer-brand {
          max-width: 320px;
        }
        
        .footer-logo {
          font-family: var(--font-display);
          font-size: 2rem;
          color: #fff;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 1.25rem;
          transition: color var(--transition-fast);
        }
        
        .footer-logo:hover {
          color: var(--color-accent);
        }
        
        .footer-tagline {
          font-size: 0.9rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1.5rem;
        }
        
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          transition: color var(--transition-fast);
        }
        
        .contact-item:hover {
          color: var(--color-accent);
        }
        
        /* Links Section */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        
        .footer-heading {
          font-family: var(--font-body);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          margin-bottom: 1.25rem;
          font-weight: 600;
        }
        
        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .footer-nav a {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          transition: all var(--transition-fast);
          display: inline-block;
        }
        
        .footer-nav a:hover {
          color: var(--color-accent);
          transform: translateX(4px);
        }
        
        /* Social & Newsletter */
        .social-links {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .social-link {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          transition: all var(--transition-fast);
        }
        
        .social-link:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }
        
        .newsletter-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.75rem;
        }
        
        .newsletter-form {
          display: flex;
          gap: 0.5rem;
        }
        
        .newsletter-input {
          flex: 1;
          padding: 0.625rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 0.85rem;
          transition: border-color var(--transition-fast);
        }
        
        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .newsletter-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        
        .newsletter-btn {
          width: 40px;
          height: 40px;
          background: var(--color-accent);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          transition: all var(--transition-fast);
        }
        
        .newsletter-btn:hover {
          background: var(--color-accent-light);
          transform: scale(1.05);
        }
        
        /* Footer Bottom */
        .footer-bottom {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .footer-legal {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          text-align: center;
        }
        
        .copyright {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .legal-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .legal-links a {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          transition: color var(--transition-fast);
        }
        
        .legal-links a:hover {
          color: var(--color-accent);
        }
        
        .payment-methods {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .payment-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }
        
        .payment-icons {
          display: flex;
          gap: 0.5rem;
        }
        
        .payment-icon {
          padding: 0.375rem 0.625rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          font-size: 0.65rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.05em;
        }
        
        /* Responsive */
        @media (min-width: 640px) {
          .footer-links {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .footer-legal {
            flex-direction: row;
            text-align: left;
            align-items: center;
          }
          
          .payment-methods {
            align-items: flex-end;
          }
        }
        
        @media (min-width: 1024px) {
          .footer-main {
            grid-template-columns: 1.2fr 2fr;
            gap: 4rem;
          }
          
          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
