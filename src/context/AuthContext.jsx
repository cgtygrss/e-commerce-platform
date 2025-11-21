import React, { createContext, useState, useEffect, useContext } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/auth/login',
                { email, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/auth/register',
                { name, email, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        googleLogout();
    };

    const googleLoginHandler = async (tokenResponse) => {
        try {
            setError(null);
            // Get user info from Google
            const googleUserRes = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json',
                    },
                }
            );

            const { email, name, id } = googleUserRes.data;

            // Send to backend
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/auth/google',
                { email, name, googleId: id },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    const updateProfile = async (userUpdates) => {
        try {
            setError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                '/api/auth/profile',
                userUpdates,
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return true;
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, googleLoginHandler, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
