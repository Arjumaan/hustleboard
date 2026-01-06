import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persistent login
        const storedUser = localStorage.getItem('hustleboard_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        if (email && password) {
            const userData = {
                name: email.split('@')[0], // Use part of email as name
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
            };
            setUser(userData);
            localStorage.setItem('hustleboard_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hustleboard_user');
    };

    const signup = (name, email, password) => {
        // Mock signup logic
        if (name && email && password) {
            const userData = {
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
            };
            setUser(userData);
            localStorage.setItem('hustleboard_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const updateUser = (updates) => {
        const newUser = { ...user, ...updates };
        setUser(newUser);
        localStorage.setItem('hustleboard_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
