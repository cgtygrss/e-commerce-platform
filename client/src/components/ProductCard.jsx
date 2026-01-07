import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { dispatch } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

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
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`}>
          <img src={product.images[0]} alt={product.name} className="product-image" />
          <img src={product.images[1] || product.images[0]} alt={product.name} className="product-image-hover" />
        </Link>
        <button 
          className={`add-to-cart-btn ${isAdded ? 'added' : ''}`} 
          onClick={addToCartHandler}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check size={18} className="check-icon" /> Added!
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> Add to Cart
            </>
          )}
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>

      <style>{`
        .product-card {
          group: relative;
        }
        .product-image-container {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          background-color: var(--color-surface);
          margin-bottom: 1rem;
        }
        .product-image, .product-image-hover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .product-image-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        .product-image-container:hover .product-image {
          opacity: 0;
        }
        .product-image-container:hover .product-image-hover {
          opacity: 1;
          transform: scale(1.1);
        }
        .add-to-cart-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background-color: rgba(255, 255, 255, 0.9);
          color: var(--color-text-dark);
          transform: translateY(100%);
          transition: transform 0.3s ease, background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
        }
        .add-to-cart-btn:active:not(.added) {
          transform: translateY(0) scale(0.95);
        }
        .add-to-cart-btn.added {
          background-color: #4CAF50;
          color: white;
        }
        .add-to-cart-btn .check-icon {
          animation: popIn 0.3s ease;
        }
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .product-image-container:hover .add-to-cart-btn {
          transform: translateY(0);
        }
        .product-name {
          font-family: var(--font-body);
          font-size: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }
        .product-price {
          color: var(--color-gold);
          font-family: var(--font-heading);
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
