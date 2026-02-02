import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, ArrowLeft, AlertCircle, CheckCircle, Upload, X, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { Order, OrderItem } from '../types';
import axios from 'axios';

interface ReturnItem {
    orderItemId: string;
    productId: string;
    name: string;
    qty: number;
    returnQty: number;
    selected: boolean;
    image: string;
}

interface ReasonOption {
    value: string;
    label: string;
}

const ReturnRequest: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
    const [returnReason, setReturnReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    const reasonOptions: ReasonOption[] = [
        { value: 'defective', label: 'Ürün arızalı/bozuk' },
        { value: 'wrong_item', label: 'Yanlış ürün gönderildi' },
        { value: 'not_as_described', label: 'Ürün açıklamaya uymuyor' },
        { value: 'damaged', label: 'Ürün hasarlı geldi' },
        { value: 'changed_mind', label: 'Fikrimi değiştirdim' },
        { value: 'other', label: 'Diğer' }
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrder();
    }, [orderId, user, navigate]);

    const fetchOrder = async () => {
        if (!orderId) return;
        try {
            const response = await api.get<Order>(`/orders/${orderId}`);
            setOrder(response.data);

            // Initialize return items
            const items: ReturnItem[] = response.data.orderItems.map((item: OrderItem, index: number) => ({
                orderItemId: `item_${index}`,
                productId: item.product,
                name: item.name,
                qty: item.qty,
                returnQty: 0,
                selected: false,
                image: item.image
            }));
            setReturnItems(items);
            setLoading(false);
        } catch (err) {
            setError('Sipariş bilgisi alınamadı');
            setLoading(false);
        }
    };

    const handleItemToggle = (index: number) => {
        setReturnItems(prev => prev.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    selected: !item.selected,
                    returnQty: !item.selected ? 1 : 0
                };
            }
            return item;
        }));
    };

    const handleQtyChange = (index: number, qty: number) => {
        setReturnItems(prev => prev.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    returnQty: Math.min(Math.max(1, qty), item.qty)
                };
            }
            return item;
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        if (images.length + newFiles.length > 5) {
            setError('En fazla 5 fotoğraf yükleyebilirsiniz');
            return;
        }

        setImages(prev => [...prev, ...newFiles]);

        // Create previews
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedItems = returnItems.filter(item => item.selected);
        if (selectedItems.length === 0) {
            setError('Lütfen iade edilecek ürünleri seçin');
            return;
        }

        if (!returnReason) {
            setError('Lütfen iade sebebini seçin');
            return;
        }

        if (returnReason === 'other' && !otherReason.trim()) {
            setError('Lütfen iade sebebini açıklayın');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('orderId', orderId || '');
            formData.append('items', JSON.stringify(selectedItems.map(item => ({
                productId: item.productId,
                name: item.name,
                qty: item.returnQty
            }))));
            formData.append('reason', returnReason === 'other' ? otherReason : reasonOptions.find(r => r.value === returnReason)?.label || '');

            images.forEach(image => {
                formData.append('images', image);
            });

            await api.post('/returns', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'İade talebi oluşturulurken bir hata oluştu');
            } else {
                setError('İade talebi oluşturulurken bir hata oluştu');
            }
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="success-state">
                        <CheckCircle size={64} className="success-icon" />
                        <h2>İade Talebiniz Alındı!</h2>
                        <p>İade talebiniz başarıyla oluşturuldu. En kısa sürede size dönüş yapılacaktır.</p>
                        <button onClick={() => navigate('/profile')} className="btn-primary">
                            Siparişlerime Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="return-request-page">
                <div className="container">
                    <div className="error-state">
                        <AlertCircle size={48} />
                        <h2>Sipariş Bulunamadı</h2>
                        <p>İade talebi oluşturmak istediğiniz sipariş bulunamadı.</p>
                        <button onClick={() => navigate('/profile')} className="btn-primary">
                            Siparişlerime Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="return-request-page">
            <div className="container">
                <button onClick={() => navigate('/profile')} className="back-btn">
                    <ArrowLeft size={20} /> Siparişlerime Dön
                </button>

                <div className="return-request-header">
                    <Package size={32} />
                    <h1>İade Talebi Oluştur</h1>
                    <p>Sipariş #{orderId?.slice(-8).toUpperCase()}</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="return-request-form">
                    {/* Select Items */}
                    <div className="form-section">
                        <h3>İade Edilecek Ürünleri Seçin</h3>
                        <div className="items-list">
                            {returnItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`item-card ${item.selected ? 'selected' : ''}`}
                                    onClick={() => handleItemToggle(index)}
                                >
                                    <div className="item-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => handleItemToggle(index)}
                                        />
                                    </div>
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">Miktar: {item.qty}</span>
                                    </div>
                                    {item.selected && (
                                        <div className="return-qty" onClick={e => e.stopPropagation()}>
                                            <label>İade Miktarı:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.qty}
                                                value={item.returnQty}
                                                onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Return Reason */}
                    <div className="form-section">
                        <h3>İade Sebebi</h3>
                        <div className="select-wrapper">
                            <select
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                required
                            >
                                <option value="">Sebep Seçin</option>
                                {reasonOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="select-arrow" />
                        </div>

                        {returnReason === 'other' && (
                            <textarea
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Lütfen iade sebebini açıklayın..."
                                rows={4}
                                required
                            />
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="form-section">
                        <h3>Fotoğraf Ekle (İsteğe Bağlı)</h3>
                        <p className="hint">Ürünle ilgili sorunu gösteren fotoğraflar ekleyebilirsiniz (max 5)</p>

                        <div className="image-upload">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="image-preview">
                                    <img src={preview} alt={`Preview ${index + 1}`} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="remove-image"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label className="upload-btn">
                                    <Upload size={24} />
                                    <span>Fotoğraf Ekle</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? 'Gönderiliyor...' : 'İade Talebi Oluştur'}
                    </button>
                </form>
            </div>

            <style>{`
                .return-request-page {
                    min-height: 80vh;
                    padding: 2rem 0 4rem;
                    background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #666;
                    text-decoration: none;
                    margin-bottom: 2rem;
                    font-weight: 500;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    cursor: pointer;
                }

                .back-btn:hover {
                    color: #b8860b;
                }

                .return-request-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .return-request-header svg {
                    color: #b8860b;
                    margin-bottom: 1rem;
                }

                .return-request-header h1 {
                    font-size: 1.8rem;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .return-request-header p {
                    color: #6b7280;
                }

                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    color: #dc2626;
                    margin-bottom: 1.5rem;
                }

                .form-section {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .form-section h3 {
                    font-size: 1.1rem;
                    color: #1f2937;
                    margin-bottom: 1rem;
                }

                .items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .item-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .item-card:hover {
                    border-color: #b8860b;
                }

                .item-card.selected {
                    border-color: #b8860b;
                    background: #fefce8;
                }

                .item-checkbox input {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .item-card img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .item-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .item-name {
                    font-weight: 500;
                    color: #1f2937;
                }

                .item-qty {
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                .return-qty {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .return-qty label {
                    font-size: 0.85rem;
                    color: #6b7280;
                }

                .return-qty input {
                    width: 60px;
                    padding: 0.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    text-align: center;
                }

                .select-wrapper {
                    position: relative;
                }

                .select-wrapper select {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    padding-right: 2.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    background: white;
                    cursor: pointer;
                    appearance: none;
                }

                .select-wrapper select:focus {
                    outline: none;
                    border-color: #b8860b;
                }

                .select-arrow {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    pointer-events: none;
                }

                textarea {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-family: inherit;
                    resize: vertical;
                    margin-top: 1rem;
                }

                textarea:focus {
                    outline: none;
                    border-color: #b8860b;
                }

                .hint {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin-bottom: 1rem;
                }

                .image-upload {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .image-preview {
                    position: relative;
                    width: 100px;
                    height: 100px;
                }

                .image-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .remove-image {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ef4444;
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .upload-btn {
                    width: 100px;
                    height: 100px;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .upload-btn:hover {
                    border-color: #b8860b;
                    color: #b8860b;
                }

                .upload-btn span {
                    font-size: 0.75rem;
                }

                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Loading State */
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #b8860b;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Success State */
                .success-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .success-icon {
                    color: #22c55e;
                    margin-bottom: 1.5rem;
                }

                .success-state h2 {
                    font-size: 1.5rem;
                    color: #1f2937;
                    margin-bottom: 1rem;
                }

                .success-state p {
                    color: #6b7280;
                    margin-bottom: 2rem;
                }

                /* Error State */
                .error-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .error-state svg {
                    color: #ef4444;
                    margin-bottom: 1rem;
                }

                .error-state h2 {
                    font-size: 1.5rem;
                    color: #1f2937;
                    margin-bottom: 1rem;
                }

                .error-state p {
                    color: #6b7280;
                    margin-bottom: 2rem;
                }

                .btn-primary {
                    display: inline-block;
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
                }

                /* Responsive */
                @media (max-width: 600px) {
                    .item-card {
                        flex-wrap: wrap;
                    }

                    .return-qty {
                        width: 100%;
                        margin-top: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReturnRequest;
