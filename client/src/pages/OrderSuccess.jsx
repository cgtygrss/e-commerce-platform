import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="order-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <CheckCircle size={80} />
                </div>
                <h1>Thank You!</h1>
                <p className="success-message">Your order has been placed successfully.</p>
                
                {orderId && (
                    <div className="order-id">
                        <Package size={20} />
                        <span>Order ID: <strong>#{orderId.slice(-8).toUpperCase()}</strong></span>
                    </div>
                )}

                <p className="info-text">
                    We've sent a confirmation email with your order details.
                    You can track your order status in your profile.
                </p>

                <div className="success-actions">
                    <Link to="/profile" className="btn btn-outline">
                        View My Orders
                    </Link>
                    <Link to="/shop" className="btn btn-primary">
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            <style>{`
                .order-success-page {
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                }

                .success-container {
                    text-align: center;
                    max-width: 500px;
                    background: var(--color-surface);
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }

                .success-icon {
                    color: #4CAF50;
                    margin-bottom: 1.5rem;
                    animation: scaleIn 0.5s ease;
                }

                @keyframes scaleIn {
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

                .success-container h1 {
                    font-size: 2.5rem;
                    color: var(--color-text);
                    margin-bottom: 0.5rem;
                }

                .success-message {
                    font-size: 1.2rem;
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                }

                .order-id {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    background: rgba(212, 175, 55, 0.1);
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    color: var(--color-text);
                }

                .order-id svg {
                    color: var(--color-gold);
                }

                .info-text {
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .success-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .success-actions .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
