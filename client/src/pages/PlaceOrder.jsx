// ...existing code...
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const PlaceOrder = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 20); // Free shipping over $100
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
    }, [cart.shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const { data } = await api.post(
                '/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: 'PayPal', // Hardcoded for now
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                }
            );
            
            // Clear cart
            dispatch({ type: 'CLEAR_CART' });
            localStorage.removeItem('cartItems');

            navigate(`/`); // Redirect to home or order details
            alert('Order placed successfully!');
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1>Place Order</h1>
            <div className="place-order-grid">
                <div className="order-details">
                    <div className="section">
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>
                    <div className="section">
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="items-list">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-info">
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="item-total">
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Items</span>
                        <span>${cart.itemsPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>${cart.shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>${cart.taxPrice}</span>
                    </div>
                     <div className="summary-row total">
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button 
                        className="btn btn-primary btn-block" 
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                    >
                        Place Order
                    </button>
                </div>
            </div>
             <style>{`
                .place-order-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .section {
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                }
                .order-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .item-image img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .item-info {
                    flex: 1;
                }
                .item-info a {
                    color: var(--color-text);
                    text-decoration: none;
                }
                .order-summary {
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
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #ddd;
                }
                .btn-block {
                    width: 100%;
                }
                .error-message {
                    color: red;
                    margin-bottom: 1rem;
                }
                 @media (max-width: 768px) {
                    .place-order-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default PlaceOrder;
