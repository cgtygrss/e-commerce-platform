import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/api';
import { Product, CartItem } from '../types';

const Cart: React.FC = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { cartItems } = cart;
    const navigate = useNavigate();
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
    const itemsToShow = 4;

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const allProducts = await getProducts();
                // Filter out products already in cart and get all available products
                const cartProductIds = cartItems.map(item => item.product);
                const availableProducts = allProducts.filter(p => !cartProductIds.includes(p._id));
                const shuffled = availableProducts.sort(() => 0.5 - Math.random());
                setSuggestedProducts(shuffled);
            } catch (error) {
                console.error('Failed to fetch suggestions', error);
            }
        };
        fetchSuggestions();
    }, [cartItems]);

    const getVisibleProducts = (): Product[] => {
        if (suggestedProducts.length === 0) return [];
        const result: Product[] = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (startIndex + i) % suggestedProducts.length;
            result.push(suggestedProducts[index]);
        }
        return result;
    };

    const nextProduct = () => {
        if (isAnimating || suggestedProducts.length <= itemsToShow) return;
        setAnimationDirection('left');
        setIsAnimating(true);
        setTimeout(() => {
            setStartIndex((prev) => (prev + 1) % suggestedProducts.length);
            setIsAnimating(false);
            setAnimationDirection(null);
        }, 300);
    };

    const prevProduct = () => {
        if (isAnimating || suggestedProducts.length <= itemsToShow) return;
        setAnimationDirection('right');
        setIsAnimating(true);
        setTimeout(() => {
            setStartIndex((prev) => (prev - 1 + suggestedProducts.length) % suggestedProducts.length);
            setIsAnimating(false);
            setAnimationDirection(null);
        }, 300);
    };

    const visibleProducts = getVisibleProducts();

    const removeFromCartHandler = (id: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const addToCartHandler = (product: CartItem, qty: number) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, qty },
        });
    };

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    const calculateTotal = (): string => {
        return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', margin: '3rem 0' }}>
                    <p>Your cart is empty.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Go Shopping</Link>
                </div>
            ) : (
                <div className="cart-grid">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <Link to={`/product/${item.product}`} className="item-name">{item.name}</Link>
                                    <p className="item-price">${item.price}</p>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                                        disabled={item.qty <= 1}
                                        className="qty-btn"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span>{item.qty}</span>
                                    <button
                                        onClick={() => addToCartHandler(item, item.qty + 1)}
                                        className="qty-btn"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="item-remove">
                                    <button onClick={() => removeFromCartHandler(item.product)} className="remove-btn">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-block"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}

            {/* You Might Also Like Section */}
            {suggestedProducts.length > 0 && (
                <div className="suggestions-section">
                    <div className="suggestions-header">
                        <h2 className="suggestions-title">You Might Also Like</h2>
                        <div className="carousel-controls">
                            <button className="carousel-btn" onClick={prevProduct}>
                                <ChevronLeft size={24} />
                            </button>
                            <button className="carousel-btn" onClick={nextProduct}>
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="carousel-container">
                        <div className={`products-row ${isAnimating ? `slide-${animationDirection}` : ''}`}>
                            {visibleProducts.map((product, index) => (
                                <Link to={`/product/${product._id}`} key={`${product._id}-${startIndex}-${index}`} className="suggestion-card">
                                    <div className="suggestion-image">
                                        <img src={product.images[0]} alt={product.name} />
                                    </div>
                                    <div className="suggestion-info">
                                        <span className="suggestion-name">{product.name}</span>
                                        <span className="suggestion-price">${product.price.toFixed(2)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .cart-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .cart-item {
                    display: flex;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    gap: 1.5rem;
                }
                .item-image img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .item-details {
                    flex: 1;
                }
                .item-name {
                    font-weight: 500;
                    color: var(--color-text);
                    text-decoration: none;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .item-price {
                    color: var(--color-gold);
                    font-weight: 600;
                }
                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f5f5f5;
                    padding: 0.25rem;
                    border-radius: 4px;
                }
                .qty-btn {
                    padding: 0.25rem;
                    color: var(--color-text);
                }
                .remove-btn {
                    color: #ff4d4f;
                }
                .cart-summary {
                    background: #f9f9f9;
                    padding: 2rem;
                    border-radius: 8px;
                    height: fit-content;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .summary-row.total {
                    font-weight: 700;
                    font-size: 1.2rem;
                    border-top: 1px solid #ddd;
                    padding-top: 1rem;
                    margin-top: 1rem;
                }
                .btn-block {
                    width: 100%;
                }
                @media (max-width: 768px) {
                    .cart-grid {
                        grid-template-columns: 1fr;
                    }
                    .products-row {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                .suggestions-section {
                    margin-top: 4rem;
                    padding-top: 3rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .suggestions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .suggestions-title {
                    font-family: var(--font-heading);
                    font-size: 1.75rem;
                    color: var(--color-text);
                    margin: 0;
                }
                .carousel-controls {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                .carousel-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: var(--color-text);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .carousel-btn:hover:not(:disabled) {
                    background: var(--color-gold);
                    color: var(--color-text-dark);
                    border-color: var(--color-gold);
                }
                .carousel-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .carousel-container {
                    position: relative;
                    overflow: hidden;
                }
                .products-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                .products-row.slide-left {
                    animation: slideLeft 0.3s ease;
                }
                .products-row.slide-right {
                    animation: slideRight 0.3s ease;
                }
                @keyframes slideLeft {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(-30px);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideRight {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(30px);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .suggestion-card {
                    background: var(--color-surface);
                    border-radius: 8px;
                    overflow: hidden;
                    text-decoration: none;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .suggestion-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
                .suggestion-image {
                    aspect-ratio: 1;
                    overflow: hidden;
                }
                .suggestion-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .suggestion-card:hover .suggestion-image img {
                    transform: scale(1.05);
                }
                .suggestion-info {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.5rem;
                }
                .suggestion-name {
                    font-size: 0.9rem;
                    color: var(--color-text);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                }
                .suggestion-price {
                    font-weight: 600;
                    color: var(--color-gold);
                    font-size: 0.95rem;
                    flex-shrink: 0;
                }
                @media (max-width: 1024px) {
                    .products-row {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @media (max-width: 640px) {
                    .products-row {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .suggestion-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;
