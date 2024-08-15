import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        setAuthToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ authToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
