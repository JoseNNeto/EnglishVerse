import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface User {
    id: number;
    nome: string;
    sub: string; // Subject, which is the email
    exp: number; // Expiration time as a Unix timestamp
}

// Define the shape of the context data
interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    exp: number | null;
    login: (token: string) => void;
    logout: () => void;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
                const currentTime = Date.now() / 1000; // current time in seconds

                if (decodedUser.exp && decodedUser.exp < currentTime) {
                    // Token is expired
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                    console.warn("Expired token found in storage, removed.");
                } else {
                    // Token is valid
                    setUser(decodedUser);
                    setToken(storedToken);
                }
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
        <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, exp: user ? user.exp : null, login, logout }}>
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
