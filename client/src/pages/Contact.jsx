import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

// TikTok icon component (not available in lucide-react)
const TikTokIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent('Info - Contact');
        const body = encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`);
        window.location.href = `mailto:info@lal.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="contact-page container section">
            <div className="contact-hero text-center">
                <h1 className="page-title">Contact Us</h1>
                <p className="page-subtitle">We'd love to hear from you.</p>
            </div>

            <div className="contact-grid">
                <div className="contact-info">
                    <h2>Get in Touch</h2>
                    <p className="contact-desc">
                        Have a question about our products, shipping, or custom orders?
                        Fill out the form or reach out to us directly.
                    </p>

                    <div className="info-item flex items-center">
                        <Mail className="icon" />
                        <span>info@laljewelery.com</span>
                    </div>
                    <div className="info-item flex items-center">
                        <Phone className="icon" />
                        <span>+90 (539) 674-1334</span>
                    </div>
                    <div className="info-item flex items-center">
                        <MapPin className="icon" />
                        <span>123 Luxury Lane, New York, NY 10001</span>
                    </div>

                    <div className="social-section">
                        <h3>Follow Us</h3>
                        <div className="social-links">
                            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                                <Instagram />
                            </a>
                            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                                <Facebook />
                            </a>
                            <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="social-link" title="TikTok">
                                <TikTokIcon />
                            </a>
                            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter / X">
                                <Twitter />
                            </a>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name" 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email" 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea 
                            rows="5" 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help?"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
            </div>

            <style>{`
        .contact-hero {
          margin-bottom: 4rem;
        }
        .contact-grid {
          display: grid;
          gap: 4rem;
        }
        .contact-info h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .contact-desc {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }
        .info-item {
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .info-item .icon {
          color: var(--color-gold);
        }
        .social-section {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }
        .social-section h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--color-text);
        }
        .social-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .social-link {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: var(--color-gold);
          transition: all 0.3s ease;
          padding: 0;
          box-sizing: border-box;
        }
        .social-link svg {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px;
          min-height: 20px;
          max-width: 20px;
          max-height: 20px;
          display: block !important;
          margin: auto !important;
          margin-top : 25% !important; 
          padding: auto !important;
          vertical-align: middle;
        }
        .social-link:hover {
          background-color: var(--color-gold);
          color: var(--color-bg);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        .contact-form {
          background-color: var(--color-surface);
          padding: 2rem;
          border-radius: 4px;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--color-text-muted);
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 0.8rem;
          background-color: var(--color-bg);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text);
          outline: none;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--color-gold);
        }
        
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Contact;
