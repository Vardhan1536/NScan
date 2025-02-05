import React, {createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if a user is already authenticated by the presence of a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser(localStorage.getItem('username'));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Replace this with the real login API call to the backend
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { token } = data; // Assuming the token is returned from the API

      setIsAuthenticated(true);
      setUser(username);

      // Store the token securely in localStorage (only store the token, not the password)
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } catch (error) {
      console.error(error);
      alert('Login failed. Please try again.');
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      // Replace this with the real signup API call to the backend
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      const { token } = data; // Assuming the token is returned from the API

      setIsAuthenticated(true);
      setUser(username);

      // Store the token securely in localStorage (only store the token, not the password)
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } catch (error) {
      console.error(error);
      alert('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
