import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getProductById } from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="container section text-center">Loading...</div>;
    if (!product) return <div className="container section text-center">Product not found</div>;

    return (
        <div className="product-detail-page container section">
            <Link to="/shop" className="back-link flex items-center">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            <div className="product-layout grid">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={product.images[selectedImage]} alt={product.name} className="main-image" />
                    </div>
                    <div className="thumbnail-list flex">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} ${index}`}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-meta flex items-center">
                        <span className="price">${product.price.toFixed(2)}</span>
                        <div className="rating flex items-center">
                            <Star size={16} fill="#D4AF37" color="#D4AF37" />
                            <Star size={16} fill="#D4AF37" color="#D4AF37" />
                            <Star size={16} fill="#D4AF37" color="#D4AF37" />
                            <Star size={16} fill="#D4AF37" color="#D4AF37" />
                            <Star size={16} fill="#D4AF37" color="#D4AF37" />
                            <span className="review-count">(12 reviews)</span>
                        </div>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="actions">
                        <button className="btn btn-primary btn-lg">
                            <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} /> Add to Cart
                        </button>
                    </div>

                    <div className="features">
                        <div className="feature-item flex items-center">
                            <Truck size={20} />
                            <span>Free Shipping & Returns</span>
                        </div>
                        <div className="feature-item flex items-center">
                            <ShieldCheck size={20} />
                            <span>2-Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .back-link {
          margin-bottom: 2rem;
          color: var(--color-text-muted);
          gap: 0.5rem;
        }
        .back-link:hover {
          color: var(--color-gold);
        }
        .product-layout {
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        .main-image-container {
          background-color: var(--color-surface);
          margin-bottom: 1rem;
          aspect-ratio: 1;
          overflow: hidden;
        }
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumbnail-list {
          gap: 1rem;
        }
        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          cursor: pointer;
          border: 1px solid transparent;
          opacity: 0.6;
          transition: all 0.2s;
        }
        .thumbnail.active, .thumbnail:hover {
          border-color: var(--color-gold);
          opacity: 1;
        }
        .product-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .product-meta {
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .price {
          font-size: 1.5rem;
          color: var(--color-gold);
          font-family: var(--font-heading);
        }
        .rating {
          gap: 0.2rem;
        }
        .review-count {
          margin-left: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .product-description {
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          font-size: 1.1rem;
        }
        .btn-lg {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }
        .features {
          margin-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          display: grid;
          gap: 1rem;
        }
        .feature-item {
          gap: 1rem;
          color: var(--color-text-muted);
        }
        
        @media (min-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }
      `}</style>
        </div>
    );
};

export default ProductDetail;
