import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, Truck, MapPin, CheckCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../services/api';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderTracking();
    }, [orderId]);

    const fetchOrderTracking = async () => {
        try {
            setLoading(true);
            // Get order details
            const orderRes = await api.get(`/orders/${orderId}`);
            setOrder(orderRes.data);

            // Get tracking info if available
            if (orderRes.data.trackingNumber) {
                try {
                    const trackingRes = await api.get(`/shipping/track/${orderId}`);
                    setTracking(trackingRes.data.data);
                } catch (trackError) {
                    console.log('Tracking info not available yet');
                }
            }
        } catch (err) {
            setError('Sipariş bilgisi alınamadı');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status) + 1;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="tracking-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Kargo bilgileri yükleniyor...</p>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="tracking-page">
                <div className="container">
                    <div className="error-state">
                        <Package size={64} />
                        <h2>Sipariş Bulunamadı</h2>
                        <p>{error || 'Bu sipariş bulunamadı veya erişim yetkiniz yok.'}</p>
                        <Link to="/profile" className="btn btn-primary">Siparişlerime Dön</Link>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    const currentStep = getStatusStep(order.status);

    return (
        <div className="tracking-page">
            <div className="container">
                <Link to="/profile" className="back-link">
                    <ArrowLeft size={20} /> Siparişlerime Dön
                </Link>

                <div className="tracking-header">
                    <h1><Truck size={32} /> Kargo Takibi</h1>
                    <p className="order-id">Sipariş: #{order._id.slice(-8).toUpperCase()}</p>
                </div>

                {/* Tracking Number Card */}
                {order.trackingNumber && (
                    <div className="tracking-number-card">
                        <div className="tracking-info">
                            <span className="label">Takip Numarası</span>
                            <span className="number">{order.trackingNumber}</span>
                        </div>
                        {order.carrier && (
                            <div className="carrier-info">
                                <span className="label">Kargo Firması</span>
                                <span className="carrier">{order.carrier.toUpperCase()}</span>
                            </div>
                        )}
                        {order.trackingUrl && (
                            <a 
                                href={order.trackingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="track-btn"
                            >
                                Kargo Sitesinde Takip Et <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                )}

                {/* Progress Timeline */}
                <div className="tracking-timeline">
                    <h2>Sipariş Durumu</h2>
                    <div className="timeline">
                        <div className={`timeline-step ${currentStep >= 1 ? 'completed' : ''}`}>
                            <div className="step-icon">
                                <CheckCircle size={24} />
                            </div>
                            <div className="step-content">
                                <h3>Sipariş Alındı</h3>
                                <p>{formatDate(order.createdAt)}</p>
                            </div>
                        </div>

                        <div className={`timeline-step ${currentStep >= 2 ? 'completed' : ''}`}>
                            <div className="step-icon">
                                <Package size={24} />
                            </div>
                            <div className="step-content">
                                <h3>Hazırlanıyor</h3>
                                <p>{order.isPaid ? 'Ödeme alındı, sipariş hazırlanıyor' : 'Ödeme bekleniyor'}</p>
                            </div>
                        </div>

                        <div className={`timeline-step ${currentStep >= 3 ? 'completed' : ''}`}>
                            <div className="step-icon">
                                <Truck size={24} />
                            </div>
                            <div className="step-content">
                                <h3>Kargoya Verildi</h3>
                                <p>{order.trackingNumber ? `Takip No: ${order.trackingNumber}` : 'Henüz kargoya verilmedi'}</p>
                            </div>
                        </div>

                        <div className={`timeline-step ${currentStep >= 4 ? 'completed' : ''}`}>
                            <div className="step-icon">
                                <MapPin size={24} />
                            </div>
                            <div className="step-content">
                                <h3>Teslim Edildi</h3>
                                <p>{order.deliveredAt ? formatDate(order.deliveredAt) : 'Teslim bekleniyor'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="order-details-card">
                    <h2>Sipariş Detayları</h2>
                    
                    <div className="details-grid">
                        <div className="detail-section">
                            <h3><MapPin size={18} /> Teslimat Adresi</h3>
                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            {order.shippingAddress.phone && <p>Tel: {order.shippingAddress.phone}</p>}
                        </div>

                        <div className="detail-section">
                            <h3><Package size={18} /> Ürünler</h3>
                            <div className="order-items">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="item-info">
                                            <span className="name">{item.name}</span>
                                            <span className="qty">x{item.qty}</span>
                                        </div>
                                        <span className="price">₺{(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-total">
                        <span>Toplam Tutar:</span>
                        <strong>₺{order.totalPrice.toFixed(2)}</strong>
                    </div>
                </div>

                {/* Estimated Delivery */}
                {order.estimatedDelivery && (
                    <div className="estimated-delivery">
                        <Clock size={20} />
                        <span>Tahmini Teslimat: {formatDate(order.estimatedDelivery)}</span>
                    </div>
                )}
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .tracking-page {
        min-height: 80vh;
        padding: 2rem 0 4rem;
        background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }

    .tracking-page .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        text-decoration: none;
        margin-bottom: 2rem;
        font-weight: 500;
        transition: color 0.2s;
    }

    .back-link:hover {
        color: #b8860b;
    }

    .tracking-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .tracking-header h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 2rem;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .tracking-header h1 svg {
        color: #b8860b;
    }

    .order-id {
        color: #6b7280;
        font-size: 1rem;
    }

    /* Tracking Number Card */
    .tracking-number-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1.5rem;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border: 2px solid #f59e0b;
        border-radius: 16px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
    }

    .tracking-info, .carrier-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .tracking-info .label, .carrier-info .label {
        font-size: 0.8rem;
        color: #92400e;
        text-transform: uppercase;
        font-weight: 600;
    }

    .tracking-info .number {
        font-size: 1.5rem;
        font-weight: 700;
        color: #92400e;
        letter-spacing: 2px;
    }

    .carrier-info .carrier {
        font-size: 1.2rem;
        font-weight: 600;
        color: #92400e;
    }

    .track-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #92400e;
        color: white;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
    }

    .track-btn:hover {
        background: #78350f;
        transform: translateY(-1px);
    }

    /* Timeline */
    .tracking-timeline {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .tracking-timeline h2 {
        font-size: 1.25rem;
        color: #1f2937;
        margin-bottom: 1.5rem;
    }

    .timeline {
        position: relative;
        padding-left: 2.5rem;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 11px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #e5e7eb;
        border-radius: 2px;
    }

    .timeline-step {
        position: relative;
        padding-bottom: 2rem;
        opacity: 0.5;
    }

    .timeline-step:last-child {
        padding-bottom: 0;
    }

    .timeline-step.completed {
        opacity: 1;
    }

    .timeline-step.completed::before {
        content: '';
        position: absolute;
        left: -2.5rem;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #22c55e, #22c55e);
        margin-left: 11px;
        border-radius: 2px;
    }

    .timeline-step:last-child.completed::before {
        display: none;
    }

    .step-icon {
        position: absolute;
        left: -2.5rem;
        width: 28px;
        height: 28px;
        background: #e5e7eb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
    }

    .timeline-step.completed .step-icon {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
    }

    .step-icon svg {
        width: 16px;
        height: 16px;
    }

    .step-content h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }

    .step-content p {
        font-size: 0.9rem;
        color: #6b7280;
    }

    /* Order Details Card */
    .order-details-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .order-details-card h2 {
        font-size: 1.25rem;
        color: #1f2937;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 1.5rem;
    }

    .detail-section h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
    }

    .detail-section h3 svg {
        color: #b8860b;
    }

    .detail-section p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.6;
    }

    .order-items {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .order-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 8px;
    }

    .order-item img {
        width: 45px;
        height: 45px;
        object-fit: cover;
        border-radius: 6px;
    }

    .order-item .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .order-item .name {
        font-size: 0.9rem;
        color: #1f2937;
        font-weight: 500;
    }

    .order-item .qty {
        font-size: 0.8rem;
        color: #6b7280;
    }

    .order-item .price {
        font-weight: 600;
        color: #b8860b;
    }

    .order-total {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 2px solid #e5e7eb;
        font-size: 1.1rem;
    }

    .order-total strong {
        font-size: 1.4rem;
        color: #b8860b;
    }

    /* Estimated Delivery */
    .estimated-delivery {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem;
        margin-top: 2rem;
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        border-radius: 12px;
        color: #1e40af;
        font-weight: 600;
    }

    /* Loading & Error States */
    .loading-state, .error-state {
        text-align: center;
        padding: 4rem 2rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #b8860b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .error-state svg {
        color: #d1d5db;
        margin-bottom: 1rem;
    }

    .error-state h2 {
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .error-state p {
        color: #6b7280;
        margin-bottom: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .tracking-number-card {
            flex-direction: column;
            text-align: center;
        }

        .details-grid {
            grid-template-columns: 1fr;
        }

        .timeline {
            padding-left: 2rem;
        }

        .step-icon {
            left: -2rem;
        }
    }
`;

export default OrderTracking;
