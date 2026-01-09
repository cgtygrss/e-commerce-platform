import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, ArrowLeft, AlertCircle, CheckCircle, Camera, Send } from 'lucide-react';
import api from '../services/api';

const ReturnRequest = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState('');
    const [reasonDetails, setReasonDetails] = useState('');

    const returnReasons = [
        { value: 'defective', label: 'Ürün hasarlı/kusurlu' },
        { value: 'wrong_item', label: 'Yanlış ürün gönderildi' },
        { value: 'not_as_described', label: 'Ürün açıklamaya uygun değil' },
        { value: 'changed_mind', label: 'Fikir değişikliği' },
        { value: 'size_issue', label: 'Beden/Boyut uygun değil' },
        { value: 'quality_issue', label: 'Kalite beklentilerimi karşılamadı' },
        { value: 'arrived_late', label: 'Geç teslim edildi' },
        { value: 'other', label: 'Diğer' }
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/return-request/' + orderId);
            return;
        }
        fetchOrder();
    }, [orderId, user]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/orders/${orderId}`);
            setOrder(data);
            // Initialize selected items with all order items
            setSelectedItems(data.orderItems.map(item => ({
                ...item,
                selected: true,
                returnQty: item.qty
            })));
        } catch (err) {
            setError('Sipariş bulunamadı');
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelection = (index) => {
        setSelectedItems(prev => prev.map((item, i) => 
            i === index ? { ...item, selected: !item.selected } : item
        ));
    };

    const updateReturnQty = (index, qty) => {
        const maxQty = order.orderItems[index].qty;
        const newQty = Math.min(Math.max(1, qty), maxQty);
        setSelectedItems(prev => prev.map((item, i) => 
            i === index ? { ...item, returnQty: newQty } : item
        ));
    };

    const calculateRefundAmount = () => {
        return selectedItems
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.price * item.returnQty), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const itemsToReturn = selectedItems
            .filter(item => item.selected)
            .map(item => ({
                product: item.product,
                name: item.name,
                qty: item.returnQty,
                price: item.price,
                image: item.image
            }));

        if (itemsToReturn.length === 0) {
            setError('Lütfen iade etmek istediğiniz ürünleri seçin');
            return;
        }

        if (!reason) {
            setError('Lütfen iade nedeninizi seçin');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            await api.post('/returns', {
                orderId,
                items: itemsToReturn,
                reason,
                reasonDetails
            });
            
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'İade talebi oluşturulurken hata oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="loading-state">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="success-card">
                        <CheckCircle size={64} className="success-icon" />
                        <h2>İade Talebiniz Alındı</h2>
                        <p>İade talebiniz başarıyla oluşturuldu. Talebiniz en kısa sürede incelenecek ve size bilgi verilecektir.</p>
                        <p className="refund-info">Tahmini iade tutarı: <strong>₺{calculateRefundAmount().toFixed(2)}</strong></p>
                        <div className="success-actions">
                            <Link to="/profile" className="btn btn-primary">
                                Siparişlerime Dön
                            </Link>
                        </div>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="error-card">
                        <AlertCircle size={48} />
                        <h2>Sipariş Bulunamadı</h2>
                        <p>Bu sipariş bulunamadı veya erişim yetkiniz yok.</p>
                        <Link to="/profile" className="btn btn-primary">Geri Dön</Link>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    // Check if order is eligible for return
    const daysSinceOrder = Math.floor((Date.now() - new Date(order.deliveredAt || order.paidAt || order.createdAt)) / (1000 * 60 * 60 * 24));
    const isEligible = order.isPaid && daysSinceOrder <= 14;

    if (!isEligible) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="error-card">
                        <AlertCircle size={48} />
                        <h2>İade Yapılamaz</h2>
                        <p>
                            {!order.isPaid 
                                ? 'Ödenmemiş siparişler için iade talebi oluşturulamaz.'
                                : 'İade süresi (14 gün) dolmuştur.'
                            }
                        </p>
                        <Link to="/profile" className="btn btn-primary">Geri Dön</Link>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    return (
        <div className="return-request-page">
            <div className="container">
                <Link to="/profile" className="back-link">
                    <ArrowLeft size={20} /> Siparişlerime Dön
                </Link>

                <div className="return-header">
                    <h1><Package size={28} /> İade Talebi Oluştur</h1>
                    <p>Sipariş #{order._id.slice(-8).toUpperCase()}</p>
                </div>

                <form onSubmit={handleSubmit} className="return-form">
                    {/* Select Items */}
                    <div className="form-section">
                        <h2>İade Edilecek Ürünler</h2>
                        <p className="section-desc">İade etmek istediğiniz ürünleri ve miktarları seçin</p>
                        
                        <div className="return-items">
                            {selectedItems.map((item, index) => (
                                <div key={index} className={`return-item ${item.selected ? 'selected' : ''}`}>
                                    <label className="item-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleItemSelection(index)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <img src={item.image} alt={item.name} className="item-image" />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-price">₺{item.price.toFixed(2)}</p>
                                    </div>
                                    {item.selected && (
                                        <div className="qty-selector">
                                            <button type="button" onClick={() => updateReturnQty(index, item.returnQty - 1)}>-</button>
                                            <span>{item.returnQty}</span>
                                            <button type="button" onClick={() => updateReturnQty(index, item.returnQty + 1)}>+</button>
                                            <span className="max-qty">/ {item.qty}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="form-section">
                        <h2>İade Nedeni</h2>
                        <div className="reason-options">
                            {returnReasons.map(r => (
                                <label key={r.value} className={`reason-option ${reason === r.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r.value}
                                        checked={reason === r.value}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="form-section">
                        <h2>Ek Açıklama (İsteğe Bağlı)</h2>
                        <textarea
                            value={reasonDetails}
                            onChange={(e) => setReasonDetails(e.target.value)}
                            placeholder="İade nedeniniz hakkında daha fazla bilgi verebilirsiniz..."
                            rows={4}
                        />
                    </div>

                    {/* Summary */}
                    <div className="return-summary">
                        <div className="summary-row">
                            <span>İade Edilecek Ürün Sayısı:</span>
                            <strong>{selectedItems.filter(i => i.selected).reduce((sum, i) => sum + i.returnQty, 0)}</strong>
                        </div>
                        <div className="summary-row total">
                            <span>Tahmini İade Tutarı:</span>
                            <strong>₺{calculateRefundAmount().toFixed(2)}</strong>
                        </div>
                        <p className="summary-note">
                            * İade tutarı, ürün incelemesi sonrasında kesinleşecektir.
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-submit"
                        disabled={submitting || selectedItems.filter(i => i.selected).length === 0 || !reason}
                    >
                        {submitting ? 'Gönderiliyor...' : 'İade Talebini Gönder'}
                        <Send size={18} />
                    </button>
                </form>
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .return-request-page {
        min-height: 80vh;
        padding: 2rem 0 4rem;
        background: var(--color-background);
    }

    .return-request-page .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-text-muted);
        text-decoration: none;
        margin-bottom: 2rem;
        transition: color 0.2s;
    }

    .back-link:hover {
        color: var(--color-gold);
    }

    .return-header {
        margin-bottom: 2rem;
    }

    .return-header h1 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.75rem;
        color: var(--color-text);
        margin-bottom: 0.5rem;
    }

    .return-header p {
        color: var(--color-text-muted);
    }

    .return-form {
        background: var(--color-surface);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .form-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .form-section:last-of-type {
        border-bottom: none;
    }

    .form-section h2 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 0.5rem;
    }

    .section-desc {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .return-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .return-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 12px;
        border: 2px solid transparent;
        transition: all 0.2s;
    }

    .return-item.selected {
        border-color: var(--color-gold);
        background: rgba(212, 175, 55, 0.05);
    }

    .item-checkbox {
        position: relative;
        cursor: pointer;
    }

    .item-checkbox input {
        opacity: 0;
        position: absolute;
    }

    .item-checkbox .checkmark {
        width: 22px;
        height: 22px;
        border: 2px solid #ccc;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .item-checkbox input:checked + .checkmark {
        background: var(--color-gold);
        border-color: var(--color-gold);
    }

    .item-checkbox input:checked + .checkmark::after {
        content: '✓';
        color: white;
        font-size: 14px;
    }

    .item-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
    }

    .item-details {
        flex: 1;
    }

    .item-details h4 {
        font-size: 0.95rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .item-price {
        color: var(--color-gold);
        font-weight: 600;
    }

    .qty-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .qty-selector button {
        width: 28px;
        height: 28px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .qty-selector button:hover {
        border-color: var(--color-gold);
    }

    .qty-selector span {
        min-width: 24px;
        text-align: center;
    }

    .max-qty {
        color: var(--color-text-muted);
        font-size: 0.85rem;
    }

    .reason-options {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
    }

    .reason-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        background: #f8f9fa;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .reason-option:hover {
        background: #f0f0f0;
    }

    .reason-option.selected {
        border-color: var(--color-gold);
        background: rgba(212, 175, 55, 0.05);
    }

    .reason-option input {
        accent-color: var(--color-gold);
    }

    .form-section textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.95rem;
        resize: vertical;
        transition: border-color 0.2s;
    }

    .form-section textarea:focus {
        outline: none;
        border-color: var(--color-gold);
    }

    .return-summary {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .summary-row.total {
        font-size: 1.1rem;
        padding-top: 0.75rem;
        border-top: 1px solid #ddd;
        margin-top: 0.75rem;
    }

    .summary-row.total strong {
        color: var(--color-gold);
    }

    .summary-note {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-top: 1rem;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #fff5f5;
        color: #c53030;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .btn-submit {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
    }

    .success-card, .error-card {
        text-align: center;
        background: var(--color-surface);
        padding: 3rem;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .success-icon {
        color: #48bb78;
        margin-bottom: 1.5rem;
    }

    .success-card h2, .error-card h2 {
        margin-bottom: 1rem;
        color: var(--color-text);
    }

    .success-card p, .error-card p {
        color: var(--color-text-muted);
        margin-bottom: 1rem;
    }

    .refund-info {
        font-size: 1.1rem;
        color: var(--color-text);
    }

    .refund-info strong {
        color: var(--color-gold);
    }

    .success-actions {
        margin-top: 2rem;
    }

    .error-card svg {
        color: #e53e3e;
        margin-bottom: 1rem;
    }

    .loading-state {
        text-align: center;
        padding: 4rem;
        color: var(--color-text-muted);
    }

    @media (max-width: 640px) {
        .return-form {
            padding: 1.5rem;
        }

        .return-item {
            flex-wrap: wrap;
        }

        .qty-selector {
            width: 100%;
            justify-content: flex-end;
            margin-top: 0.5rem;
        }

        .reason-options {
            grid-template-columns: 1fr;
        }
    }
`;

export default ReturnRequest;
