import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { MapPin, CreditCard, Check, ChevronRight, ShoppingBag, Truck, Shield } from 'lucide-react';
import api from '../services/api';

const Checkout = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { cartItems, shippingAddress } = cart;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);

    // Shipping form state
    const [shippingForm, setShippingForm] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    // Payment form state
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });

    // Fetch user profile data to pre-fill shipping address
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                navigate('/login?redirect=/checkout');
                return;
            }
            
            try {
                setProfileLoading(true);
                const response = await api.get('/auth/profile');
                const userData = response.data;
                
                // Pre-fill shipping form with user data
                setShippingForm({
                    firstName: userData.name || '',
                    lastName: userData.surname || '',
                    address: userData.address?.street || shippingAddress.address || '',
                    city: userData.address?.city || shippingAddress.city || '',
                    postalCode: userData.address?.postalCode || shippingAddress.postalCode || '',
                    country: userData.address?.country || shippingAddress.country || '',
                    phone: userData.phone || ''
                });
                
                // Pre-fill card name
                setCardDetails(prev => ({
                    ...prev,
                    cardName: `${userData.name || ''} ${userData.surname || ''}`.trim()
                }));
            } catch (error) {
                console.error('Failed to fetch user profile', error);
                // Fallback to context data if API fails
                setShippingForm({
                    firstName: user?.name || '',
                    lastName: user?.surname || '',
                    address: user?.address?.street || shippingAddress.address || '',
                    city: user?.address?.city || shippingAddress.city || '',
                    postalCode: user?.address?.postalCode || shippingAddress.postalCode || '',
                    country: user?.address?.country || shippingAddress.country || '',
                    phone: user?.phone || ''
                });
            } finally {
                setProfileLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    useEffect(() => {
        if (cartItems.length === 0 && !profileLoading) {
            navigate('/cart');
        }
    }, [cartItems, navigate, profileLoading]);

    // Calculate prices
    // Calculate prices (all prices are tax-included)
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 20;
    const totalPrice = (itemsPrice + shippingPrice).toFixed(2);

    const handleShippingChange = (e) => {
        setShippingForm({
            ...shippingForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCardChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        // Format card number with spaces
        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            value = value.substring(0, 19);
        }
        // Format expiry as MM/YY
        if (name === 'expiry') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
        }
        // Limit CVV
        if (name === 'cvv') {
            value = value.substring(0, 4);
        }

        setCardDetails({
            ...cardDetails,
            [name]: value
        });
    };

    const validateShipping = () => {
        const { firstName, lastName, address, city, postalCode, country } = shippingForm;
        return firstName && lastName && address && city && postalCode && country;
    };

    const validatePayment = () => {
        if (paymentMethod === 'credit-card') {
            const { cardNumber, cardName, expiry, cvv } = cardDetails;
            return cardNumber.length >= 19 && cardName && expiry.length === 5 && cvv.length >= 3;
        }
        return true;
    };

    const handleContinue = () => {
        if (currentStep === 1 && validateShipping()) {
            dispatch({
                type: 'SAVE_SHIPPING_ADDRESS',
                payload: {
                    address: shippingForm.address,
                    city: shippingForm.city,
                    postalCode: shippingForm.postalCode,
                    country: shippingForm.country
                }
            });
            setCurrentStep(2);
        } else if (currentStep === 2 && validatePayment()) {
            setCurrentStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const { data } = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress: {
                    firstName: shippingForm.firstName,
                    lastName: shippingForm.lastName,
                    address: shippingForm.address,
                    city: shippingForm.city,
                    postalCode: shippingForm.postalCode,
                    country: shippingForm.country,
                    phone: shippingForm.phone
                },
                paymentMethod: paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal',
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                taxPrice: 0,
                totalPrice: totalPrice
            });

            dispatch({ type: 'CLEAR_CART' });
            localStorage.removeItem('cartItems');
            
            navigate('/order-success', { state: { orderId: data._id } });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Shipping', icon: MapPin },
        { number: 2, title: 'Payment', icon: CreditCard },
        { number: 3, title: 'Review', icon: Check }
    ];

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-title">Checkout</h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div 
                                className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                                onClick={() => currentStep > step.number && setCurrentStep(step.number)}
                            >
                                <div className="step-icon">
                                    {currentStep > step.number ? <Check size={20} /> : <step.icon size={20} />}
                                </div>
                                <span className="step-title">{step.title}</span>
                            </div>
                            {index < steps.length - 1 && <div className={`step-line ${currentStep > step.number ? 'active' : ''}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="checkout-content">
                    {/* Main Form Section */}
                    <div className="checkout-form-section">
                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <div className="form-step">
                                <h2><MapPin size={24} /> Shipping Information</h2>
                                {profileLoading ? (
                                    <div className="loading-form">
                                        <div className="skeleton skeleton-input"></div>
                                        <div className="skeleton skeleton-input"></div>
                                        <div className="skeleton skeleton-input"></div>
                                    </div>
                                ) : (
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingForm.firstName}
                                            onChange={handleShippingChange}
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingForm.lastName}
                                            onChange={handleShippingChange}
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingForm.address}
                                            onChange={handleShippingChange}
                                            placeholder="123 Main Street, Apt 4"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingForm.city}
                                            onChange={handleShippingChange}
                                            placeholder="New York"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={shippingForm.postalCode}
                                            onChange={handleShippingChange}
                                            placeholder="10001"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={shippingForm.country}
                                            onChange={handleShippingChange}
                                            placeholder="United States"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingForm.phone}
                                            onChange={handleShippingChange}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>
                                )}
                                <button 
                                    className="btn btn-primary btn-continue"
                                    onClick={handleContinue}
                                    disabled={!validateShipping() || profileLoading}
                                >
                                    Continue to Payment <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === 2 && (
                            <div className="form-step">
                                <h2><CreditCard size={24} /> Payment Method</h2>
                                
                                <div className="payment-methods">
                                    <label className={`payment-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit-card"
                                            checked={paymentMethod === 'credit-card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <CreditCard size={24} />
                                        <span>Credit / Debit Card</span>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="paypal-text">PayPal</span>
                                    </label>
                                </div>

                                {paymentMethod === 'credit-card' && (
                                    <div className="card-form">
                                        <div className="form-group full-width">
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={cardDetails.cardName}
                                                onChange={handleCardChange}
                                                placeholder="JOHN DOE"
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardDetails.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={cardDetails.cvv}
                                                onChange={handleCardChange}
                                                placeholder="•••"
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="paypal-info">
                                        <p>You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                                    </div>
                                )}

                                <div className="step-buttons">
                                    <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                                        Back
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-continue"
                                        onClick={handleContinue}
                                        disabled={!validatePayment()}
                                    >
                                        Review Order <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="form-step">
                                <h2><Check size={24} /> Review Your Order</h2>

                                <div className="review-section">
                                    <h3>Shipping Address</h3>
                                    <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                                    <p>{shippingForm.address}</p>
                                    <p>{shippingForm.city}, {shippingForm.postalCode}</p>
                                    <p>{shippingForm.country}</p>
                                    {shippingForm.phone && <p>Phone: {shippingForm.phone}</p>}
                                    <button className="edit-btn" onClick={() => setCurrentStep(1)}>Edit</button>
                                </div>

                                <div className="review-section">
                                    <h3>Payment Method</h3>
                                    <p>{paymentMethod === 'credit-card' ? `Card ending in ${cardDetails.cardNumber.slice(-4)}` : 'PayPal'}</p>
                                    <button className="edit-btn" onClick={() => setCurrentStep(2)}>Edit</button>
                                </div>

                                <div className="review-section">
                                    <h3>Order Items</h3>
                                    <div className="review-items">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="review-item">
                                                <img src={item.image} alt={item.name} />
                                                <div className="review-item-info">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-qty">Qty: {item.qty}</span>
                                                </div>
                                                <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <div className="step-buttons">
                                    <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                                        Back
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-place-order"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Place Order • $${totalPrice}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="order-summary">
                        <h3><ShoppingBag size={20} /> Order Summary</h3>
                        
                        <div className="summary-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="summary-item">
                                    <div className="summary-item-image">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-qty-badge">{item.qty}</span>
                                    </div>
                                    <div className="summary-item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-row tax-note">
                            <span>Tax</span>
                            <span>Included</span>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>

                        <div className="summary-features">
                            <div className="feature">
                                <Truck size={18} />
                                <span>Free shipping over $100</span>
                            </div>
                            <div className="feature">
                                <Shield size={18} />
                                <span>Secure checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-page {
                    padding: 3rem 0;
                    min-height: 80vh;
                    background: var(--color-bg);
                }

                .checkout-title {
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    text-align: center;
                    color: var(--color-text);
                }

                .checkout-steps {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 3rem;
                    gap: 0;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.3s;
                }

                .step.active {
                    opacity: 1;
                }

                .step.completed {
                    cursor: pointer;
                }

                .step-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--color-surface);
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text-muted);
                    transition: all 0.3s;
                }

                .step.active .step-icon {
                    background: var(--color-gold);
                    border-color: var(--color-gold);
                    color: var(--color-text-dark);
                }

                .step.completed .step-icon {
                    background: #4CAF50;
                    border-color: #4CAF50;
                    color: white;
                }

                .step-title {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    font-weight: 500;
                }

                .step.active .step-title {
                    color: var(--color-text);
                }

                .step-line {
                    width: 80px;
                    height: 2px;
                    background: rgba(212, 175, 55, 0.2);
                    margin: 0 1rem;
                    margin-bottom: 1.5rem;
                    transition: background 0.3s;
                }

                .step-line.active {
                    background: #4CAF50;
                }

                .checkout-content {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 3rem;
                    align-items: start;
                }

                .checkout-form-section {
                    background: var(--color-surface);
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .form-step h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                    color: var(--color-text);
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }

                .loading-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                }

                .skeleton-input {
                    height: 48px;
                    width: 100%;
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--color-text);
                }

                .form-group input {
                    padding: 0.875rem 1rem;
                    border: 1px solid rgba(0,0,0,0.15);
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    background: #fff;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: var(--color-gold);
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                .btn-continue {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    margin-top: 2rem;
                    padding: 1rem;
                    font-size: 1rem;
                }

                .payment-methods {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .payment-option {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1.25rem;
                    border: 2px solid rgba(0,0,0,0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .payment-option input {
                    display: none;
                }

                .payment-option.selected {
                    border-color: var(--color-gold);
                    background: rgba(212, 175, 55, 0.05);
                }

                .payment-option span {
                    font-weight: 500;
                }

                .paypal-text {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #003087;
                }

                .card-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .paypal-info {
                    padding: 1.5rem;
                    background: rgba(0, 48, 135, 0.05);
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .step-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .step-buttons .btn-outline {
                    flex: 0 0 auto;
                }

                .step-buttons .btn-primary {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .review-section {
                    position: relative;
                    padding: 1.5rem;
                    background: rgba(0,0,0,0.02);
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                }

                .review-section h3 {
                    font-size: 1rem;
                    color: var(--color-gold);
                    margin-bottom: 0.75rem;
                }

                .review-section p {
                    margin: 0.25rem 0;
                    color: var(--color-text);
                }

                .edit-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: none;
                    color: var(--color-gold);
                    font-weight: 500;
                    text-decoration: underline;
                }

                .review-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .review-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .review-item img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .review-item-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .review-item .item-name {
                    font-weight: 500;
                }

                .review-item .item-qty {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .review-item .item-price {
                    font-weight: 600;
                    color: var(--color-gold);
                }

                .btn-place-order {
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                }

                .error-message {
                    background: #fee;
                    color: #c00;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                /* Order Summary Sidebar */
                .order-summary {
                    background: var(--color-surface);
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    position: sticky;
                    top: 100px;
                }

                .order-summary h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.2rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text);
                }

                .summary-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-height: 200px;
                    overflow-y: auto;
                }

                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .summary-item-image {
                    position: relative;
                }

                .summary-item-image img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .item-qty-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 20px;
                    height: 20px;
                    background: var(--color-gold);
                    color: var(--color-text-dark);
                    border-radius: 50%;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .summary-item-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .summary-item-info .item-name {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--color-text);
                }

                .summary-item-info .item-price {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .summary-divider {
                    height: 1px;
                    background: rgba(0,0,0,0.1);
                    margin: 1.5rem 0;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                }

                .summary-row.tax-note {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    font-style: italic;
                }

                .summary-row.total {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--color-text);
                }

                .summary-features {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(0,0,0,0.1);
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .feature svg {
                    color: #4CAF50;
                }

                @media (max-width: 968px) {
                    .checkout-content {
                        grid-template-columns: 1fr;
                    }

                    .order-summary {
                        order: -1;
                        position: relative;
                        top: 0;
                    }

                    .checkout-steps {
                        flex-wrap: wrap;
                    }

                    .step-line {
                        width: 40px;
                    }
                }

                @media (max-width: 640px) {
                    .form-grid, .card-form {
                        grid-template-columns: 1fr;
                    }

                    .payment-methods {
                        flex-direction: column;
                    }

                    .step-buttons {
                        flex-direction: column;
                    }

                    .step-buttons .btn-outline {
                        order: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
