import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface User {
    nome: string;
    sub: string; // Subject, which is the email
}

// Define the shape of the context data
interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // When the app loads, try to get the token from localStorage
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<User>(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (error) {
                // If token is invalid, remove it
                localStorage.removeItem('authToken');
                console.error("Invalid token found in storage", error);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        try {
            const decodedUser = jwtDecode<User>(newToken);
            localStorage.setItem('authToken', newToken);
            setUser(decodedUser);
            setToken(newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
