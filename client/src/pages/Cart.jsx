import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { cartItems } = cart;
    const navigate = useNavigate();

    const removeFromCartHandler = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const addToCartHandler = (product, qty) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, qty },
        });
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    const calculateTotal = () => {
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
                }
            `}</style>
        </div>
    );
};

export default Cart;
