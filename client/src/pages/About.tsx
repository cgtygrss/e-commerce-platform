import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
    return (
        <div className="about-page container section">
            <div className="about-hero text-center">
                <h1 className="page-title">Our Story</h1>
                <p className="page-subtitle">Crafting timeless elegance since 2023.</p>
            </div>

            <div className="about-content grid-2-col">
                <ScrollReveal>
                    <div className="about-text">
                        <h2>The Velora Philosophy</h2>
                        <p>
                            At Velora, we believe that jewelry is an art form—a way to express your unique identity and style.
                            Our journey began with a simple vision: to create pieces that are not only beautiful but also meaningful.
                        </p>
                        <p>
                            Every piece in our collection is meticulously designed and handcrafted by skilled artisans who share our passion for perfection.
                            We source only the finest materials, ensuring that each gemstone and metal meets our rigorous standards of quality and sustainability.
                        </p>
                        <p>
                            Whether you're looking for a statement piece for a special occasion or a subtle accent for everyday wear,
                            Velora offers a curated selection that transcends trends and stands the test of time.
                        </p>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop" alt="Jewelry Workshop" />
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
        .about-hero {
          margin-bottom: 4rem;
        }
        .about-content {
          align-items: center;
          gap: 4rem;
        }
        .about-text h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .about-text p {
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .about-image img {
          width: 100%;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        @media (min-width: 768px) {
          .grid-2-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default About;
