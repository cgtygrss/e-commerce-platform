import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Settings, LogOut, ChevronRight, Eye, EyeOff, Save, X, ChevronDown, Calendar, Mail, Shield } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user, logout, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password change verification state
    const [passwordChangeStep, setPasswordChangeStep] = useState(0); // 0: idle, 1: code sent, 2: verified
    const [verificationCode, setVerificationCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [verifyingCode, setVerifyingCode] = useState(false);

    // Countries and cities state
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(null);
    const [selectedAddressCountry, setSelectedAddressCountry] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        phoneCountryCode: 'TR',
        gender: '',
        birthDate: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
        },
        password: '',
        confirmPassword: ''
    });

    // Fetch countries on mount
    useEffect(() => {
        fetchCountries();
    }, []);

    // Set default phone country to Turkey when countries load
    useEffect(() => {
        if (countries.length > 0 && !selectedPhoneCountry) {
            const turkey = countries.find(c => c.code === 'TR');
            if (turkey) {
                setSelectedPhoneCountry(turkey);
            }
        }
    }, [countries]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (countries.length > 0) {
            fetchProfile();
        }
    }, [user, navigate, countries]);

    // Fetch cities when address country changes
    useEffect(() => {
        if (selectedAddressCountry) {
            fetchCities(selectedAddressCountry.code);
        }
    }, [selectedAddressCountry]);

    const fetchCountries = async () => {
        try {
            const response = await api.get('/countries');
            // Sort countries alphabetically by name
            const sortedCountries = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCountries(sortedCountries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchCities = async (countryCode) => {
        setCitiesLoading(true);
        try {
            const response = await api.get(`/countries/${countryCode}/cities`);
            // Sort cities alphabetically
            const sortedCities = response.data.sort((a, b) => a.localeCompare(b));
            setCities(sortedCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCities([]);
        }
        setCitiesLoading(false);
    };

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const data = response.data;
            
            // Parse phone to extract country code
            let phoneNumber = data.phone || '';
            let phoneCountryCode = 'TR';
            
            if (phoneNumber && countries.length > 0) {
                // Try to match the phone number to a country code
                for (const country of countries) {
                    if (phoneNumber.startsWith(country.phoneCode)) {
                        phoneCountryCode = country.code;
                        phoneNumber = phoneNumber.substring(country.phoneCode.length).trim();
                        break;
                    }
                }
            }
            
            const phoneCountry = countries.find(c => c.code === phoneCountryCode);
            setSelectedPhoneCountry(phoneCountry || countries[0]);
            
            // Set address country
            const addressCountry = countries.find(c => c.name === data.address?.country);
            if (addressCountry) {
                setSelectedAddressCountry(addressCountry);
            }
            
            setFormData({
                name: data.name || '',
                surname: data.surname || '',
                email: data.email || '',
                phone: phoneNumber,
                phoneCountryCode: phoneCountryCode,
                gender: data.gender || '',
                birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                address: {
                    street: data.address?.street || '',
                    city: data.address?.city || '',
                    postalCode: data.address?.postalCode || '',
                    country: data.address?.country || ''
                },
                password: '',
                confirmPassword: ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const response = await api.get('/orders/user/myorders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage({ type: 'error', text: 'Failed to load orders' });
        }
        setOrdersLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'orders' && orders.length === 0) {
            fetchOrders();
        }
    }, [activeTab]);

    // Format phone number according to country format
    const formatPhoneNumber = (value, format) => {
        if (!format || !value) return value;
        
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Build formatted string based on format pattern
        let formatted = '';
        let digitIndex = 0;
        
        for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
            if (format[i] === 'X') {
                formatted += digits[digitIndex];
                digitIndex++;
            } else {
                formatted += format[i];
            }
        }
        
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const rawValue = e.target.value;
        const digits = rawValue.replace(/\D/g, '');
        
        // Limit digits based on format
        const maxDigits = selectedPhoneCountry?.phoneFormat?.replace(/[^X]/g, '').length || 10;
        const limitedDigits = digits.substring(0, maxDigits);
        
        const formattedPhone = formatPhoneNumber(limitedDigits, selectedPhoneCountry?.phoneFormat);
        
        setFormData(prev => ({
            ...prev,
            phone: formattedPhone
        }));
    };

    const handlePhoneCountryChange = (e) => {
        const countryCode = e.target.value;
        const country = countries.find(c => c.code === countryCode);
        setSelectedPhoneCountry(country);
        setFormData(prev => ({
            ...prev,
            phoneCountryCode: countryCode,
            phone: '' // Reset phone when country changes
        }));
    };

    const handleAddressCountryChange = (e) => {
        const countryCode = e.target.value;
        const country = countries.find(c => c.code === countryCode);
        setSelectedAddressCountry(country);
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                country: country?.name || '',
                city: '' // Reset city when country changes
            }
        }));
    };

    const handleCityChange = (e) => {
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                city: e.target.value
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Request verification code for password change
    const handleRequestPasswordCode = async () => {
        if (!formData.password || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Please enter your new password first' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSendingCode(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/auth/request-password-change');
            setPasswordChangeStep(1);
            setMessage({ type: 'success', text: 'Verification code sent to your email!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send verification code' });
        }
        setSendingCode(false);
    };

    // Verify code and change password
    const handleVerifyAndChangePassword = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter the 6-digit verification code' });
            return;
        }

        setVerifyingCode(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/auth/verify-password-change', {
                code: verificationCode,
                newPassword: formData.password
            });
            
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            setPasswordChangeStep(0);
            setVerificationCode('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to verify code' });
        }
        setVerifyingCode(false);
    };

    // Cancel password change
    const handleCancelPasswordChange = () => {
        setPasswordChangeStep(0);
        setVerificationCode('');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Don't allow password in regular form submit - must use verification flow
        if (formData.password) {
            setMessage({ type: 'error', text: 'Please use the "Change Password" button to update your password' });
            return;
        }

        setSaving(true);
        try {
            // Combine phone country code with phone number
            const fullPhone = selectedPhoneCountry 
                ? `${selectedPhoneCountry.phoneCode} ${formData.phone}`
                : formData.phone;

            const updateData = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: fullPhone,
                gender: formData.gender,
                birthDate: formData.birthDate || null,
                address: formData.address
            };

            const response = await api.put('/auth/profile', updateData);
            
            // Update local storage user data
            const token = localStorage.getItem('token');
            login(token, response.data);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        }
        setSaving(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusInfo = (order) => {
        // Check new status field first, fallback to isPaid/isDelivered
        if (order.status) {
            const statusMap = {
                pending: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.25)', text: 'Ödeme Bekleniyor', icon: '⏳' },
                processing: { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.25)', text: 'Hazırlanıyor', icon: '📦' },
                shipped: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.25)', text: 'Kargoya Verildi', icon: '🚚' },
                delivered: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.25)', text: 'Teslim Edildi', icon: '✅' },
                return_requested: { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.25)', text: 'İade Talebi', icon: '↩️' },
                return_approved: { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.25)', text: 'İade Onaylandı', icon: '✓' },
                refunded: { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.25)', text: 'İade Edildi', icon: '💰' },
                cancelled: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.25)', text: 'İptal Edildi', icon: '✕' }
            };
            return statusMap[order.status] || statusMap.pending;
        }
        
        // Fallback for orders without status field
        if (order.isDelivered) return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.25)', text: 'Teslim Edildi', icon: '✅' };
        if (order.isPaid) return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.25)', text: 'Hazırlanıyor', icon: '📦' };
        return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.25)', text: 'Ödeme Bekleniyor', icon: '⏳' };
    };

    const canRequestReturn = (order) => {
        if (!order.isPaid) return false;
        if (order.status === 'return_requested' || order.status === 'return_approved' || order.status === 'refunded' || order.status === 'cancelled') return false;
        
        const returnWindowDays = 14;
        const referenceDate = order.deliveredAt || order.paidAt || order.createdAt;
        const daysSinceOrder = Math.floor((Date.now() - new Date(referenceDate)) / (1000 * 60 * 60 * 24));
        return daysSinceOrder <= returnWindowDays;
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-loading-container">
                        <div className="loading-spinner"></div>
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={48} />
                    </div>
                    <div className="profile-welcome">
                        <h1>Welcome, {formData.name}!</h1>
                        <p>Manage your account settings and view your orders</p>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-sidebar">
                        <button 
                            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('profile'); setMessage(null); }}
                        >
                            <User size={20} />
                            <span>Personal Info</span>
                            <ChevronRight size={16} />
                        </button>
                        <button 
                            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('orders'); setMessage(null); }}
                        >
                            <Package size={20} />
                            <span>My Orders</span>
                            <ChevronRight size={16} />
                        </button>
                        <button 
                            className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('settings'); setMessage(null); }}
                        >
                            <Settings size={20} />
                            <span>Password & Security</span>
                            <ChevronRight size={16} />
                        </button>
                        <button className="sidebar-item logout" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>

                    <div className="profile-main">
                        {message && message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                                <button onClick={() => setMessage({ type: '', text: '' })}>
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="profile-section">
                                <h2>Personal Information</h2>
                                <p className="section-desc">Update your personal details here</p>
                                
                                <form onSubmit={handleSubmit} className="profile-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                name="surname"
                                                value={formData.surname}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <div className="phone-input-group">
                                                <div className="phone-country-select">
                                                    <span className="country-flag">{selectedPhoneCountry?.flag || '🌍'}</span>
                                                    <select
                                                        value={selectedPhoneCountry?.code || ''}
                                                        onChange={handlePhoneCountryChange}
                                                    >
                                                        {countries.map(country => (
                                                            <option key={country.code} value={country.code}>
                                                                {country.flag} {country.name} ({country.phoneCode})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className="phone-code">{selectedPhoneCountry?.phoneCode || '+1'}</span>
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                    placeholder={selectedPhoneCountry?.phonePlaceholder || '123 456 7890'}
                                                    className="phone-number-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Prefer not to say</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group birthday-group">
                                            <label>Birth Date</label>
                                            <div className="birthday-input-wrapper">
                                                <input
                                                    type="date"
                                                    name="birthDate"
                                                    value={formData.birthDate}
                                                    onChange={handleChange}
                                                    className="birthday-input"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                                <Calendar size={20} className="birthday-icon" />
                                                <span className="birthday-underline"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3>Address</h3>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <div className="select-wrapper">
                                                <select
                                                    value={selectedAddressCountry?.code || ''}
                                                    onChange={handleAddressCountryChange}
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries.map(country => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.flag} {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="select-arrow" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>City</label>
                                            <div className="select-wrapper">
                                                <select
                                                    value={formData.address.city}
                                                    onChange={handleCityChange}
                                                    disabled={!selectedAddressCountry || citiesLoading}
                                                >
                                                    <option value="">
                                                        {citiesLoading ? 'Loading cities...' : 'Select City'}
                                                    </option>
                                                    {cities.map(city => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="select-arrow" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            name="address.postalCode"
                                            value={formData.address.postalCode}
                                            onChange={handleChange}
                                            placeholder="12345"
                                        />
                                    </div>

                                    <button type="submit" className="btn-save" disabled={saving}>
                                        <Save size={18} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="profile-section">
                                <h2>Siparişlerim</h2>
                                <p className="section-desc">Siparişlerinizi görüntüleyin ve takip edin</p>

                                {ordersLoading ? (
                                    <div className="orders-loading">
                                        <div className="loader"></div>
                                        <p>Siparişler yükleniyor...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="no-orders">
                                        <Package size={64} />
                                        <h3>Henüz sipariş yok</h3>
                                        <p>Sipariş verdiğinizde burada görünecektir</p>
                                        <button onClick={() => navigate('/shop')} className="btn-shop">
                                            Alışverişe Başla
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => {
                                            const statusInfo = getStatusInfo(order);
                                            return (
                                                <div key={order._id} className="order-card">
                                                    {/* Order Header */}
                                                    <div className="order-header">
                                                        <div className="order-meta">
                                                            <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                                            <span className="order-date">{formatDate(order.createdAt)}</span>
                                                        </div>
                                                        <div 
                                                            className="order-status-badge"
                                                            style={{ 
                                                                color: statusInfo.color, 
                                                                backgroundColor: statusInfo.bg,
                                                                borderColor: statusInfo.color
                                                            }}
                                                        >
                                                            <span className="status-icon">{statusInfo.icon}</span>
                                                            {statusInfo.text}
                                                        </div>
                                                    </div>

                                                    {/* Order Progress */}
                                                    <div className="order-progress">
                                                        <div className={`progress-step ${order.isPaid ? 'completed' : 'active'}`}>
                                                            <div className="step-dot"></div>
                                                            <span>Sipariş Alındı</span>
                                                        </div>
                                                        <div className="progress-line" style={{ background: order.isPaid ? statusInfo.color : '#e5e7eb' }}></div>
                                                        <div className={`progress-step ${order.isPaid ? (order.status === 'shipped' || order.isDelivered ? 'completed' : 'active') : ''}`}>
                                                            <div className="step-dot"></div>
                                                            <span>Kargoya Verildi</span>
                                                        </div>
                                                        <div className="progress-line" style={{ background: order.isDelivered ? statusInfo.color : '#e5e7eb' }}></div>
                                                        <div className={`progress-step ${order.isDelivered ? 'completed' : ''}`}>
                                                            <div className="step-dot"></div>
                                                            <span>Teslim Edildi</span>
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    <div className="order-items-grid">
                                                        {order.orderItems.map((item, idx) => (
                                                            <div key={idx} className="order-item-card">
                                                                <div className="item-image-wrapper">
                                                                    <img src={item.image} alt={item.name} />
                                                                    <span className="item-qty-badge">{item.qty}</span>
                                                                </div>
                                                                <div className="item-info">
                                                                    <span className="item-name">{item.name}</span>
                                                                    <span className="item-price">₺{(item.price * item.qty).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Order Footer */}
                                                    <div className="order-footer">
                                                        <div className="footer-left">
                                                            <div className="shipping-address">
                                                                <span className="label">Teslimat Adresi</span>
                                                                <span className="value">{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                                                            </div>
                                                        </div>
                                                        <div className="footer-right">
                                                            <div className="order-total">
                                                                <span className="label">Toplam</span>
                                                                <span className="value">₺{order.totalPrice.toFixed(2)}</span>
                                                            </div>
                                                            <div className="order-actions">
                                                                {(order.status === 'shipped' || order.status === 'delivered' || order.trackingNumber) && (
                                                                    <Link 
                                                                        to={`/order/${order._id}/tracking`} 
                                                                        className="track-order-btn"
                                                                    >
                                                                        📦 Kargo Takibi
                                                                    </Link>
                                                                )}
                                                                {canRequestReturn(order) && (
                                                                    <Link 
                                                                        to={`/return-request/${order._id}`} 
                                                                        className="return-request-btn"
                                                                    >
                                                                        İade Talebi Oluştur
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="profile-section">
                                <h2>Password & Security</h2>
                                <p className="section-desc">Update your password to keep your account secure</p>

                                <div className="profile-form">
                                    {/* Step 0: Enter new password */}
                                    {passwordChangeStep === 0 && (
                                        <>
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter new password"
                                                        minLength={6}
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="toggle-password"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm New Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="toggle-password"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="password-hint">
                                                Password must be at least 6 characters long. A verification code will be sent to your email.
                                            </p>

                                            <button 
                                                type="button"
                                                className="btn-save" 
                                                disabled={sendingCode || !formData.password || !formData.confirmPassword}
                                                onClick={handleRequestPasswordCode}
                                            >
                                                <Mail size={18} />
                                                {sendingCode ? 'Sending Code...' : 'Send Verification Code'}
                                            </button>
                                        </>
                                    )}

                                    {/* Step 1: Enter verification code */}
                                    {passwordChangeStep === 1 && (
                                        <>
                                            <div className="verification-info">
                                                <Shield size={48} className="verification-icon" />
                                                <h3>Enter Verification Code</h3>
                                                <p>We've sent a 6-digit code to your email address. Please enter it below to confirm your password change.</p>
                                            </div>

                                            <div className="form-group">
                                                <label>Verification Code</label>
                                                <input
                                                    type="text"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="Enter 6-digit code"
                                                    className="verification-code-input"
                                                    maxLength={6}
                                                />
                                            </div>

                                            <p className="password-hint">
                                                The code will expire in 10 minutes. Didn't receive it? Check your spam folder or request a new code.
                                            </p>

                                            <div className="button-group">
                                                <button 
                                                    type="button"
                                                    className="btn-cancel" 
                                                    onClick={handleCancelPasswordChange}
                                                >
                                                    <X size={18} />
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="btn-save" 
                                                    disabled={verifyingCode || verificationCode.length !== 6}
                                                    onClick={handleVerifyAndChangePassword}
                                                >
                                                    <Shield size={18} />
                                                    {verifyingCode ? 'Verifying...' : 'Verify & Change Password'}
                                                </button>
                                            </div>

                                            <button 
                                                type="button"
                                                className="btn-resend" 
                                                onClick={handleRequestPasswordCode}
                                                disabled={sendingCode}
                                            >
                                                {sendingCode ? 'Sending...' : 'Resend Code'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .profile-page {
                    padding: 4rem 0;
                    min-height: 80vh;
                }

                .profile-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                    text-align: center;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(212, 175, 55, 0.15);
                    border-top-color: var(--color-gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1.5rem;
                }

                .loading-text {
                    font-size: 1.1rem;
                    color: var(--color-text);
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }

                .loading-dots {
                    display: flex;
                    gap: 6px;
                }

                .loading-dots span {
                    width: 8px;
                    height: 8px;
                    background: var(--color-gold);
                    border-radius: 50%;
                    animation: loadingDot 1.4s ease-in-out infinite;
                }

                .loading-dots span:nth-child(1) { animation-delay: 0s; }
                .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes loadingDot {
                    0%, 80%, 100% {
                        transform: scale(0.6);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .orders-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    color: var(--color-text-muted);
                }

                .loader {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(212, 175, 55, 0.2);
                    border-top-color: var(--color-gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-gold), #c9a227);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text-dark);
                }

                .profile-welcome h1 {
                    font-family: var(--font-heading);
                    font-size: 1.8rem;
                    color: var(--color-text);
                    margin-bottom: 0.25rem;
                }

                .profile-welcome p {
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                }

                .profile-content {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2rem;
                }

                .profile-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    border-radius: 8px;
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .sidebar-item span {
                    flex: 1;
                    text-align: left;
                }

                .sidebar-item:hover {
                    background: rgba(212, 175, 55, 0.05);
                    color: var(--color-text);
                    border-color: rgba(212, 175, 55, 0.2);
                }

                .sidebar-item.active {
                    background: rgba(212, 175, 55, 0.1);
                    color: var(--color-gold);
                    border-color: var(--color-gold);
                }

                .sidebar-item.logout {
                    margin-top: 1rem;
                    color: #ef4444;
                }

                .sidebar-item.logout:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .profile-main {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    border-radius: 12px;
                    padding: 2rem;
                }

                .message {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }

                .message.success {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                }

                .message.error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }

                .message button {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 0.25rem;
                }

                .profile-section h2 {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    color: var(--color-text);
                    margin-top: 0;
                    margin-bottom: 0.5rem;
                }

                .section-desc {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }

                .profile-section h3 {
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    color: var(--color-gold);
                    margin: 2rem 0 1rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(212, 175, 55, 0.1);
                }

                .profile-form {
                    max-width: 600px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-group label {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-radius: 6px;
                    color: var(--color-text);
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: var(--color-gold);
                }

                .form-group select {
                    cursor: pointer;
                    appearance: none;
                }

                .form-group select:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .select-wrapper {
                    position: relative;
                }

                .select-wrapper select {
                    padding-right: 2.5rem;
                }

                .select-wrapper .select-arrow {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-text-muted);
                    pointer-events: none;
                }

                /* Phone input styles */
                .phone-input-group {
                    display: flex;
                    gap: 0;
                }

                .phone-country-select {
                    position: relative;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-right: none;
                    border-radius: 6px 0 0 6px;
                    padding: 0 0.75rem;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }

                .phone-country-select:hover {
                    border-color: rgba(212, 175, 55, 0.4);
                }

                .country-flag {
                    font-size: 1.1rem;
                    line-height: 1;
                    margin-right: 0.4rem;
                    position: relative;
                    z-index: 2;
                }

                .phone-code {
                    color: var(--color-text);
                    font-size: 0.9rem;
                    font-weight: 500;
                    white-space: nowrap;
                    position: relative;
                    z-index: 2;
                }

                .phone-country-select select {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.001;
                    cursor: pointer;
                    z-index: 3;
                    font-size: 16px;
                }

                .phone-number-input {
                    flex: 1;
                    border-radius: 0 6px 6px 0 !important;
                }

                /* Birthday input styles - Minimalist underline style */
                .birthday-group label {
                    color: var(--color-gold);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 0.5rem;
                }

                .birthday-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .birthday-input {
                    width: 100%;
                    padding: 1rem 3rem 1rem 1rem;
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid rgba(212, 175, 55, 0.3);
                    border-radius: 0;
                    color: var(--color-text);
                    font-size: 1.1rem;
                    font-weight: 300;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .birthday-input:hover {
                    border-bottom-color: rgba(212, 175, 55, 0.5);
                }

                .birthday-input:focus {
                    outline: none;
                    border-bottom-color: transparent;
                }

                .birthday-input-wrapper .birthday-icon {
                    position: absolute;
                    right: 1rem;
                    color: var(--color-gold);
                    opacity: 0.7;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }

                .birthday-input-wrapper:hover .birthday-icon {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .birthday-underline {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--color-gold), #f4d03f, var(--color-gold));
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateX(-50%);
                }

                .birthday-input:focus ~ .birthday-underline {
                    width: 100%;
                }

                .birthday-input::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }

                .password-input {
                    position: relative;
                }

                .password-input input {
                    padding-right: 3rem;
                }

                .toggle-password {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                }

                .toggle-password:hover {
                    color: var(--color-gold);
                }

                .password-hint {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin-bottom: 1.5rem;
                }

                .verification-info {
                    text-align: center;
                    padding: 2rem;
                    background: rgba(212, 175, 55, 0.05);
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .verification-icon {
                    color: var(--color-gold);
                    margin-bottom: 1rem;
                }

                .verification-info h3 {
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-text);
                }

                .verification-info p {
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                .verification-code-input {
                    text-align: center;
                    font-size: 1.5rem !important;
                    letter-spacing: 8px;
                    font-weight: 600;
                    font-family: 'Courier New', monospace;
                }

                .button-group {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .btn-cancel {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: transparent;
                    color: var(--color-text-muted);
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 6px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-cancel:hover {
                    background: rgba(0,0,0,0.05);
                    color: var(--color-text);
                }

                .btn-resend {
                    background: none;
                    border: none;
                    color: var(--color-gold);
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 0.5rem 0;
                    text-decoration: underline;
                }

                .btn-resend:hover {
                    color: #c9a227;
                }

                .btn-resend:disabled {
                    color: var(--color-text-muted);
                    cursor: not-allowed;
                }

                .btn-save {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: var(--color-gold);
                    color: var(--color-text-dark);
                    border: none;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-save:hover:not(:disabled) {
                    background: #c9a227;
                    transform: translateY(-1px);
                }

                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Orders */
                .no-orders {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: var(--color-text-muted);
                }

                .no-orders svg {
                    opacity: 0.3;
                    margin-bottom: 1rem;
                }

                .no-orders h3 {
                    font-family: var(--font-heading);
                    font-size: 1.3rem;
                    color: var(--color-text);
                    margin-bottom: 0.5rem;
                }

                .btn-shop {
                    margin-top: 1.5rem;
                    padding: 0.875rem 2rem;
                    background: var(--color-gold);
                    color: var(--color-text-dark);
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-shop:hover {
                    background: #c9a227;
                }

                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .order-card {
                    background: linear-gradient(145deg, #ffffff, #f8f9fa);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .order-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.15);
                    border-color: rgba(212, 175, 55, 0.5);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(212, 175, 55, 0.03));
                    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                }

                .order-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .order-id {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #b8860b;
                    letter-spacing: 0.5px;
                }

                .order-date {
                    font-size: 0.85rem;
                    color: #666;
                }

                .order-status-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 2px solid;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .status-icon {
                    font-size: 1.1rem;
                }

                /* Order Progress */
                .order-progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.25rem 1.5rem;
                    background: linear-gradient(135deg, #f0f4f8, #e8ecf0);
                    gap: 0;
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    opacity: 0.4;
                    transition: opacity 0.3s;
                }

                .progress-step.active,
                .progress-step.completed {
                    opacity: 1;
                }

                .progress-step .step-dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #d1d5db;
                    border: 3px solid #e5e7eb;
                    transition: all 0.3s;
                }

                .progress-step.active .step-dot {
                    background: #d4af37;
                    border-color: #b8860b;
                    box-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
                }

                .progress-step.completed .step-dot {
                    background: #22c55e;
                    border-color: #16a34a;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
                }

                .progress-step span {
                    font-size: 0.8rem;
                    color: #6b7280;
                    white-space: nowrap;
                    font-weight: 500;
                }

                .progress-step.active span,
                .progress-step.completed span {
                    color: #1f2937;
                    font-weight: 600;
                }

                .progress-line {
                    flex: 1;
                    height: 3px;
                    max-width: 80px;
                    background: #e5e7eb;
                    margin: 0 0.5rem;
                    margin-bottom: 1.5rem;
                    border-radius: 2px;
                }

                /* Order Items Grid */
                .order-items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                    background: #fafbfc;
                }

                .order-item-card {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    padding: 0.875rem;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .order-item-card:hover {
                    background: #ffffff;
                    border-color: #d4af37;
                    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
                }

                .item-image-wrapper {
                    position: relative;
                    flex-shrink: 0;
                }

                .item-image-wrapper img {
                    width: 55px;
                    height: 55px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 2px solid #e5e7eb;
                }

                .item-qty-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: #ffffff;
                    font-size: 0.7rem;
                    font-weight: 700;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 6px rgba(212, 175, 55, 0.4);
                }

                .item-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    min-width: 0;
                }

                .item-info .item-name {
                    font-size: 0.9rem;
                    color: #1f2937;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: 500;
                }

                .item-info .item-price {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #b8860b;
                }

                /* Order Footer */
                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), #ffffff);
                    border-top: 2px solid rgba(212, 175, 55, 0.2);
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .footer-left, .footer-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .footer-right {
                    flex-wrap: wrap;
                }

                .shipping-address, .order-total {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .shipping-address .label,
                .order-total .label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6b7280;
                    font-weight: 600;
                }

                .shipping-address .value {
                    font-size: 0.9rem;
                    color: #374151;
                    font-weight: 500;
                }

                .order-total .value {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #b8860b;
                }

                .order-actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .track-order-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.7rem 1.4rem;
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 2px solid #60a5fa;
                    color: #2563eb;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2);
                }

                .track-order-btn:hover {
                    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                    border-color: #3b82f6;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    transform: translateY(-1px);
                }

                .return-request-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.7rem 1.4rem;
                    background: linear-gradient(135deg, #fff7ed, #ffedd5);
                    border: 2px solid #fb923c;
                    color: #ea580c;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    box-shadow: 0 2px 8px rgba(251, 146, 60, 0.2);
                }

                .return-request-btn:hover {
                    background: linear-gradient(135deg, #ffedd5, #fed7aa);
                    border-color: #ea580c;
                    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
                    transform: translateY(-1px);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .profile-content {
                        grid-template-columns: 1fr;
                    }

                    .profile-sidebar {
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                    .sidebar-item {
                        flex: 1;
                        min-width: 120px;
                        justify-content: center;
                    }

                    .sidebar-item span {
                        display: none;
                    }

                    .sidebar-item svg:last-child {
                        display: none;
                    }
                }

                @media (max-width: 600px) {
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .order-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }

                    .order-progress {
                        padding: 1rem;
                        overflow-x: auto;
                    }

                    .progress-step span {
                        font-size: 0.65rem;
                    }

                    .order-items-grid {
                        grid-template-columns: 1fr;
                        padding: 1rem;
                    }

                    .order-footer {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }

                    .footer-left, .footer-right {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }

                    .order-actions {
                        flex-direction: column;
                    }

                    .track-order-btn,
                    .return-request-btn {
                        justify-content: center;
                        width: 100%;
                    }

                    .phone-input-group {
                        flex-direction: column;
                    }

                    .phone-country-select {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
