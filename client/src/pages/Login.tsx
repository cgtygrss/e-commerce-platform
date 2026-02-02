import React, { useState, useContext, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User } from '../types';

interface LoginResponse {
    token: string;
    user: User;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post<LoginResponse>('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || 'Login failed');
            } else {
                setError('Login failed');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await api.post<LoginResponse>('/auth/google', { token: credentialResponse.credential });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err: unknown) {
            setError('Google login failed');
            console.error(err);
        }
    };

    return (
        <div className="auth-page container section">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to access your account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        theme="outline"
                        size="large"
                        width="100%"
                    />
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
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
        .divider {
          display: flex;
          align-items: center;
          margin: 2rem 0;
          color: var(--color-text-muted);
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.1);
        }
        .divider span {
          padding: 0 1rem;
          font-size: 0.85rem;
        }
        .google-login-wrapper {
          margin-bottom: 1.5rem;
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
          background: #fee;
          color: #c00;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
};

// Import axios for error checking
import axios from 'axios';

export default Login;
