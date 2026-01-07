import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Package, Settings, LogOut, ChevronRight, Eye, EyeOff, Save, X, ChevronDown, Calendar } from 'lucide-react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
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

            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await api.put('/auth/profile', updateData);
            
            // Update local storage user data
            const token = localStorage.getItem('token');
            login(token, response.data);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
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

    const getStatusColor = (isPaid, isDelivered) => {
        if (isDelivered) return '#10b981';
        if (isPaid) return '#f59e0b';
        return '#ef4444';
    };

    const getStatusText = (isPaid, isDelivered) => {
        if (isDelivered) return 'Delivered';
        if (isPaid) return 'Processing';
        return 'Pending Payment';
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loader"></div>
                <p>Loading profile...</p>
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
                                <h2>My Orders</h2>
                                <p className="section-desc">View and track your order history</p>

                                {ordersLoading ? (
                                    <div className="orders-loading">
                                        <div className="loader"></div>
                                        <p>Loading orders...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="no-orders">
                                        <Package size={64} />
                                        <h3>No orders yet</h3>
                                        <p>When you place orders, they will appear here</p>
                                        <button onClick={() => navigate('/shop')} className="btn-shop">
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => (
                                            <div key={order._id} className="order-card">
                                                <div className="order-header">
                                                    <div className="order-info">
                                                        <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                                    </div>
                                                    <span 
                                                        className="order-status"
                                                        style={{ backgroundColor: getStatusColor(order.isPaid, order.isDelivered) }}
                                                    >
                                                        {getStatusText(order.isPaid, order.isDelivered)}
                                                    </span>
                                                </div>
                                                <div className="order-items">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="order-item">
                                                            <img src={item.image} alt={item.name} />
                                                            <div className="item-details">
                                                                <span className="item-name">{item.name}</span>
                                                                <span className="item-qty">Qty: {item.qty}</span>
                                                            </div>
                                                            <span className="item-price">${item.price.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-footer">
                                                    <div className="shipping-info">
                                                        <strong>Shipping to:</strong> {order.shippingAddress.city}, {order.shippingAddress.country}
                                                    </div>
                                                    <div className="order-total">
                                                        <span>Total:</span>
                                                        <strong>${order.totalPrice.toFixed(2)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="profile-section">
                                <h2>Password & Security</h2>
                                <p className="section-desc">Update your password to keep your account secure</p>

                                <form onSubmit={handleSubmit} className="profile-form">
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
                                        Password must be at least 6 characters long. Leave empty if you don't want to change it.
                                    </p>

                                    <button 
                                        type="submit" 
                                        className="btn-save" 
                                        disabled={saving || (!formData.password && !formData.confirmPassword)}
                                    >
                                        <Save size={18} />
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
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

                .profile-loading, .orders-loading {
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
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(212, 175, 55, 0.15);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: rgba(212, 175, 55, 0.05);
                    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                }

                .order-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .order-id {
                    font-weight: 600;
                    color: var(--color-text);
                    font-size: 0.95rem;
                }

                .order-date {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .order-status {
                    padding: 0.375rem 0.875rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .order-items {
                    padding: 1rem 1.25rem;
                }

                .order-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .order-item:last-child {
                    border-bottom: none;
                }

                .order-item img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .item-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .item-name {
                    color: var(--color-text);
                    font-size: 0.9rem;
                }

                .item-qty {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                }

                .item-price {
                    font-weight: 600;
                    color: var(--color-gold);
                }

                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: rgba(212, 175, 55, 0.03);
                    border-top: 1px solid rgba(212, 175, 55, 0.1);
                }

                .shipping-info {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .shipping-info strong {
                    color: var(--color-text);
                }

                .order-total {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                }

                .order-total span {
                    color: var(--color-text-muted);
                }

                .order-total strong {
                    font-size: 1.1rem;
                    color: var(--color-gold);
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

                    .order-footer {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
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
