import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Shipping = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { shippingAddress } = cart;
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { address, city, postalCode, country },
        });
        navigate('/placeorder');
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <h1>Shipping</h1>
            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label>Address</label>
                    <input 
                        type="text" 
                        required 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input 
                        type="text" 
                        required 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Postal Code</label>
                    <input 
                        type="text" 
                        required 
                        value={postalCode} 
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Country</label>
                    <input 
                        type="text" 
                        required 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Continue</button>
            </form>
             <style>{`
                .form-control {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-top: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default Shipping;
