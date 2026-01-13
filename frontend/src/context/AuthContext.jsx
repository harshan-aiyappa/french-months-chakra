
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for persisted auth on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('vocalis_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Sanitize legacy avatar URLs
                if (parsed.avatar && (parsed.avatar.includes('cloudinary') || parsed.avatar.includes('bit.ly'))) {
                    parsed.avatar = '/assets/personIcon.png';
                    localStorage.setItem('vocalis_user', JSON.stringify(parsed));
                }
                setUser(parsed);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem('vocalis_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: '1',
                    name: 'Demo User',
                    email: email,
                    avatar: '/assets/personIcon.png'
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                localStorage.setItem('vocalis_user', JSON.stringify(mockUser));
                setIsLoading(false);
                resolve(mockUser);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('vocalis_user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
