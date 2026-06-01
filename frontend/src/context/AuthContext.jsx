import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Verify token and fetch user details
            fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Token invalid');
                return res.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                logout();
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (jwt, userData) => {
        localStorage.setItem('token', jwt);
        setToken(jwt);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
