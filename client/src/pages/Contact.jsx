import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
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
                        <span>hello@selene.com</span>
                    </div>
                    <div className="info-item flex items-center">
                        <Phone className="icon" />
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="info-item flex items-center">
                        <MapPin className="icon" />
                        <span>123 Luxury Lane, New York, NY 10001</span>
                    </div>
                </div>

                <form className="contact-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="5" placeholder="How can we help?"></textarea>
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
