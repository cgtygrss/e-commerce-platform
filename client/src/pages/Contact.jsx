import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

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
        window.location.href = `mailto:info@selene.com?subject=${subject}&body=${body}`;
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
