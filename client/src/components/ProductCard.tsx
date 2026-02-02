import React, { useContext, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { dispatch } = useContext(CartContext);
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const addToCartHandler = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                qty: 1,
            },
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const toggleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image-wrapper">
                    <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="product-image primary"
                            onLoad={() => setImageLoaded(true)}
                        />
                        {product.images[1] && (
                            <img
                                src={product.images[1]}
                                alt={product.name}
                                className="product-image secondary"
                            />
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={toggleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={18} strokeWidth={1.5} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Quick Add Button */}
                    <button
                        className={`quick-add-btn ${isAdded ? 'added' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCartHandler();
                        }}
                        disabled={isAdded}
                    >
                        {isAdded ? (
                            <>
                                <Check size={16} strokeWidth={2} />
                                <span>Added</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={16} strokeWidth={1.5} />
                                <span>Quick Add</span>
                            </>
                        )}
                    </button>

                    {/* Badges */}
                    {product.isNewProduct && (
                        <span className="product-badge badge-new">New</span>
                    )}
                    {product.isBestseller && (
                        <span className="product-badge badge-bestseller">Bestseller</span>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="product-original-price">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    {product.material && (
                        <span className="product-material">{product.material}</span>
                    )}
                </div>
            </Link>

            <style>{`
        .product-card {
          position: relative;
        }
        
        .product-link {
          display: block;
        }
        
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          background-color: var(--color-surface-hover);
          margin-bottom: 1rem;
          border-radius: var(--radius-sm);
        }
        
        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .image-container.loaded {
          opacity: 1;
        }
        
        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-image.secondary {
          opacity: 0;
          transform: scale(1.05);
        }
        
        .product-card:hover .product-image.primary {
          opacity: 0;
        }
        
        .product-card:hover .product-image.secondary {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Wishlist Button */
        .wishlist-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
          z-index: 2;
        }
        
        .product-card:hover .wishlist-btn {
          opacity: 1;
          transform: translateY(0);
        }
        
        .wishlist-btn:hover {
          color: #e74c3c;
          transform: scale(1.1);
        }
        
        .wishlist-btn.active {
          opacity: 1;
          transform: translateY(0);
          color: #e74c3c;
        }
        
        /* Quick Add Button */
        .quick-add-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.98);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transform: translateY(100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        
        .product-card:hover .quick-add-btn {
          transform: translateY(0);
        }
        
        .quick-add-btn:hover:not(.added) {
          background: var(--color-accent);
          color: var(--color-primary);
        }
        
        .quick-add-btn.added {
          background: #27ae60;
          color: #fff;
          transform: translateY(0);
        }
        
        .quick-add-btn span {
          transition: opacity 0.2s ease;
        }
        
        /* Badges */
        .product-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: var(--radius-sm);
          z-index: 2;
        }
        
        .badge-new {
          background: var(--color-accent);
          color: var(--color-primary);
        }
        
        .badge-bestseller {
          background: var(--color-primary);
          color: #fff;
        }
        
        /* Product Info */
        .product-info {
          padding: 0 0.25rem;
        }
        
        .product-name {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--color-text);
          margin-bottom: 0.375rem;
          line-height: 1.4;
          transition: color var(--transition-fast);
        }
        
        .product-card:hover .product-name {
          color: var(--color-accent);
        }
        
        .product-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }
        
        .product-price {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--color-text);
        }
        
        .product-original-price {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-decoration: line-through;
        }
        
        .product-material {
          font-size: 0.75rem;
          color: var(--color-text-light);
          text-transform: capitalize;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .wishlist-btn {
            opacity: 1;
            transform: translateY(0);
            width: 32px;
            height: 32px;
          }
          
          .quick-add-btn {
            transform: translateY(0);
            padding: 0.625rem;
            font-size: 0.7rem;
          }
          
          .quick-add-btn span {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default ProductCard;
