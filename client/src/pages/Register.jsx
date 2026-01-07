import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', { firstName, lastName, email, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page container section">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join the Selené community</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="name-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                placeholder="First name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                placeholder="Last name"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </form>

                <p className="auth-footer" style={{ marginTop: '2rem' }}>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>

            <style>{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }
        .auth-card {
          background: var(--color-surface);
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 450px;
          text-align: center;
        }
        .auth-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }
        .auth-form {
          text-align: left;
        }
        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 4px;
          font-family: inherit;
          transition: border-color 0.3s;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
        .btn-block {
          width: 100%;
        }
        .auth-footer {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .auth-footer a {
          color: var(--color-gold);
          font-weight: 600;
        }
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.8rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
};

export default Register;
