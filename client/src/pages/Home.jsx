import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

const Home = () => {
  // Dummy data for now
  const featuredProducts = [
    {
      _id: '1',
      name: 'Ethereal Gold Necklace',
      price: 129.00,
      images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop']
    },
    {
      _id: '2',
      name: 'Celestial Diamond Ring',
      price: 299.00,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop']
    },
    {
      _id: '3',
      name: 'Aurora Pearl Earrings',
      price: 89.00,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1887&auto=format&fit=crop']
    },
    {
      _id: '4',
      name: 'Golden Hour Bracelet',
      price: 159.00,
      images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop']
    }
  ];

  return (
    <div className="home-page">
      <Hero />

      <section className="section container">
        <ScrollReveal width="100%">
          <div className="section-header text-center">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">Handpicked favorites for the season</p>
          </div>
        </ScrollReveal>

        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ScrollReveal key={product._id} delay={index * 0.1}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal width="100%">
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="section bg-surface">
        <div className="container grid-2-col">
          <ScrollReveal>
            <div className="story-content">
              <h2>The Zetuli Standard</h2>
              <p>
                We believe that jewelry is more than just an accessory; it's an expression of individuality.
                Each piece in our collection is crafted with precision and passion, ensuring that you shine
                in every moment.
              </p>
              <Link to="/about" className="btn-link">Read Our Story &rarr;</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=2068&auto=format&fit=crop" alt="Jewelry Crafting" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        .section-header {
          margin-bottom: 3rem;
        }
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .section-subtitle {
          color: var(--color-text-muted);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
        .bg-surface {
          background-color: var(--color-surface);
        }
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }
        .story-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .story-content p {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        .btn-link {
          color: var(--color-gold);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .story-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }
        
        @media (min-width: 768px) {
          .grid-2-col {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
